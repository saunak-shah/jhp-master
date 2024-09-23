import React, { useEffect } from 'react';
import { Modal, Input, DatePicker, Form } from 'antd';
import moment from 'moment';

const AddEditStudent = ({ visible, onCancel, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const isCreating = !initialData;

  useEffect(() => {
    if (visible) {
      const formValues = {
        ...initialData,
        course_date: initialData?.course_date ? moment(initialData.course_date) : null,
        registration_starting_date: initialData?.registration_starting_date ? moment(initialData.registration_starting_date) : null,
        registration_closing_date: initialData?.registration_closing_date ? moment(initialData.registration_closing_date) : null,
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [initialData, form, visible]);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({...values, course_id: initialData?.course_id}, isCreating);
      onCancel(); // Optionally close the modal after submission
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
    }
  };

  return (
    <Modal
      title={`${isCreating ? 'Add' : 'Edit'} Course`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={isCreating ? 'Create' : 'Update'}
      cancelText="Cancel"
      style={{ top: 20 }} // Top position for better visibility
      bodyStyle={{ overflowY: 'auto', maxHeight: '70vh' }} // Scrollable body
    >
      <Form form={form} layout="vertical" style={{ width: '90%' }}>
        <Form.Item
          name="course_name"
          label="Exam Name"
          rules={[{ required: true, message: 'Please input the exam name!' }]}
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
          label="Exam Duration (In minute)"
          rules={[{ required: true, message: 'Please input the exam duration!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_description"
          label="Exam Description"
          rules={[{ required: true, message: 'Please input the exam description!' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="course_score"
          label="Marks"
          rules={[{ required: true, message: 'Please input the exam marks!' }]}
        >
          <Input type='number'/>
        </Form.Item>
        <Form.Item
          name="course_location"
          label="Exam Location"
          rules={[{ required: true, message: 'Please input the exam location!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="course_passing_score"
          label="Passing Score"
          rules={[{ required: true, message: 'Please input the passing marks!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="course_max_attempts"
          label="Exam Maximum Attempts"
          rules={[{ required: true, message: 'Please input the exam maximum attempts!' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="registration_starting_date"
          label="Registration Start Date"
          rules={[{ required: true, message: 'Please select the exam registration date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="registration_closing_date"
          label="Registration Closing Date"
          rules={[{ required: true, message: 'Please select the exam closing date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditStudent;