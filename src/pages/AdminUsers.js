// src/UserTable.js
import React, { useEffect, useState } from "react";
import { Table, Input, Space, message } from "antd";
// import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

const columns = [
  { title: "ID", dataIndex: "student_id", key: "student_id", sorter: true },
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
    sorter: true,
  },
  { title: "Last Name", dataIndex: "last_name", key: "lastName", sorter: true },
  { title: "Email", dataIndex: "email", key: "email", sorter: true },
  { title: "Phone", dataIndex: "phone_number", key: "phone", sorter: true },
  { title: "Gender", dataIndex: "gender", key: "gender", sorter: true },
  { title: "Area", dataIndex: "address", key: "area", sorter: true },
];
const AdminTable = () => {
  console.log("Component mounted or updated");
  const { Search } = Input;
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    console.log("Fetching user data");
    const fetchUserData = async () => {
      console.log("Inside fetchUserData function");
      try {
        fetchData(sortField, sortOrder);
      } catch (error) {
        message.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [sortField, sortOrder]); // Dependencies array

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("sorter.field========", sorter.field);
    console.log("sorter.order========", sorter.order);
    // Update sortField and sortOrder
    setSortField(sorter.field);
    setSortOrder(sorter.order);

    // Trigger API call here based on the sorting parameters
    fetchData(sorter.field, sorter.order);
  };

  const fetchData = async (field, order) => {
    try {
      let token = localStorage.getItem("token") || "";

      const apiHost = process.env.REACT_APP_API_HOST;
      const adminUrl = `${apiHost}/api/students`;
      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      const response = await fetch(`${adminUrl}?sort=${field}&order=${order}`, {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        authStore.users = data;
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
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
};

export default AdminTable;