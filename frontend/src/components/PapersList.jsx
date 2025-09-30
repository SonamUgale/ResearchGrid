import { useNavigate } from "react-router-dom";
import "./paperCard.css";

function PapersList({ papers, searchTerm }) {
  const navigate = useNavigate();

  const filteredPapers = papers.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredPapers.length === 0) {
    return <p style={{ textAlign: "center" }}>No papers found.</p>;
  }

  return (
    <div className="papers-grid">
      {filteredPapers.map((paper) => {
        const abstractPreview =
          paper.abstract && paper.abstract.length > 180
            ? paper.abstract.slice(0, 180) + "..."
            : paper.abstract;

        return (
          <div
            key={paper.id}
            className="paper-card"
            onClick={() => navigate(`/paper/${paper.id}`)}
          >
            <h3>{paper.title}</h3>
            <p className="authors">{paper.authors}</p>

            <p className="abstract">
              {abstractPreview}
              {paper.abstract && paper.abstract.length > 180 && (
                <span className="read-more">Read More</span>
              )}
            </p>

            <div className="bottom-section">
              <div className="meta">
                <span>{paper.journal}</span>
                <span>{paper.year}</span>
              </div>

              <div className="tags">
                {paper.tags &&
                  (Array.isArray(paper.tags)
                    ? paper.tags
                    : paper.tags.split(",").map((t) => t.trim())
                  ).map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PapersList;
