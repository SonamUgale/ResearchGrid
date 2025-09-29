import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaperCard.css";

function PaperCard({ paper }) {
  const navigate = useNavigate();

  // Authors: now guaranteed to be an array from backend
  const authorsList = Array.isArray(paper.authors) ? paper.authors : [];

  // Tags: already working as before
  const tagsList = Array.isArray(paper.tags)
    ? paper.tags.filter((t) => t.trim() !== "")
    : [];

  return (
    <div className="paper-card" onClick={() => navigate(`/paper/${paper.id}`)}>
      <h3 className="paper-title">{paper.title || "Untitled Paper"}</h3>
      <p className="authors">{authorsList.join(", ")}</p>
      <p className="abstract">
        {paper.abstract?.length > 180
          ? `${paper.abstract.slice(0, 180)}...`
          : paper.abstract || "No abstract available"}
      </p>
      <div className="paper-footer">
        <div className="meta">
          <span>{paper.journal || "Unknown Journal"}</span>
          <span>{paper.year || "N/A"}</span>
        </div>
        <div className="tags">
          {tagsList.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaperCard;
