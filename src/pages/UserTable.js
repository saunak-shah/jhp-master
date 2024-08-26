// src/UserTable.js
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { post, deleteData } from "../global/api";
const { Search } = Input;


const UserTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

const columns = [
  { title: 'First Name', dataIndex: 'first_name', key: 'first_name', sorter: true },
  { title: 'Last Name', dataIndex: 'last_name', key: 'last_name', sorter: true },
  { title: 'Email', dataIndex: 'email', key: 'email', sorter: true },
  { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number', sorter: true },
  { title: 'Gender', dataIndex: 'gender', key: 'gender', sorter: true },
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

  const fetchData = async () => {
    try {
      const limit = 20;
      const offset = 0;
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiURL = `${apiHost}/api/students/${limit}/${offset}`;
      const response = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const rawData = await response.json();
        console.log("Fetched data:", rawData);

        setData(rawData.data.users);
      } else {
        console.error("Error fetching data:", response.statusText);
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

  return (
    <div id="exam-container">
      <Space>
          <Search placeholder="Search students" enterButton />
        </Space>
      <Table
        dataSource={data}
        columns={columns}
        bordered={true}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default UserTable;
