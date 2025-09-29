import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PapersList from "./components/PapersList.jsx";
import PaperDetail from "./components/PaperDetail.jsx";
import Login from "./components/LogIn.jsx";
import Signup from "./components/SignUp.jsx";
import AddPaper from "./components/AddPaper.jsx";
import UpdatePaper from "./components/UpdatePaper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [papers, setPapers] = useState([]);

  // Restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("rp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setToken(parsed.token);
        setCurrentUser({
          _id: parsed._id,
          name: parsed.name,
          email: parsed.email,
        });
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
    setAuthLoaded(true);
  }, []);

  // Fetch papers
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/papers");
        const data = await res.json();
        setPapers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch papers from server.");
      }
    };
    fetchPapers();
  }, []);

  const handleNewPaper = (newPaper) => {
    setPapers((prev) => [newPaper, ...prev]);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar
          token={token}
          onLogout={() => {
            localStorage.removeItem("rp_user");
            setToken("");
            setCurrentUser(null);
            toast.info("Logged out");
          }}
          onShowLogin={() => setShowLogin(true)}
          onShowSignup={() => setShowSignup(true)}
        />
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <main>
          {authLoaded && (
            <Routes>
              <Route
                path="/"
                element={<PapersList papers={papers} searchTerm={searchTerm} />}
              />
              <Route
                path="/paper/:id"
                element={
                  <PaperDetail
                    papers={papers}
                    token={token}
                    currentUser={currentUser}
                  />
                }
              />
              <Route
                path="/update-paper/:id"
                element={
                  <UpdatePaper token={token} currentUser={currentUser} />
                }
              />
              <Route
                path="/add-paper"
                element={<AddPaper token={token} onNewPaper={handleNewPaper} />}
              />
            </Routes>
          )}
        </main>

        <Footer token={token} />

        {showLogin && (
          <Login
            onLoginSuccess={(userData) => {
              localStorage.setItem("rp_user", JSON.stringify(userData));
              setToken(userData.token);
              setCurrentUser({
                _id: userData._id,
                name: userData.name,
                email: userData.email,
              });
              setShowLogin(false);
            }}
            onClose={() => setShowLogin(false)}
          />
        )}

        {showSignup && (
          <Signup
            onSignupSuccess={(userData) => {
              localStorage.setItem("rp_user", JSON.stringify(userData));
              setToken(userData.token);
              setCurrentUser({
                _id: userData._id,
                name: userData.name,
                email: userData.email,
              });
              setShowSignup(false);
            }}
            onClose={() => setShowSignup(false)}
          />
        )}

        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
