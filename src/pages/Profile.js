import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker } from 'antd';
import '../css/Profile.css'; // Import the CSS file for styling
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import moment from 'moment';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); // New state for submit button loading

  useEffect(() => {
    // Fetch user data from an API
    const fetchUserData = async () => {
      try {
        let token = localStorage.getItem('token') || '';

        const username = localStorage.getItem('username') || '';
        const apiHost = process.env.REACT_APP_API_HOST;
        const apiUrl = `${apiHost}/api/students/${username}`;
        let headers = {
          'Content-Type': 'application/json',
          Authorization: token
        };
        const response = await axios.get(apiUrl, { headers });
        const userData = response.data.data;
        // Convert the birth_date to a moment object if necessary
        if (userData.birth_date) {
          userData.birth_date = moment(userData.birth_date);
        }

        form.setFieldsValue(userData);
      } catch (error) {
        message.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [form]);

  async function postData(url = "", data = {}) {
    let token = localStorage.getItem('token') || '';
    
    const reqData = {
      data
    }
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
      body: JSON.stringify(reqData)
    });
    return response;
  }

  const handleProfileUpdate = async () => {
    setSubmitLoading(true); // Set loading to true when starting the submit
    try {
      await form.validateFields()
        .then(values => {
          console.log("Form values:", values);
          const apiHost = process.env.REACT_APP_API_HOST;
          const appUrl = `${apiHost}/api/students/update_profile`;
  
          return postData(appUrl, values);
        })
        .then(response => {
          console.log("Response received:", response);
          if (response.status === 200) {
            return response.json(); // Only parse JSON if the response is successful
          } else {
            return response.json();
          }
        })
        .then(data => {
          message.success(data.message);
          console.log("Data parsed:", data);
        })
        .catch(error => {
          console.error('Error during post or processing response:', error);
          message.error('An error occurred during profile update. Please try again later.');
        });
    } catch (error) {
      console.error('Error during profile update:', error);
      message.error('An error occurred during profile update. Please try again later.');
    } finally {
      setSubmitLoading(false); // Set loading to false when the submit is finished
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="father_name"
          label="Father Name"
          rules={[{ required: true, message: 'Please input your father name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Birth Date"
          name="birth_date"
          rules={[{ required: true, message: "Please select your birth date" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Select your birth date" />
        </Form.Item>
        <Form.Item style={{ marginTop: '10px', textAlign: 'center' }}>
          <Button 
            style={{ width: '150px', height: '40px', backgroundColor: '#f54290' }} 
            type="primary" 
            block 
            onClick={handleProfileUpdate}
            loading={submitLoading} // Add loading prop to the button
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
