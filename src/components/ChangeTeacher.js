import React, { useEffect } from 'react';
import { Modal, Input, DatePicker, Form, Select, Button } from 'antd';
import moment from 'moment';
const { Option } = Select;

const ChangeTeacher = ({ visible, onCancel, onSubmit, initialData, teachersData }) => {
  const [form] = Form.useForm();

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
      onSubmit({...values, student_id: initialData?.student_id});
      onCancel(); // Optionally close the modal after submission
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
    }
  };

  return (
    <Modal
      title={`Change Teacher`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={'Update'}
      cancelText="Cancel"
      style={{ top: 20 }} // Top position for better visibility
      bodyStyle={{ overflowY: 'auto', maxHeight: '70vh' }} // Scrollable body
    >
      {/* <Form form={form} layout="vertical" style={{ width: '90%' }}>
        <Form.Item
          name="course_name"
          label="Exam Name"
          rules={[{ required: true, message: 'Please input the exam name!' }]}
        >
          <Input />
        </Form.Item>
      </Form> */}

        <Form layout="vertical" form={form}>
          <Form.Item label="Select Guruji" name="assignee" rules={[{ required: true, message: 'Please select an assignee' }]}>
            <Select placeholder="Select Guruji" style={{ width: '100%' }}>
              {teachersData && teachersData.map(user => (
                  <Option key={user.teacher_id} value={user.teacher_id}>
                      {user.teacher_first_name} {user.teacher_last_name}
                  </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default ChangeTeacher;