import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/signin", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/expenses");
      toast.success("Login successful 🥹")
    } catch (error) {
      console.error(error);
      toast.error("User not found")
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="signin-container">
      <h2>Signin</h2>
      <div className="signin-input-group">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="signin-input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="signin-button" onClick={handleSignin}>
        Signin
      </button>
    </div>
  );
};

export default Signin;
