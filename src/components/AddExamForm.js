import React, { useEffect, useState } from "react";
import { Modal, Input, DatePicker, Form, Switch } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const AddEditExam = ({ visible, onCancel, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const isCreating = !initialData;
  const { examId } = useParams(); // Use useParams to get examId from the route

  useEffect(() => {
    if (visible) {
      const formValues = {
        ...initialData,
        registration_starting_date: initialData?.registration_starting_date
          ? dayjs(initialData.registration_starting_date, "DD_MM-YYYY")
          : null,
        registration_closing_date: initialData?.registration_closing_date
          ? dayjs(initialData.registration_closing_date, "DD_MM-YYYY")
          : null,
          start_time: initialData?.start_time
          ? dayjs(initialData.start_time)
          : null,
        end_time: initialData?.end_time
          ? dayjs(initialData.end_time)
          : null,
        is_exam_active:
        initialData?.is_exam_active !== undefined
          ? initialData.is_exam_active
          : true,
      };
      console.log("formValuesformValuesformValues", formValues)
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [initialData, form, visible]);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.course_id = parseInt(examId)
      values.total_marks = parseInt(values.total_marks);
      onSubmit({ ...values, course_id: values.course_id }, isCreating);
      onCancel(); // Optionally close the modal after submission
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  return (
    <Modal
      title={`${isCreating ? "Add" : "Edit"} Exam`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={isCreating ? "Create" : "Update"}
      cancelText="Cancel"
      style={{ top: 20 }} // Top position for better visibility
      bodyStyle={{ overflowY: "auto", maxHeight: "70vh" }} // Scrollable body
    >
      <Form form={form} layout="vertical" style={{ width: "90%" }}>
        <Form.Item name="schedule_id" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          name="exam_name"
          label="Exam Name"
          rules={[
            { required: true, message: "Please input the exam name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="registration_starting_date"
          label="Registration Start Date"
          rules={[
            {
              required: true,
              message: "Please select the exam registration date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="registration_closing_date"
          label="Registration Closing Date"
          rules={[
            { required: true, message: "Please select the exam closing date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="location"
          label="Exam Location"
          rules={[
            { required: true, message: "Please input the exam location!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="start_time"
          label="Exam Start"
          rules={[
            { required: true, message: "Please select the exam start date!" },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="end_time"
          label="Exam End"
          rules={[
            { required: true, message: "Please select the exam end date!" },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="total_marks"
          label="Total marks"
          rules={[
            { required: true, message: "Please input the total marks!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="passing_score"
          label="Passing Marks"
          rules={[
            { required: true, message: "Please input the passing marks!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="is_exam_active"
          label="Exam Active"
          valuePropName="checked" // Important for Switch!
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditExam;
