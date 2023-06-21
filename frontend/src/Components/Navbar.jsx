import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
    toast.success("Logout Succesfull")
  };

  const isAuthenticated = localStorage.getItem("token");

  return (
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
        {isAuthenticated && (
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
            <li className="navbar-item">
              <button className="navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
