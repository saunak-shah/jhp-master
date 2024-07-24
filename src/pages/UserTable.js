// src/UserTable.js
import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/authStore';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', sorter: true },
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName', sorter: true },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', sorter: true },
  { title: 'Email', dataIndex: 'email', key: 'email', sorter: true },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', sorter: true },
  { title: 'Gender', dataIndex: 'gender', key: 'gender', sorter: true },
  { title: 'Area', dataIndex: 'area', key: 'area', sorter: true },
];

const UserTable = observer(() => {
  const { Search } = Input;
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("sorter.field========", sorter.field)
    console.log("sorter.order========", sorter.order)
    // Update sortField and sortOrder
    setSortField(sorter.field);
    setSortOrder(sorter.order);

    // Trigger API call here based on the sorting parameters
    fetchData(sorter.field, sorter.order);
  };

  const fetchData = async (field, order) => {
    try {
      // Replace 'http://your-api-endpoint/users' with your actual API endpoint
      const response = await fetch(`http://your-api-endpoint/users?sort=${field}&order=${order}`);
      if (response.ok) {
        const data = await response.json();
        // Update the user data in the store with the fetched data
        authStore.users = data;
      } else {
        console.error('Error fetching data:', response.statusText);
      }
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
