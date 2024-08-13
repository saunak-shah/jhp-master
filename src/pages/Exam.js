import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import axios from 'axios';

const limit = 20;

const token = localStorage.getItem('token')

const Exam = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Define columns for the table
  const columns = [
    { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
    { title: 'Marks', dataIndex: 'course_score', key: 'course_score' },
    { title: 'Passing Marks', dataIndex: 'course_passing_score', key: 'course_passing_score' },
    { title: 'Exam Duration', dataIndex: 'course_duration_in_hours', key: 'course_duration_in_hours' },
    { title: 'Exam Date', dataIndex: 'course_date', key: 'course_date' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            style={{
              width: "120px",
              height: "40px",
              /* backgroundColor: "#f54290", */
              marginRight: "10px", // Add margin to create space between buttons
            }}
            onClick={() => handleDownload(record)}
          >
            Download File
          </Button>
          <Button
            type="primary"
            style={{
              width: "120px",
              height: "40px",
              /* backgroundColor: "#f54290", */
            }}
            onClick={() => handleApply(record)}
          >
            Apply for Exam
          </Button>
        </span>
      ),
    },
  ];

  const handleDownload = (record) => {
    // Implement download logic here
    console.log('Downloading file for course:', record.course_name);
  };

  const handleApply = (record) => {
    // Implement apply for exam logic here
    console.log('Applying for exam for course:', record);
    let user_id = localStorage.getItem('user_id') || '1';
    console.log('user_id:', user_id);

    const apiHost = process.env.REACT_APP_API_HOST;
    const apiUrl = `${apiHost}/api/register/`;
  
    let reqData = {
      course_id: record.course_id,
      user_id: user_id
    }
     const coursApply =  postData(apiUrl, reqData);

    // message.success('Restration filed successfully');

     console.log(coursApply)

  };

  async function postData(url = "", data = {}) {
    let token = localStorage.getItem('token') || '';

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response;
  }

  const { Search } = Input;

  const fetchData = async () => {
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiUrl = `${apiHost}/api/students/${limit}/${offset}`;
      let headers = {
        'Content-Type': 'application/json',
        Authorization: token
      };
      const response = await axios.get(apiUrl, { headers });
      console.log("🚀 ~ file: UserTable.js:54 ~ fetchData ~ response.data:", response.data)
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div id="exam-container">
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

export default Exam;
