import React, { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchasePremium = () => {
  useEffect(() => {
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

    createRazorpayOrder();
  }, []);

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
      toast.success("You are a Premium user now 🥳"); // Show a toast notification for premium upgrade
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
 
      <h2>Purchase Premium Membership</h2>
      {/* Add any additional content or styling here */}
    </div>
  );
};

export default PurchasePremium;
