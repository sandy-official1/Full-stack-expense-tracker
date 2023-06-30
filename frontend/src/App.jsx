import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";
import Expenses from "./Components/Expenses";
import ExpenseForm from "./Components/ExpenseForm";
import UpdateForm from "./Components/UpdateForm";
import PurchasePremium from "./Components/PurchasePremium";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
     
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expensesform" element={<ExpenseForm />} />
          <Route path="/updateform" element={<UpdateForm />} />
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/purchase-premium" element={<PurchasePremium />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
