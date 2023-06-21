import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

const ExpenseForm = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleAddExpense = async () => {
    try {
      if (!amount || !description || !category) {
        toast.error("Please fill in all fields");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/expenses",
        {
          amount,
          description,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Expense added:", response.data);
      toast.success("Expense added successfully");
      setAmount("");
      setDescription("");
      setCategory("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense");
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Add Expense</h2>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Petrol">Petrol</option>
        <option value="Salary">Salary</option>
        {/* Add more options for categories */}
      </select>
      <button onClick={handleAddExpense}>Add Expense</button>
      
    </div>
  );
};

export default ExpenseForm;
