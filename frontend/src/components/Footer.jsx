import "./Footer.css";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Footer({ token }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!token) {
      // Only show toast if truly logged out
      toast.info("Please log in or sign up to add a paper", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Navigate to AddPaper page if logged in
    navigate("/add-paper");
  };

  return (
    <footer className="footer">
      <button className="add-paper-btn" onClick={handleClick}>
        <FaPlus className="icon" /> Add Paper
      </button>
    </footer>
  );
}

export default Footer;
