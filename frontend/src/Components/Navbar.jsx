 import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false); // Local state for premium status

  useEffect(() => {
    // Check the premium status on component mount
    checkPremiumStatus();
  }, []);

 const checkPremiumStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get("http://localhost:8080/check-premium-status", config);
    const { isPremium } = response.data;

    setIsPremium(isPremium || false); // Update the local state with the premium status

    localStorage.setItem("isPremium", isPremium); // Store the premium status in the local storage
  } catch (error) {
    console.error(error);
  }
};

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("isPremium"); // Remove the premium status from local storage
      setIsPremium(false); // Update the local state for premium status
      navigate("/signin");
      toast.success("Logout Successful");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
    

      <nav className="navbar">
        <ul className="navbar-list">
          {!isAuthenticated && (
            <>
              <li className="navbar-item">
                <Link className="navbar-link" to="/signup">
                  Signup
                </Link>
              </li>
              <li className="navbar-item">
                <Link className="navbar-link" to="/signin">
                  Signin
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && !isPremium && (
            <>
              <li className="navbar-item">
                <Link className="navbar-link" to="/purchase-premium">
                  Buy Premium
                </Link>
              </li>
              <li className="navbar-item">
                <Link className="navbar-link" to="/expenses">
                  Expenses
                </Link>
              </li>
              <li className="navbar-item">
                <Link className="navbar-link" to="/expensesform">
                  Add Expenses
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && isPremium && (
            <>
              <li className="navbar-item">
                <p className="navbar-link">You are a Premium user</p>
              </li>
              <li className="navbar-item">
                <Link className="navbar-link" to="/expenses">
                  Expenses
                </Link>
              </li>
              <li className="navbar-item">
                <Link className="navbar-link" to="/expensesform">
                  Add Expenses
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li className="navbar-item">
              <button className="navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;