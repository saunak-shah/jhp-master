import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Checkbox } from "antd";
import authStore from "../stores/authStore";
import logo from "../assets/logo.jpeg"; // Import your logo image
import "../css/index.css";
import Cookies from 'js-cookie'; // Import js-cookie library

const { Title, Text } = Typography;
const LoginForm = ({ toggleForm, history }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load stored login details if they exist
    // const userId = localStorage.getItem("teacher_id");
    const userId = authStore.user?.teacher_id;
    // const username = localStorage.getItem("teacher_username");
    const username = authStore.user?.teacher_username;
    const storedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (storedRememberMe && userId) {
      form.setFieldsValue({
        username: username,
        remember: storedRememberMe,
      });
    }
  }, [form]);

  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response;
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(); // Calls the login handler when Enter is pressed
    }
  };

  const handleLogin = async () => {
    try {
      await form
        .validateFields()
        .then((values) => {
          const apiHost = process.env.REACT_APP_API_HOST;
          const loginUrl = `${apiHost}/api/teachers/login`;

          return postData(loginUrl, values);
        })
        .then((response) => {
          if (response.status === 200) {
            message.success("Login successful.");
            return response.json(); // Only parse JSON if the response is successful
          } else {
            message.error("Login failed. Please check your credentials.");
            throw new Error("Failed to log in");
          }
        })
        .then((data) => {
          const userData = {
            teacher_id: data.data.teacher_id,
            teacher_username: data.data.teacher_username,
            teacher_first_name: data.data.teacher_first_name,
            teacher_last_name: data.data.teacher_last_name,
            token: data.data.token,
            master_role_id: data.data.master_role_id,
            role_access: data.data.role_access,
          };

          // Save user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData));

          // Store in mobx store
          authStore.login(userData);

          localStorage.setItem("teacher_id", data.data.teacher_id || "");
          // localStorage.setItem("teacher_username", data.data.teacher_username || "");
          // localStorage.setItem("teacher_first_name", data.data.teacher_first_name || "");
          // localStorage.setItem("teacher_last_name", data.data.teacher_last_name || "");
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("master_role_id", data.data.master_role_id);
          // localStorage.setItem('role_access', JSON.stringify(data.data.role_access));


          if (form.getFieldValue("remember")) {
            Cookies.set('token', data.data.token, { expires: 7 }); // Cookie expires in 7 days
            localStorage.setItem("rememberMe", "true");
          } else {
            Cookies.remove('token'); // Remove the cookie if not remembering the user
          }
          // localStorage.setItem('isAuthenticated', 'true');
          // Update authentication state
          // authStore.login();
          history.push('/home'); // Redirect to Home page
        })
        .catch((error) => {
          console.error("Error during post or processing response:", error);
        });
    } catch (error) {
      console.error("Error during login:", error);
      message.error("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="center-container">
      <Card className='main-login' style={{ width: '100%', maxWidth: '400px' }}>
        <img src={logo} alt="Logo" style={{ width: '25%', margin: 'auto', display: 'block' }} />
        <Title level={3} className="login-title" style={{ textAlign: 'center' }}>Login</Title>
        <Form form={form} layout="vertical">
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input autoFocus onKeyDown={handleKeyPress} />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password onKeyDown={handleKeyPress}  />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" style={{ textAlign: 'left', marginBottom: '10px' }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          {error && <Text type="danger">{error}</Text>}
          <Form.Item style={{ marginTop: '10px', textAlign: 'center' }}>
            <Button className="login-button" type="primary" onClick={handleLogin}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
