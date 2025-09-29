import "./Sidebar.css";
import {
  FaBook,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

function Sidebar({ token, onLogout, onShowLogin, onShowSignup }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">My Library</h2>

      <ul className="sidebar-links">
        <li>
          <button className="btn">
            <FaBook className="icon" /> Papers
          </button>
        </li>
        <li>
          <button className="btn">
            <FaUser className="icon" /> Profile
          </button>
        </li>
      </ul>

      <div className="sidebar-bottom">
        <button className="sidebar-btn">
          <FaCog className="icon" /> Settings
        </button>

        {token ? (
          <button className="sidebar-btn logout" onClick={onLogout}>
            <FaSignOutAlt className="icon" /> Logout
          </button>
        ) : (
          <>
            <button className="sidebar-btn" onClick={onShowLogin}>
              <FaSignInAlt className="icon" /> Login
            </button>
            <button className="sidebar-btn" onClick={onShowSignup}>
              <FaUserPlus className="icon" /> Sign Up
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
