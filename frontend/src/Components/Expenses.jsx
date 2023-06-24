import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate(); // Hook for navigation

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalExpenses = response.data;
      setTotalPages(Math.ceil(totalExpenses.length / 10));
      const startIdx = (currentPage - 1) * 10;
      const endIdx = startIdx + 10;
      setExpenses(totalExpenses.slice(startIdx, endIdx));
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage]);

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

  const handleDownloadExpenses = () => {
    const filename = "expenses.csv";
    const csvData = convertToCSV(expenses);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((expense) =>
      Object.values(expense)
        .map((value) => `"${value}"`)
        .join(",")
    );
    return [headers, ...rows].join("\n");
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
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
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
        <button onClick={handleLastPage}>Last Page</button>
      </div>
      <button className="download-button" onClick={handleDownloadExpenses}>
        Download Expenses
      </button>
    
    </div>
  );
};

export default Expenses;
