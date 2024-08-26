// src/AddUserForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Select, Modal } from 'antd';
import authStore from '../stores/authStore';

const { Option } = Select;

const AddUserForm = () => {
  const [form] = Form.useForm();
  const [gender, setGender] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddUser = () => {
    form
      .validateFields()
      .then((values) => {
        const newUser = { id: authStore.users.length + 1, ...values, gender };
        authStore.addUser(newUser);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error('Error validating form:', error);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" style={{width:'150px', height: '40px', marginLeft: '5px', display: 'block', backgroundColor: "#f54290"}} onClick={showModal}>
        Add User
      </Button>
      <Modal title="Add User" visible={isModalVisible} onOk={handleAddUser} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter first name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter last name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select gender' }]}>
            <Select onChange={(value) => setGender(value)} style={{ width: '100%' }}>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Area" name="area" rules={[{ required: true, message: 'Please enter area' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddUserForm;
