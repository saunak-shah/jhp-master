import React, { useEffect, useState } from 'react';
import { Table, Input, Space } from 'antd';
import { observer } from 'mobx-react-lite';
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
  const [sortField, setSortField] = useState('student_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const limit = 20
  const offset = 0
  
  const handleChange = (pagination, filters, sorter) => {
    // Update sortField and sortOrder based on sorter
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }

    fetchData();
  };

  const handleTableChange = () => {
    fetchData();
  };

  useEffect (() => {
    handleTableChange();
  }, [])

  const handleUserSearchChange = async (value) => {
    await fetchData(value);
  }
  
  const fetchData = async (searchKey = undefined) => {
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl = `${apiHost}/api/students?limit=${limit}&offset=${offset}`;
      if(searchKey && searchKey.length > 0){
        apiUrl = apiUrl + `&searchKey=${searchKey}`
      }

      if(sortField){
        apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`
      }
      
      let headers = {
        'Content-Type': 'application/json',
        Authorization: token
      };
      const response = await axios.get(apiUrl, { headers });
      if(response.data && response.data.data && response.data.data.users.length > 0){
        setUsers(response.data.data.users);
      } else {
        setUsers([]);

      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search style={{ marginTop: 16, marginLeft: 16 }} placeholder="Search users" enterButton onChange={(e) => handleUserSearchChange(e.target.value)} />
      </Space>
      <Table
        dataSource={users}
        rowKey="student_id"
        columns={columns}
        bordered={true}
        onChange={handleChange}
        pagination={true}
      />
    </div>
  );
});

export default UserTable;
