import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

const AddCourseForm = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    await form.validateFields()
      .then(values => {
        form.resetFields();
        onSubmit(values); // Pass the values back to the parent component
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Add New Course"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Submit"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="course_name"
          label="Course Name"
          rules={[{ required: true, message: 'Please input the course name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="file_url"
          label="File URL"
          rules={[{ required: true, message: 'Please input the course name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_date"
          label="Exam Date"
          rules={[{ required: true, message: 'Please select the exam date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="course_duration_in_hours"
          label="Exam Duration"
          rules={[{ required: true, message: 'Please input the exam duration!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_description"
          label="Course Description"
          rules={[{ required: true, message: 'Please input the course name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_score"
          label="Course Score"
          rules={[{ required: true, message: 'Please input the course name!' }]}
        >
          <Input type='number'/>
        </Form.Item>
        <Form.Item
          name="course_location"
          label="Exam Location"
          rules={[{ required: true, message: 'Please input the course name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_passing_score"
          label="Passing Score"
          rules={[{ required: true, message: 'Please input the passing score!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="course_max_attempts"
          label="Exam Maximum Attempts"
          rules={[{ required: true, message: 'Please input the passing score!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="registration_starting_date"
          label="Registration Start Date"
          rules={[{ required: true, message: 'Please select the exam date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="registration_closing_date"
          label="Registration Closing Date"
          rules={[{ required: true, message: 'Please select the exam date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseForm;