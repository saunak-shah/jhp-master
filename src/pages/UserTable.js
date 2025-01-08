import React, { useEffect, useState } from "react";
import { Input, Space, Button, Select, Modal, Form, message } from "antd";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { DeleteOutlined, SwapOutlined } from "@ant-design/icons";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import '../css/Teacher.css'; // Import the CSS file
import { deleteData } from "../global/api";
import ChangeTeacher from "../components/ChangeTeacher"; // Make sure the path is correct
import { post } from "../global/api";

const { Option } = Select;

const UserTable = observer(() => {
  const { Search } = Input;
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [teacherId, setTeacherId] = useState(0);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const master_role_id = localStorage.getItem("master_role_id");
  const [currentStudent, setCurrentStudent] = useState(null);

  const [form] = Form.useForm();
  
  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  const token = localStorage.getItem("token");

  const handleFilterChange = (teacherId) => {
    setTeacherId(teacherId);
    setSelectedValue(teacherId);
    setOffset(0);
    // fetchData(offset, pageSize, null, teacherId);
    setCurrentPage(1);
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };

  const deleteStudent = async () => {
    const endpoint = `/api/students/${dataToDelete.student_id}`;
    await deleteData(endpoint, dataToDelete);
    setDeleteModalVisibility(false);
    setDataToDelete({});
    fetchData(offset, pageSize);
  };


  const handleChangeTeacher = async (record) => {
    setCurrentStudent(record); // Set current course to edit
    setLoading(true);
    const endpoint = `/api/teachers/assign`;

    // course.course_max_attempts = parseInt(course.course_max_attempts);

    const res = await post(endpoint, record);
    if (res.status === 200) {
      fetchData(0, pageSize);
      message.success(`Teacher changed successfully.`);
      setIsModalVisible(false);
    } else {
      message.error(`${res.message}`);
    }
    setLoading(false);
  };

  const handleChangeAssignee = (record) => {
    setCurrentStudent(record); // Set current course to edit
    // setCurrentCourse(course); // Set current course to edit
    setIsModalVisible(true);
  };
  

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: true,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      sorter: true,
    },
    {
      title: "Fathe Name",
      dataIndex: "father_name",
      key: "father_name",
      sorter: true,
    },
    { title: "Email", dataIndex: "email", key: "email", sorter: true },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
      sorter: true,
    },
    { title: "Gender", dataIndex: "gender", key: "gender", sorter: true },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Space>
            <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              >
                Delete
              </Button>
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={() => handleChangeAssignee(record)}
              >
                Change Teacher
              </Button>
          </Space>
          
        );
      },
    },
  ];

  const handleUserSearchChange = (value) => {
    value = value.length > 0 ? value : null;
    fetchData(offset, pageSize, sortField, sortOrder, value);
  };

  const fetchData = async (
    offset,
    limit,
    sortField = "first_name",
    sortOrder = "asc",
    searchKey = null
  ) => {
    setLoading(true);
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl;
      if (teacherId) {
        apiUrl = `${apiHost}/api/teachers/assignees/${teacherId}?limit=${limit}&offset=${offset}`;
      } else {
        apiUrl = `${apiHost}/api/students?limit=${limit}&offset=${offset}`;
      }
      // Append filters if searchKey is present
      if (searchKey) {
        apiUrl += `&searchKey=${encodeURIComponent(searchKey)}`;
      }
      // Append sorting parameters
      if (sortField) {
        apiUrl += `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(apiUrl, { headers });
      if (response.data && response.data.data) {
        setTotalUserCount(response.data.data.totalCount);
        setUsers(response.data.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachersData = async () => {
    try {
      const limit = 100;
      const offset = 0;
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl = `${apiHost}/api/teachers?limit=${limit}&offset=${offset}`;

      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(apiUrl, { headers });

      if (
        response.data &&
        response.data.data &&
        response.data.data.teachers.length > 0
      ) {
        setTeachers(response.data.data.teachers);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, pageSize);
    fetchTeachersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  return (
    <div className="main-container">
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteStudent}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <Space style={{ marginBottom: 16 }}>
        <Search
          className="search-class"
          placeholder="Search users"
          enterButton
          onChange={(e) => handleUserSearchChange(e.target.value)}
        />
      </Space>
      {master_role_id != 2 ? (
        <Space style={{ float: "right", marginTop: '10px'}}>
        Filter by teacher:
        <Select
          onChange={handleFilterChange}
          showSearch={true}
          placeholder="Select Teacher"
          optionFilterProp="children"
          value={selectedValue}
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: 200 }}
        >
          <Option key={"None"} value={undefined}>
            None
          </Option>

          {teachers.map((teacher, index) => (
            <Option key={index} value={teacher.teacher_id}>
              {teacher.teacher_first_name + ' ' +teacher.teacher_last_name}
            </Option>
          ))}
        </Select>
      </Space>
      ) : ''}
      
      <div className="table-container">
      <TableView
        data={users}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalCount={totalUserCount}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setOffset={setOffset}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
      </div>
      <ChangeTeacher
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleChangeTeacher}
        initialData={currentStudent}
        teachersData={teachers}
      />
    </div>
  );
});
export default UserTable;
