import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import authStore from "../stores/authStore";
import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import Header from "../global/Header";
import AdminUsers from "./AdminUsers";
import UserTable from "./UserTable";
import Exam from "./Exam";
import Attendance from "./Attendance";
import Home from "./Home";
import Footer from "../global/Footer";
import Cookies from 'js-cookie'; // Import js-cookie
import Teacher from "./Teacher";
import ApplicantsView from "../components/ApplicantsView";
import AttendanceReport from "../pages/AttendanceReport";
import ResultsView from "../components/ResultsView";
import Result from "./Result";

const App = observer(() => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from the cookie
    if (token) {
      authStore.login();
      // localStorage.setItem('isAuthenticated', 'true'); // Ensure local storage is also updated
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
              <Route path="/applicants/:examId" element={<ApplicantsView />} /> // New route for viewing applicants
              <Route path="/results/:examId" element={<ResultsView />} /> // New route for viewing results
              <Route path="/attendance/report" element={<AttendanceReport />} /> // New route for viewing applicants
              <Route path="/admin" element={<AdminUsers />} />
              <Route path="/student" element={<UserTable />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/result" element={<Result />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/teacher" element={<Teacher />} />
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
