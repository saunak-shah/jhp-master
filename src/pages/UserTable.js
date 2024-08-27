import React, { useEffect, useState } from "react";
import { Table, Input, Space, Button, Select } from "antd";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

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
            // onClick={() => deleteCourse(record)}
          >
            Delete
          </Button>
        </Space>
      );
    },
  },
];

const UserTable = observer(() => {
  const { Search } = Input;
  const [sortField, setSortField] = useState("student_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const limit = 20;
  const offset = 0;

  const handleChange = (pagination, filters, sorter) => {
    // Update sortField and sortOrder based on sorter
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }

    fetchData();
  };

  const handleFilterChange = (teacherId = undefined) => {
    fetchData(undefined, teacherId);
  };

  const handleTableChange = () => {
    fetchData();
  };

  useEffect(() => {
    handleTableChange();
  }, []);

  const handleUserSearchChange = async (value) => {
    await fetchData(value);
  };

  const fetchData = async (searchKey = undefined, teacherId = undefined) => {
    try {
      const limit = 20;
      const offset = 0;
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl;
      if (teacherId) {
        apiUrl = `${apiHost}/api/teachers/assignees/${teacherId}?limit=${limit}&offset=${offset}`;
      } else {
        apiUrl = `${apiHost}/api/students?limit=${limit}&offset=${offset}`;
      }
      if (searchKey && searchKey.length > 0) {
        apiUrl = apiUrl + `&searchKey=${searchKey}`;
      }

      if (sortField) {
        apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(apiUrl, { headers });
      if (
        response.data &&
        response.data.data
      ) {
        setUsers(response.data.data.users || response.data.data);
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
      const limit = 20;
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
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    fetchTeachersData();
  }, []);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          style={{ marginTop: 16, marginLeft: 16 }}
          placeholder="Search users"
          enterButton
          onChange={(e) => handleUserSearchChange(e.target.value)}
        />
      </Space>
      <Space style={{ float: "right", marginTop: 15, marginRight: 15 }}>
        Filter by teacher:
        <Select onChange={handleFilterChange} defaultValue={"Select Teacher"} style={{width: 200}}>
          <Option key={"None"} value={undefined}>
            None
          </Option>

          {teachers.map((teacher, index) => (
            <Option key={index} value={teacher.teacher_id}>
              {teacher.teacher_first_name + teacher.teacher_last_name}
            </Option>
          ))}
        </Select>
      </Space>
      <Table
        dataSource={users}
        columns={columns}
        bordered={true}
        onChange={handleChange}
        pagination={true}
      />
    </div>
  );
}
);
export default UserTable;
