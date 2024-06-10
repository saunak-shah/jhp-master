// src/LoginForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import authStore from './stores/authStore';
import logo from './assets/jhp-logo.jpg'; // Import your logo image


const { Title, Text } = Typography;

const LoginForm = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const [error, setError] = useState(null);


  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const handleLogin = async () => {
    try {
      authStore.login();
      /* postData("http://localhost:3006/login", { username, password }).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        if(data.status === 200){
          console.log("tyuiopghjkl========")
          authStore.login();
        } else{
          message.error('Login failed. Please check your credentials.');
        }
      }); */
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred during login. Please try again later.');
    }
  };

  return (
    <Card style={{ width: 400, margin: 'auto', marginTop: 200, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <img src={logo} alt="Logo" style={{ width: '30%', margin: 'auto', marginBottom: 20, display: 'block' }} />
      <Title level={3}>Login</Title>
      <Form form={form} layout="vertical">
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password />
        </Form.Item>
        {error && <Text type="danger">{error}</Text>}
        <Form.Item style={{marginTop: '50px', textAlign: 'center' }}>
          <Button style={{width:'150px', height: '40px', backgroundColor: '#f54290'}} type="primary" block onClick={handleLogin}>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};


export default LoginForm;
