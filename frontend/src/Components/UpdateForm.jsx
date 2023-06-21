import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const expenseToUpdate = location.state.expense; // Get the expense data from the state

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (expenseToUpdate) {
      // Prefill the form with the expense data
      setAmount(expenseToUpdate.amount);
      setDescription(expenseToUpdate.description);
      setCategory(expenseToUpdate.category);
    }
  }, [expenseToUpdate]);

  const handleUpdateExpense = async () => {
    try {
      if (!amount || !description || !category) {
        console.error("Please fill in all fields");
        return;
      }

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/expenses/${expenseToUpdate.id}`, // Update the expense with the specified ID
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

      navigate("/expenses"); // Navigate back to the expenses page
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Update Expense</h2>
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
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Petrol">Petrol</option>
        <option value="Salary">Salary</option>
        {/* Add more options for categories */}
      </select>
      <button onClick={handleUpdateExpense}>Update Expense</button>
    </div>
  );
};

export default UpdateForm;
