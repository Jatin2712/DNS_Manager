import React, { useState } from "react";
import axios from "../../services/api";
import "../base.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseURL = 'https://dns-manager-a549.onrender.com/api';
const RegisterForm = () => {
  const [userData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { confirmPassword, ...submitData } = userData;
    try {
      const response = await axios.post(
        baseURL+`/users/register`,
        submitData
      );
      toast.success(response.data.message);
      navigate("/login", { state: { message: response.data.message } });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error Registering User");
        setErrors('Invalid email or password');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="loginForm">
      <ToastContainer position="top-right" />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={userData.firstname}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={userData.lastname}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              className="form-control"
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
        </div>
        <div className="mb-3">
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="form-control"
            />
            <div className="input-group-append">
              <span
                className="input-group-text"
                onClick={toggleShowConfirmPassword}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={
                    showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </span>
            </div>
          </div>
        </div>
        {errors && <div className="alert alert-danger">{errors}</div>}
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
