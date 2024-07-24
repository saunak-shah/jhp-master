import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import authStore from "../stores/authStore";
import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import Header from "../global/Header";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import { Modal, Button } from "antd";
import Exam from "./Exam";
import Attendance from "./Attendance";
import Home from "./Home";
import Footer from "../global/Footer";
import Cookies from 'js-cookie'; // Import js-cookie

const App = observer(() => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    const user_id = localStorage.getItem('user_id') || '';
    console.log("user_id", user_id)
    const token = Cookies.get('token'); // Get the token from the cookie
    if (user_id || token) {
      authStore.login();
      localStorage.setItem('isAuthenticated', 'true'); // Ensure local storage is also updated
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        {authStore.isAuthenticated ? (
          <div className="main-content">
            <Header />
            <Routes>
              <Route path="/exam" element={<Exam />} />
              <Route path="/home" element={<Home />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </div>
        ) : (
          <div>
            <Routes>
              <Route path="/login" element={<LoginPage toggleForm={toggleForm} />} />
              <Route path="/signup" element={<SignupForm toggleForm={toggleForm} />} />
              <Route path="*" element={<Navigate to={isLogin ? "/login" : "/signup"} />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
});

export default App;
