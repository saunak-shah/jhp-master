// src/UserTable.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Space,
  Button,
  Modal,
  Form,
  Row,
  Col,
  DatePicker,
  Radio,
  Typography,
  Select,
  message,
  Popconfirm,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
const { Option } = Select;
const { Text } = Typography;

const Teacher = observer(() => {
  const { Search } = Input;
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [disableField, setDisableField] = useState(false);
  //   const [sortField, setSortField] = useState("");
  //   const [sortOrder, setSortOrder] = useState("");
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(true);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const token = localStorage.getItem("token");

  const columns = [
    { title: "ID", dataIndex: "teacher_id", key: "teacher_id", sorter: true },
    {
      title: "First Name",
      dataIndex: "teacher_first_name",
      key: "teacher_first_name",
      sorter: true,
    },
    {
      title: "Last Name",
      dataIndex: "teacher_last_name",
      key: "teacher_last_name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "teacher_email",
      key: "teacher_email",
      sorter: true,
    },
    {
      title: "Phone",
      dataIndex: "teacher_phone_number",
      key: "teacher_phone_number",
      sorter: true,
    },
    {
      title: "Gender",
      dataIndex: "teacher_gender",
      key: "teacher_gender",
      sorter: true,
    },
    {
      title: "Area",
      dataIndex: "teacher_address",
      key: "teacher_address",
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            primary={true}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.teacher_username)}
            style={{ marginRight: 20, marginTop: 5 }}
          >
            {" "}
            Edit{" "}
          </Button>

          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            style={{ marginTop: 5 }}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const limit = 20;
  const offset = 0;

  const handleTableChange = () => {
    fetchData();
  };

  const openModal = () => {
    setModalOpen(true);
    setIsCreating(true);
    setDisableField(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };

  const deleteTeacherData = async () => {
    const apiHost = process.env.REACT_APP_API_HOST;
    const deleteTeacherURL = `${apiHost}/api/teachers/${dataToDelete.teacher_id}`;
    reqData(deleteTeacherURL, {}, "DELETE")
      .then((response) => {
        if (response.status === 200) {
          message.success("Teacher deleted");
          setDeleteModalVisibility(false);
          setDataToDelete({});
          fetchData();
          return response.json();
        } else {
          throw new Error("Failed to delete teacher.");
        }
      })
      .catch((error) => {
        setError(error);
        setModalOpen(true);
        console.error("Error during post or processing response:", error);
      });
  };

  const handleEdit = async (record) => {
    const data = await fetchTeacherData(record);
    if (data.teacher_birth_date) {
      data.teacher_birth_date = moment(data.teacher_birth_date);
      data.is_support_user = Boolean(data.is_support_user) ? "Yes" : "No";
    }
    setModalOpen(true);
    setIsCreating(false);
    setDisableField(true);
    form.setFieldsValue(data);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isCreating) {
      await createTeacher(values);
    } else {
      await updateTeacher(values);
    }
  };

  const createTeacher = async (values) => {
    values.organization_id = 1;
    console.log("Form values:", values);
    const apiHost = process.env.REACT_APP_API_HOST;
    const signupUrl = `${apiHost}/api/teachers/signup`;
    setModalOpen(false);
    values = {
      ...values,
      is_support_user: Boolean(values.is_support_user),
    };
    reqData(signupUrl, values)
      .then((response) => {
        if (response.status === 200) {
          message.success("Teacher created");
          fetchData();
          return response.json();
        } else {
          throw new Error("Failed to create teacher.");
        }
      })
      .catch((error) => {
        setError(error);
        setModalOpen(true);
        console.error("Error during post or processing response:", error);
      });
  };

  const updateTeacher = async () => {
    await form
      .validateFields()
      .then((values) => {
        values.organization_id = 1;
        console.log("Form values:", values);
        const apiHost = process.env.REACT_APP_API_HOST;
        const updateProfileUrl = `${apiHost}/api/teachers/update_profile`;
        setModalOpen(false);
        values = {
          data: {
            ...values,
            is_support_user: Boolean(values.is_support_user),
          },
        };
        reqData(updateProfileUrl, values).then((response) => {
          console.log("Response received:", response);
          if (response.status === 200) {
            message.success("Teacher updated");
            fetchData();
            return response.json();
          } else {
            throw new Error("Failed to update teacher.");
          }
        });
      })

      .catch((error) => {
        setError(error);
        setModalOpen(true);
        console.error("Error during post or processing response:", error);
      });
  };

  async function reqData(url = "", data = {}, method = "POST") {
    const response = await fetch(url, {
      method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response;
  }

  // eslint-disable-next-line
  useEffect(() => {
    handleTableChange();
  }, []);

  const fetchData = async () => {
    try {
      const apiHost = process.env.REACT_APP_API_HOST;

      const apiUrl = `${apiHost}/api/teachers/${limit}/${offset}`;

      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      const response = await axios.get(apiUrl, { headers });
      teachers.map((teacher) => {
        return {
          ...teacher,
          is_support_user: Boolean(teacher.is_support_user) ? "Yes" : "No",
        };
      });
      setTeachers(response.data.data.teachers);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const fetchTeacherData = async (username) => {
    try {
      const apiHost = process.env.REACT_APP_API_HOST;

      const apiUrl = `${apiHost}/api/teachers/username/${username}`;

      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      const response = await axios.get(apiUrl, { headers });
      return response.data.data;
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div>
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteTeacherData}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>

      <Modal
        title="Fill the Form"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 8]}>
            {" "}
            {/* Adjusted gutter to reduce vertical space */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="teacher_first_name"
                rules={[
                  {
                    required: true,
                    message: "Please enter teacher's first name",
                  },
                  {
                    max: 50,
                    message: "First name must be at most 50 characters",
                  },
                ]}
              >
                <Input placeholder="Enter teacher's first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="teacher_last_name"
                rules={[
                  {
                    required: true,
                    message: "Please enter teacher's last name",
                  },
                  {
                    max: 50,
                    message: "Last name must be at most 50 characters",
                  },
                ]}
              >
                <Input placeholder="Enter teacher's last name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone Number"
                name="teacher_phone_number"
                rules={[
                  {
                    required: true,
                    message: "Please enter teacher's phone number",
                  },
                ]}
              >
                <Input placeholder="Enter teacher's phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Username"
                name="teacher_username"
                rules={[
                  {
                    required: true,
                    message: "Please enter teacher's username",
                  },
                ]}
              >
                <Input
                  placeholder="Enter teacher's username"
                  disabled={disableField}
                />
              </Form.Item>
            </Col>
            {!disableField && (
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Password"
                  name="teacher_password"
                  rules={[
                    {
                      required: true,
                      message:
                        "Password length should be between 4 to 12 characters.",
                    },
                  ]}
                >
                  <Input.Password
                    //   disabled={disableField}

                    placeholder="Enter teacher's password"
                    type="password"
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="teacher_email"
                rules={[
                  { required: true, message: "Please enter teacher's email" },
                ]}
              >
                <Input placeholder="Enter teacher's email" type="email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Address"
                name="teacher_address"
                rules={[
                  { required: true, message: "Please enter teacher's address" },
                ]}
              >
                <TextArea placeholder="Enter teacher's address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Birth Date"
                name="teacher_birth_date"
                rules={[
                  {
                    required: true,
                    message: "Please select teacher's birth date",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  placeholder="Select teacher's birth date"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} style={{ paddingLeft: "10px" }}>
              {" "}
              {/* Adjusted paddingLeft to move gender options to the left */}
              <Form.Item
                name="teacher_gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                    message: "Please select teacher's gender!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} style={{ paddingLeft: "10px" }}>
              <Form.Item
                name="is_support_user"
                label="Is Support User ?"
                rules={[{ required: true, message: "Is this support user?" }]}
              >
                <Select placeholder="Is this support user?">
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} style={{ paddingLeft: "10px" }}>
              <Form.Item
                name="master_role_id"
                label="Allow Permission"
                rules={[{ required: true, message: "Allow permissions" }]}
              >
                <Select placeholder="Allow permissions">
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {error && <Text type="danger">{error}</Text>}
          <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              className="login-button"
              type="primary"
              onClick={handleSubmit}
            >
              {isCreating ? "Create" : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          marginLeft: 16,
          marginTop: 20,
          marginInlineEnd: 40,
        }}
      >
        <Space>
          <Search placeholder="Search teachers" enterButton />
        </Space>
        <Button type="primary" onClick={openModal} icon={<PlusOutlined />}>
          Add New Teacher
        </Button>
      </div>
      <Table
        dataSource={teachers}
        columns={columns}
        bordered={true}
        onChange={handleTableChange}
        // sortField={sortField}
        // sortOrder={sortOrder}
      />
    </div>
  );
});

export default Teacher;