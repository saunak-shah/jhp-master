// src/UserTable.js
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/authStore';
import axios from 'axios';

const columns = [
  { title: 'ID', dataIndex: 'student_id', key: 'student_id', sorter: true },
  { title: 'First Name', dataIndex: 'first_name', key: 'first_name', sorter: true },
  { title: 'Last Name', dataIndex: 'last_name', key: 'last_name', sorter: true },
  { title: 'Email', dataIndex: 'email', key: 'email', sorter: true },
  { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number', sorter: true },
  { title: 'Gender', dataIndex: 'gender', key: 'gender', sorter: true },
  { title: 'Area', dataIndex: 'address', key: 'address', sorter: true },
];

const UserTable = observer(() => {
  const { Search } = Input;
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const token = localStorage.getItem('token');

  const limit = 20
  const offset = 0
  
  const handleTableChange = () => {
    fetchData();
  };

  useEffect (() => {
    handleTableChange();
  }, [])
  
  const fetchData = async () => {
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiUrl = `${apiHost}/api/students/${limit}/${offset}`;
      let headers = {
        'Content-Type': 'application/json',
        Authorization: token
      };
      const response = await axios.get(apiUrl, { headers });
      authStore.users = response.data.data;
      console.log("🚀 ~ file: UserTable.js:54 ~ fetchData ~ response.data:", response.data)
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search placeholder="Search users" enterButton />
      </Space>
      <Table
        dataSource={authStore.users}
        columns={columns}
        bordered={true}
        onChange={handleTableChange}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  );
});

export default UserTable;
