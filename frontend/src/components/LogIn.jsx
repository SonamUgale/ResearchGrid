import { useState } from "react";
import "./LogIn.css";
import axios from "axios";
import { toast } from "react-toastify";


function Login({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:8080/api/users/login", {
        email,
        password,
      });

      const userData = res.data;

      if (userData && userData.token) {
        localStorage.setItem("rp_user", JSON.stringify(userData));

        toast.success("Logged in successfully!");
        onLoginSuccess(userData);
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed. Try again.");
      }
    }
  };

  const getInputClass = (field) => {
    if (errors[field]) return "input-error";
    if (!errors[field] && (field === "email" ? email : password))
      return "input-success";
    return "";
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className={getInputClass("email")}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) validate();
              }}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={getInputClass("password")}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) validate();
              }}
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
