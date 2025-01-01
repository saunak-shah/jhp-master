import React, { useEffect } from 'react';
import { Modal, Input, Form, Select } from 'antd';

const {Option} = Select
const AddGroup = ({ visible, onCancel, onSubmit, initialData, teachers }) => {
  const [form] = Form.useForm();
  const isCreating = !initialData;

  useEffect(() => {
    if (visible) {
      const formValues = {
        ...initialData,
        teacher_assignee: initialData?.teacher_ids || [], // Ensure default array for multiple selection
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [initialData, form, visible]);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({...values, group_id: initialData?.group_id}, isCreating);
      onCancel(); // Optionally close the modal after submission
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
    }
  };

  return (
    <Modal
      title={`${isCreating ? 'Add' : 'Edit'} Group`}
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
          name="group_name"
          label="Group Name"
          rules={[{ required: true, message: 'Please input the group name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
        name="teacher_assignee"
        label="Teachers"
        rules={[{ required: true, message: 'Please select the teacher!' }]}
        >
            <Select mode="multiple" placeholder="Select Teacher"style={{ width: '100%' }}>
              {teachers && teachers.map(teacher => (
                  <Option key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.teacher_first_name} {teacher.teacher_last_name}
                  </Option>
              ))}
            </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddGroup;