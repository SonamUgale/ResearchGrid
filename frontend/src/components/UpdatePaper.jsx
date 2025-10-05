import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddPaper.css";


function UpdatePaper({ token, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [journal, setJournal] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/papers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const paper = res.data;

        setTitle(paper.title || "");
        setAuthors(
          Array.isArray(paper.authors) ? paper.authors.join(", ") : ""
        );
        setAbstract(paper.abstract || "");
        setJournal(paper.journal || "");
        setYear(paper.year || "");
        setTags(Array.isArray(paper.tags) ? paper.tags.join(", ") : "");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch paper");
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id, token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authorsArray =
        typeof authors === "string"
          ? authors
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : Array.isArray(authors)
          ? authors
          : [];

      const tagsArray =
        typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [];

      const formData = new FormData();
      formData.append("title", title);
      formData.append("authors", JSON.stringify(authorsArray));
      formData.append("abstract", abstract);
      formData.append("journal", journal);
      formData.append("year", year);
      formData.append("tags", JSON.stringify(tagsArray));

      if (file) formData.append("file", file);

      const res = await axios.put(
        `http://localhost:8080/api/papers/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Paper updated successfully!");
      navigate(`/paper/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update paper");
    }
  };

  if (loading) return <p>Loading paper...</p>;

  return (
    <div className="add-paper-wrapper">
      <h2>Update Paper</h2>
      <form className="add-paper-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Authors (comma separated)"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          required
        />
        <textarea
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
        />
        <input
          type="text"
          placeholder="Journal"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="file-upload">
          <label>
            {file ? file.name : "Upload Paper File"}
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>
        <button type="submit">Update Paper</button>
      </form>
    </div>
  );
}

export default UpdatePaper;
