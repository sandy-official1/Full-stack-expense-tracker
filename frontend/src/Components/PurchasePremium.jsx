import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PurchasePremium.css"

const PurchasePremium = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isPremium, setIsPremium] = useState(
    JSON.parse(localStorage.getItem("isPremium")) || false
  ); // Parse the stored value to boolean

  const showLeaderboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/premium/showleaderboard"
      );
      const leaderboardData = response.data;
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch leaderboard when component mounts
    showLeaderboard();
  }, []);

  const createRazorpayOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:8080/purchase-premium",
        null,
        config
      );
      const { orderId } = response.data;

      const options = {
        key: "rzp_test_YjiHLDNnRzK6x4",
        amount: 10000,
        currency: "INR",
        name: "Sandybhai",
        description: "Premium Membership",
        order_id: orderId,
        handler: function (response) {
          if (response.razorpay_payment_id) {
            toast.success("Transaction successful");
            updateOrderStatus(orderId);
            showLeaderboard(); // Fetch updated leaderboard after successful transaction
          } else {
            toast.error("Transaction failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatus = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        "http://localhost:8080/razorpay-webhook",
        { event: "payment.captured", payload: { order_id: orderId } },
        config
      );

      localStorage.setItem("isPremium", JSON.stringify(true));
      setIsPremium(true); // Update the state to true
      toast.success("You are a Premium user now 🥳"); // Show a toast notification for premium upgrade
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    
      {isPremium && (
        <div>
          <h3>Premium Content Section</h3>
          {/* Render the premium content here */}
          <button onClick={showLeaderboard}>Show Leaderboard</button>
          <h4>Leaderboard of Expenses</h4>
          <ul>
            {leaderboard.map((expense, index) => (
              <li key={index}>
                User: {expense.User.username}, Total Expense: {expense.totalExpense}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isPremium && (
        <div>
          <h2>Purchase Premium Membership</h2>
          <button onClick={createRazorpayOrder} className="purchase-button">
            Purchase
          </button>

        </div>
      )}
    </div>
  );
};

export default PurchasePremium;
