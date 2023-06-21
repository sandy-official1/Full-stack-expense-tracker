import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:8080/signup", {
        username,
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/expenses");
      toast.success("Signup Succesfull")
    } catch (error) {
      console.error(error);
      toast.error("Error")
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div className="signup-input-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="signup-input-group">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="signup-input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="signup-button" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
};

export default Signup;
