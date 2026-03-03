// src/App.js
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import authStore from "./stores/authStore";
import SignupForm from "./SignupForm";
import Header from "./global/Header";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";
import { Modal, Button } from "antd";
import Exam from "./Exam"; // Import the Exam component
import Home from "./Home"; // Import the Exam component
import Footer from "./global/Footer";


const App = observer(() => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };


  return (
    <div style={{ textAlign: "center", marginTop: 0 }}>
      {authStore.isAuthenticated ? (
        <div>
          <Router>
            <Header />
            <Switch>
              <Route path="/exam" component={Exam} />
              <Route path="/home" component={Home} />
              {/* Add other routes */}
            </Switch>
            <Footer />
          </Router>
        </div>
      ) : (
        <div>
          {isLogin ? (
            <LoginPage toggleForm={toggleForm} />
          ) : (
            <SignupForm toggleForm={toggleForm} />
          )}
        </div>
      )}
    </div>
  );
});

export default App;
