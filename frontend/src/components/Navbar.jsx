import "./Navbar.css";
import { FaSearch } from "react-icons/fa";

function Navbar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <header className="navbar">
      <div className="navbar-content">
        {/* Left: Logo */}
        <h1 className="navbar-logo">ResearchGrid</h1>

        {/* Center: Search Box */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={onSearch}>
            Search
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
