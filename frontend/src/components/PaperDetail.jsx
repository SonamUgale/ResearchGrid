import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Notes from "./Notes";
import "./PaperDetail.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function PaperDetail({ token, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/papers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaper(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch paper");
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id, token]);

  if (loading) return <p>Loading paper...</p>;
  if (error || !paper) return <p>{error || "Paper not found."}</p>;

  const authorsList = Array.isArray(paper.authors)
    ? paper.authors
    : paper.authors
        ?.toString()
        .split(",")
        .map((a) => a.trim()) || [];

  const tagsList = Array.isArray(paper.tags)
    ? paper.tags.filter((t) => t.trim() !== "")
    : paper.tags
        ?.toString()
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "") || [];

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/papers/${paper.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Paper deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete paper");
    }
  };

  const handleEdit = () => navigate(`/update-paper/${paper.id}`);

  return (
    <div className="paper-detail-wrapper">
      <div className="back-link-wrapper">
        <span className="back-link" onClick={() => navigate("/")}>
          ← Back to Papers
        </span>
      </div>

      <div className="paper-detail-card">
        <h1 className="paper-title">{paper.title}</h1>
        <p className="paper-authors">By {authorsList.join(", ")}</p>
        <div className="paper-abstract">
          <p>
            <b>ABSTRACT</b>
          </p>
          {paper.abstract || "No abstract available"}
        </div>
        <div className="paper-meta">
          <span>{paper.journal || "Unknown Journal"}</span>
          <p>|</p>
          <span>{paper.year || "N/A"}</span>
        </div>

        {}
        <div className="paper-tags">
          {tagsList.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {currentUser && paper.user === currentUser._id && (
          <div className="detail-buttons">
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <Notes paperId={paper.id} token={token} currentUser={currentUser} />

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this paper?</h3>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaperDetail;
