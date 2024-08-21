import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate instead of useHistory

const ApplicantsView = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const { examId } = useParams(); // Use useParams to get examId from the route


  useEffect(() => {
    const fetchData = async () => {
      const limit = 20;
      const offset = 0;
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiURL = `${apiHost}/api/courses/registrations/${examId}/${limit}/${offset}`;
      const response = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplicants(data.data.registrations);
      }
    };
    fetchData();
  }, [examId]);

  const columns = [
    { title: "Name", dataIndex: "student_id", key: "student_id" },
    { title: "Email", dataIndex: "course_id", key: "course_id" },
    // Add more columns as needed
  ];

  return (
    <div>
      <Button style={{
          margin: "20px",
        }} onClick={() => navigate(-1)}>Back to Exam List</Button>
      <Table style={{
          margin: "20px",
        }} dataSource={applicants} columns={columns} />
    </div>
  );
};

export default ApplicantsView;
