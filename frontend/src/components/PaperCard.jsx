import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaperCard.css";

function PaperCard({ paper }) {
  const navigate = useNavigate();
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const authorsList = Array.isArray(paper.authors) ? paper.authors : [];

  const tagsList = Array.isArray(paper.tags)
    ? paper.tags.filter((t) => t.trim() !== "").slice(0, 2)
    : [];

  const abstractLimit = 140;
  const isLongAbstract =
    paper.abstract && paper.abstract.length > abstractLimit;
  const displayedAbstract =
    showFullAbstract || !isLongAbstract
      ? paper.abstract
      : `${paper.abstract.slice(0, abstractLimit)}...`;

  return (
    <div className="paper-card" onClick={() => navigate(`/paper/${paper.id}`)}>
      <h3 className="paper-title">{paper.title || "Untitled Paper"}</h3>
      <p className="authors">{authorsList.join(", ")}</p>
      <p className={`abstract ${showFullAbstract ? "expanded" : ""}`}>
        {displayedAbstract}
        {isLongAbstract && (
          <span
            className="read-more"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullAbstract(!showFullAbstract);
            }}
          >
            {showFullAbstract ? " Show less" : " Read more"}
          </span>
        )}
      </p>
      <div className="paper-footer bottom-section">
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
