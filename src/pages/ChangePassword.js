// Profile.js
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import '../css/Profile.css'; // Import the CSS file for styling

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // New state for submit button loading

  useEffect(() => {
    // Fetch user data from local storage or an API
    const userData = {
      first_name: localStorage.getItem('first_name') || '',
      last_name: localStorage.getItem('last_name') || '',
      email: localStorage.getItem('email') || '',
      phone_number: localStorage.getItem('phone_number') || '',
    };
    form.setFieldsValue(userData);
  }, [form]);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate saving data
    setTimeout(() => {
      localStorage.setItem('first_name', values.first_name);
      localStorage.setItem('last_name', values.last_name);
      localStorage.setItem('email', values.email);
      localStorage.setItem('phone_number', values.phone_number);
      setLoading(false);
      message.success('Profile updated successfully');
    }, 1000);
  };

  async function postData(url = "", data = {}) {
    let token = localStorage.getItem('token') || '';
    

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response;
  }

  const handlePasswordChange = async () => {
    setSubmitLoading(true); // Set loading to true when starting the submit
    try {
      await form.validateFields()
        .then(values => {
          const apiHost = process.env.REACT_APP_API_HOST;
          const appUrl = `${apiHost}/api/teachers/change_password`;
  
          return postData(appUrl, values);
        })
        .then(response => {
          if (response.status === 200) {
            
            return response.json(); // Only parse JSON if the response is successful
          } else {
            return response.json();
          }
        })
        .then(data => {
          if(data.message.includes("successfully")){
            message.success(data.message);
          } else {
            message.error(data.message);
          }
          // Update authentication state
          // authStore.login();
          // history.push('/home'); // Redirect to Home page
        })
        .catch(error => {
          console.error('Error during post or processing response:', error);
        });
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred during login. Please try again later.');
    } finally {
      setSubmitLoading(false); // Set loading to false when the submit is finished
    }
  };


  return (
    <div className="profile-container">
      <h2>Change Password</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="oldPassword"
          label="Old password"
          rules={[{ required: true, message: 'Please input your old password!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item style={{ marginTop: '10px', textAlign: 'center' }}>
          <Button style={{ width: '150px', height: '40px', backgroundColor: '#f54290' }} type="primary" block onClick={handlePasswordChange} loading={submitLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
