import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import { LeftOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";

const ApplicantsView = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("student_apply_course_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const { examId } = useParams(); // Use useParams to get examId from the route

  const handleChange = (pagination, filters, sorter) => {
    // Update sortField and sortOrder based on sorter
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }

    fetchData();
  };

  const fetchData = async (searchKey = undefined) => {
    const limit = 20;
    const offset = 0;
    const apiHost = process.env.REACT_APP_API_HOST;
    let apiUrl = `${apiHost}/api/courses/registrations/${examId}?limit=${limit}&offset=${offset}`;
    if (searchKey && searchKey.length > 0) {
      apiUrl = apiUrl + `&searchKey=${searchKey}`;
    }

    if (sortField) {
      apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (
        data.data &&
        data.data.registrations &&
        data.data.registrations.length > 0
      ) {
        data.data.registrations.map((data) => {
          data.updated_at =
            new Date(data.updated_at).getDate() +
            "/" +
            new Date(data.updated_at).getMonth() +
            "/" +
            new Date(data.updated_at).getFullYear();
          data.email = data.student.email;
          data.name = data.student.first_name + " " + data.student.last_name;
        });
        setApplicants(data.data.registrations);
      } else {
        setApplicants([]);
      }
    }
  };

  const handleApplicantsSearchChange = async (value) => {
    await fetchData(value);
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const columns = [
    {
      title: "RegistrationId",
      dataIndex: "student_apply_course_id",
      key: "student_apply_course_id",
      sorter: true,
    },
    { title: "Name", dataIndex: "name", key: "name"},
    { title: "Email", dataIndex: "email", key: "email"},
    {
      title: "Applied On",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: true,
    },
  ];

  return (
    <div>
      <Space style={{ marginTop: 20, marginRight: 20, float: "right" }}>
        <Search
          style={{ marginTop: 0, marginLeft: 10 }}
          placeholder="Search applicants"
          enterButton
          onChange={(e) => handleApplicantsSearchChange(e.target.value)}
        />
      </Space>
      <Button
        type="default"
        style={{
          margin: "20px",
        }}
        onClick={() => navigate(-1)}
        icon={<LeftOutlined />}
      >
        Back
      </Button>
      <Table
        style={{
          margin: "20px",
        }}
        dataSource={applicants}
        columns={columns}
        onChange={handleChange}
      />
    </div>
  );
};

export default ApplicantsView;
