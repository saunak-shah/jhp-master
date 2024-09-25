import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import { LeftOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import { post } from "../global/api";
import moment from "moment";


const AttendanceView = () => {
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
    // const apiHost = process.env.REACT_APP_API_HOST;
    let apiUrl = `/api/attendance_report`;
    let dateMonth = moment().format()
    let reqObj = {
      limit: 20,
      offset: 0,
      dateMonth
    }
    const res = await post(apiUrl, reqObj);
    if (res.status === 200) {
      // fetchData();
      setApplicants(res.data);
      // message.success(`Attendance fetched successfully.`);
    } else {
      message.error(`Failed to course.`);
    }
  };

  const handleApplicantsSearchChange = async (value) => {
    await fetchData(value);
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const columns = [
    { title: "Name", dataIndex: "first_name", key: "first_name"},
    { title: "Attendance Count", dataIndex: "attendance_count", key: "attendance_count"},
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

export default AttendanceView;
