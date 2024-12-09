// src/SignupForm.js
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  DatePicker,
  Radio,
  message
} from "antd";
import authStore from "../stores/authStore";
import logo from "../assets/logo.jpeg"; // Import your logo image
import TextArea from "antd/es/input/TextArea";
import { InstagramFilled, FacebookFilled, YoutubeFilled } from '@ant-design/icons';

const iconStyle = {
  fontSize: '24px', // Adjust the size as needed
  margin: '0 8px', // Add some margin for spacing
  color: 'white' // Ensure the icon color is white
};

const { Title, Text } = Typography;

const SignupForm = ({ toggleForm, history}) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load stored login details if they exist
    const userId = localStorage.getItem('student_id');
    const username = localStorage.getItem('username');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (storedRememberMe && userId) {
      form.setFieldsValue({
        username: username,
        remember: storedRememberMe,
      });
    }

    // Add background styling when component mounts
    document.body.style.backgroundImage = 'url("./bg.jpg")'; // Update the path to your background image
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';

    // Clean up background styling when component unmounts
    return () => {
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
    };
  }, [form]);

  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response;
  }

  const handleSignup = async () => {
    try {
      await form.validateFields()
        .then(values => {
          values.organization_id = 1;
          const apiHost = process.env.REACT_APP_API_HOST;
          const signupUrl = `${apiHost}/api/students/signup`;
  
          return postData(signupUrl, values);
        })
        .then(response => {
          if (response.status === 200) {
            message.success('Signup successful.');
            return response.json(); // Only parse JSON if the response is successful
          } else {
            message.error('Signup failed. Please check your credentials.');
            throw new Error('Failed to signup in.');
          }
        })
        .then(data => {
            localStorage.setItem('student_id', data.data.student_id || '');
            localStorage.setItem('username', data.data.username || '');
            localStorage.setItem('first_name', data.data.first_name || '');
            localStorage.setItem('last_name', data.data.last_name || '');
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('showSignupMessage', 'true');
            localStorage.setItem('isAuthenticated', 'true');
          // Update authentication state
          authStore.login();
          history.push('/home'); // Redirect to Home page
        })
        .catch(error => {
          console.error('Error during post or processing response:', error);
        });
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="center-container">
    <Card className='main-login' style={{ width: '100%', maxWidth: '450px' }}>
      <img src={logo} alt="Logo" style={{ width: '25%', margin: 'auto', display: 'block' }} />
      <Title level={3} className="login-title" style={{ textAlign: 'center' }}>Signup</Title>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 8]}> {/* Adjusted gutter to reduce vertical space */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                { required: true, message: "Please enter your first name" },
                { max: 50, message: "First name must be at most 50 characters" },
              ]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                { required: true, message: "Please enter your last name" },
                { max: 50, message: "Last name must be at most 50 characters" },
              ]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Father Name"
              name="father_name"
              rules={[
                { required: true, message: "Please enter your father name" },
                { max: 50, message: "Father name must be at most 50 characters" },
              ]}
            >
              <Input placeholder="Enter your father name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password length should be greater then 4 characters." }]}
            >
              <Input.Password placeholder="Enter your password" type="password" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Enter your email" type="email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter your address" }]}
            >
              <TextArea placeholder="Enter your address" />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Birth Date"
              name="birth_date"
              rules={[{ required: true, message: "Please select your birth date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Select your birth date" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ paddingLeft: "10px" }}> {/* Adjusted paddingLeft to move gender options to the left */}
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Radio.Group>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {error && <Text type="danger">{error}</Text>}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            className="login-button" 
            type="primary"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </Form.Item>
        <p>Already have an account? <a href='/login' onClick={toggleForm} style={{color: '#103CC3E0', fontWeight: 'bold', fontSize: "16px"}}>Login Here</a></p>
        <div style={{ float: 'right' }}>
          <a href="https://www.youtube.com/@jhpparivar" target="_blank" rel="noopener noreferrer">
            <YoutubeFilled style={iconStyle} />
          </a>
          <a href="https://www.facebook.com/jhpparivar?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
            <FacebookFilled style={iconStyle} />
          </a>
          <a href="https://www.instagram.com/jhpparivar?igsh=eGttOTUwNm5kZXpy" target="_blank" rel="noopener noreferrer">
            <InstagramFilled style={iconStyle} />
          </a>
        </div>
      </Form>
    </Card>
    </div>
  );
};

export default SignupForm;
