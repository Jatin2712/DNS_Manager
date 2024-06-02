import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../base.css";
const baseURL = 'http://localhost:8000/api';
function LoginForm({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL+`/users/login`,
        formData
      );
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);
        setIsAuthenticated(true);
        navigate("/dns-table", { state: { message: response.data.message } });
      }
    } catch (err) {
      toast.error("Invalid Email or Password");
      setError('Invalid email or password');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="loginForm">
      <ToastContainer position="top-right" />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="label-icon">
            <FontAwesomeIcon icon={faEnvelope} /> Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="label-icon">
            <FontAwesomeIcon icon={faLock} /> Password:
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="input-group-append">
              <span
                className="input-group-text"
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </span>
            </div>
          </div>
          <button className="btn" onClick={() => navigate("/register")}>
            Don't have an account? Register
          </button>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default LoginForm;
