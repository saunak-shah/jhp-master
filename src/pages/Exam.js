import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import AddCourseForm from '../components/AddCourseForm'; // Make sure the path is correct
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { post } from '../global/api';
// import routes from '../config/apiRoute';

const Exam = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Define columns for the table
  const columns = [
    { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
    { title: 'Marks', dataIndex: 'course_score', key: 'course_score' },
    { title: 'Passing Marks', dataIndex: 'course_passing_score', key: 'course_passing_score' },
    { title: 'Exam Duration', dataIndex: 'course_duration_in_hours', key: 'course_duration_in_hours' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        const currentDate = new Date();
        const startDate = new Date(record.registration_starting_date);
        const endDate = new Date(record.registration_closing_date);
        const isRegistrationOpen = currentDate >= startDate && currentDate <= endDate;

        return (
          <span>
            <EditOutlined style={{ marginRight: 10, fontSize: '16px' }} onClick={() => handleEditCourse(record)} />
            <DeleteOutlined style={{ fontSize: '16px' }} onClick={() => handleEditCourse(record)} />
          </span>
        )
      }
    },
  ];

  const AddExamCourseForm = () => {
    setIsModalVisible(true);
  };

  const handleEditCourse = async (course) => {

    const apiHost = process.env.REACT_APP_API_HOST;
    const appUrl = `${apiHost}/api/courses/${course.course_id}`;
    let token = localStorage.getItem('token') || '';
  
    let headers = {
      'Content-Type': 'application/json',
      Authorization: token
    };
    const response = await axios.get(appUrl, { headers });
    // setData(newData);
    // setIsModalVisible(false);
  };

  const handleAddCourse = async (course) => {
    course.is_active = true
    course.category = "A"
    course.course_duration_in_hours = parseInt(course.course_duration_in_hours)
    course.course_score = parseInt(course.course_score)
    course.course_passing_score = parseInt(course.course_passing_score)
    course.course_max_attempts = parseInt(course.course_max_attempts)

    // const appUrl = `${apiHost}/api/courses`;
  
    const res = await post('/api/courses', course);
    // const insertCourse = postData(appUrl, course);
    if(res.status === 200){
      setData(res);
      setIsModalVisible(false);
    } else{
      message.error(res.message); // Shows the backend specified message
    }
  };


  const handleCancel = () => {
    setIsModalVisible(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = 20;
        const offset = 0;
        const apiHost = process.env.REACT_APP_API_HOST;
        const apiURL = `${apiHost}/api/courses/${limit}/${offset}`;
        const response = await fetch(apiURL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token') || ''
          }
        });
        if (response.ok) {
          const rawData = await response.json();
          console.log("Fetched data:", rawData.data.course);

          // Check if rawData is an array
          if (Array.isArray(rawData?.data?.course)) {
            setData(rawData.data.course);
          } else {
            console.error("Expected an array but got:", rawData);
          }
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error during API call:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="exam-container">
          <Button 
            style={{ width: '150px', height: '40px', backgroundColor: '#f54290', marginBottom:'10px' }} 
            type="primary" 
            block 
            onClick={AddExamCourseForm}
          >
            Add Course
          </Button>
      <Table
        dataSource={data}
        columns={columns}
        bordered={true}
        pagination={false}
        loading={loading}
      />
      <AddCourseForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleAddCourse}
      />

    </div>
  );
};

export default Exam;
