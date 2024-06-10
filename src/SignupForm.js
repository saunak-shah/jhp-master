// src/SignupForm.js
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Select,
  DatePicker,
} from "antd";
import authStore from "./stores/authStore";
import logo from "./assets/jhp-logo.jpg"; // Import your logo image

const { Title, Text } = Typography;
const SignupForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  const handleSignup = () => {
    form
      .validateFields()
      .then((values) => {
        // authStore.signup(values);
        // form.resetFields();
      })
      .catch((error) => {
        console.error('Error validating form:', error);
      });
  };

  return (
    <Card
      style={{
        width: 500,
        margin: "auto",
        marginTop: 50,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          height: "80px",
          width: "80px",
          margin: "auto",
          marginBottom: 10,
          display: "block",
        }}
      />
      <Title level={4}>Signup</Title>
      <Form form={form} layout="horizontal">
        <Col span={16}>
          <Form.Item
            label="First Name"
            name="fname"
            rules={[
              { required: true, message: "Please enter your firstname" },
              {
                max: 10,
                message: "First name must be at most 50 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label="Last Name"
            name="lname"
            rules={[
              { required: true, message: "Please enter your last name" },
              { max: 10, message: "Last name must be at most 50 characters" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label="Middle Name"
            name="middlename"
            rules={[
              { required: true, message: "Please enter your middle name" },
              {
                max: 10,
                message: "First name must be at most 50 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* <Col span={16}>
          <Form.Item
            label="Mother Name"
            name="mothername"
            rules={[
              { required: true, message: "Please enter your mother name" },
              { max: 10, message: "Last name must be at most 50 characters" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col> */}
        <Col span={16}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>

        <Col span={16}>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your Phone number" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label="WhatsApp number"
            name="whatsappnum"
            rules={[
              {
                required: true,
                message: "Please enter your WhatsApp Number",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        {/* <Col span={16}>
          <Form.Item
            label="Birth Date"
            name="birthdate"
            rules={[
              { required: true, message: "Please select your birth date" },
            ]}
          >
            <DatePicker
              style={{ float: "left", width: "100%" }}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col> */}
        <Col span={16}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="Select your gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        {error && <Text type="danger">{error}</Text>}
        <Form.Item style={{ marginTop: "50px", textAlign: "center" }}>
          <Button
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "#f54290",
            }}
            type="primary"
            block
            onClick={handleSignup}
          >
            Sign Up
          </Button>
          <p class="signup-text">Already have an account?? <a href="#">Login here</a>.</p>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignupForm;
