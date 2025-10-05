import { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import { toast } from "react-toastify";


function Signup({ onSignupSuccess, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";

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
      const res = await axios.post("http://localhost:8080/api/users/register", {
        name,
        email,
        password,
      });

      const userData = res.data;

      localStorage.setItem("rp_user", JSON.stringify(userData));

      toast.success("Account created successfully!");
      onSignupSuccess(userData);
    } catch (err) {
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Signup failed. Try again.");
      }
    }
  };

  const getInputClass = (field, value) => {
    if (errors[field]) return "input-error";
    if (!errors[field] && value.trim()) return "input-success";
    return "";
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              className={getInputClass("name", name)}
              onChange={(e) => {
                setName(e.target.value);
                validate();
              }}
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className={getInputClass("email", email)}
              onChange={(e) => {
                setEmail(e.target.value);
                validate();
              }}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={getInputClass("password", password)}
              onChange={(e) => {
                setPassword(e.target.value);
                validate();
              }}
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
