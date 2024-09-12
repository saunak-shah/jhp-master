import React, { useEffect, useState } from "react";
import { Input, Space, Button, Select } from "antd";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import '../css/Teacher.css'; // Import the CSS file

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
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [searchKey, setSearchKey] = useState(0);
  const [teacherId, setTeacherId] = useState(0);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const token = localStorage.getItem("token");

  const handleFilterChange = (teacherId) => {
    setTeacherId(teacherId);
    setSelectedValue(teacherId);
    setOffset(0);
    fetchData(offset, pageSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchData(offset, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, totalUserCount, teacherId]);

  const handleUserSearchChange = (value) => {
    setSearchKey(value);
  };

  const fetchData = async (offset, limit) => {
    setLoading(true);
    try {
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
    fetchData(0, pageSize);
    fetchTeachersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ margin: 35 }}>
      <Space style={{ marginBottom: 16 }}>
        <Search
          style={{ marginTop: 16}}
          placeholder="Search users"
          enterButton
          onChange={(e) => handleUserSearchChange(e.target.value)}
        />
      </Space>
      <Space style={{ float: "right", marginTop: 15 }}>
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
    </div>
  );
});
export default UserTable;
