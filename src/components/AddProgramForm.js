import React, { useEffect, useState } from "react";
import { Modal, Input, Form, Upload, message, DatePicker, Switch } from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const AddEditProgram = ({ visible, onCancel, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileUploadURL, setfileURL] = useState(null);

  const isCreating = !initialData;

  useEffect(() => {
    if (visible) {
      const formValues = {
        ...initialData,
        registration_starting_date: initialData?.registration_starting_date
          ? dayjs(initialData.registration_starting_date, "DD-MM-YYYY")
          : null,
        registration_closing_date: initialData?.registration_closing_date
          ? dayjs(initialData.registration_closing_date, "DD-MM-YYYY")
          : null,
        program_starting_date: initialData?.program_starting_date
          ? dayjs(initialData.program_starting_date, "DD-MM-YYYY")
          : null,
        program_ending_date: initialData?.program_ending_date
          ? dayjs(initialData.program_ending_date, "DD-MM-YYYY")
          : null,
        is_program_active:
          initialData?.is_program_active !== undefined
            ? initialData.is_program_active
            : true,
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [initialData, form, visible]);

  const handleFileUpload = async (file) => {
    if (!allowedTypes.includes(file.type)) {
      message.error("Only PDF or Word files are allowed!");
      return Upload.LIST_IGNORE;
    }

    if (file.size > 10 * 1024 * 1024) {
      message.error("File must be smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }

    try {
      setUploading(true);
      // 1. Get pre-signed URL from backend
      const apiHost = process.env.REACT_APP_API_HOST;

      const res = await fetch(
        `${apiHost}/api/generate-presigned-url?fileName=${file.name}&fileType=${file.type}`
      );
      const { uploadURL, key } = await res.json();

      // 2. Upload file to S3
      await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      // 3. Set S3 file URL in form
      const fileUrl = `https://attachment.jhpparivar.in/${key}`;
      console.log("fileUrl===================", fileUrl);
      form.setFieldsValue({ file_url: fileUrl });
      setfileURL(fileUrl);

      message.success("File uploaded successfully");
      return false; // Prevent default Upload from adding it to file list
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Upload failed");
      return Upload.LIST_IGNORE;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(
        {
          ...values,
          file_url: fileUploadURL,
          program_id: initialData?.program_id,
        },
        isCreating
      );
      onCancel(); // Optionally close the modal after submission
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  return (
    <Modal
      title={`${isCreating ? "Add" : "Edit"} Prorgram`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={isCreating ? "Create" : "Update"}
      cancelText="Cancel"
      okButtonProps={{ disabled: uploading }}
      style={{ top: 20 }} // Top position for better visibility
      bodyStyle={{ overflowY: "auto", maxHeight: "70vh" }} // Scrollable body
    >
      <Form form={form} layout="vertical" style={{ width: "90%" }}>
        <Form.Item
          name="program_name"
          label="Program Name"
          rules={[
            { required: true, message: "Please input the program name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="file_url"
          label="Upload File (PDF/DOCX)"
          rules={[{ required: true, message: "Please upload a file!" }]}
        >
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx"
          >
            <button disabled={uploading}>
              <UploadOutlined />{" "}
              {uploading ? "Uploading..." : "Click to Upload"}
            </button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="program_description"
          label="Program Description"
          rules={[
            {
              required: true,
              message: "Please input the program description!",
            },
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="registration_starting_date"
          label="Registration Start Date"
          rules={[
            {
              required: true,
              message: "Please select the program registration date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="registration_closing_date"
          label="Registration Closing Date"
          rules={[
            {
              required: true,
              message: "Please select the program closing date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="program_location"
          label="Program Location"
          rules={[
            { required: true, message: "Please input the program location!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="program_starting_date"
          label="Program Start Date"
          rules={[
            {
              required: true,
              message: "Please select the program start date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="program_ending_date"
          label="Program End Date"
          rules={[
            { required: true, message: "Please select the program end date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="is_program_active"
          label="Program Active"
          valuePropName="checked" // Important for Switch!
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditProgram;
