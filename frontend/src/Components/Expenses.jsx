import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleUpdateExpense = (id) => {
    const expenseToUpdate = expenses.find((expense) => expense.id === id);
    if (expenseToUpdate) {
      navigate("/updateform", { state: { expense: expenseToUpdate } });
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchExpenses();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.amount}</td>
              <td>{expense.description}</td>
              <td>{expense.category}</td>
              <td>
                <button onClick={() => handleUpdateExpense(expense.id)}>
                  Update
                </button>
                <button onClick={() => handleDeleteExpense(expense.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Expenses;
