import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import AddCourseForm from '../components/AddCourseForm'; // Make sure the path is correct
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { post, deleteData } from '../global/api';

const Exam = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

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
        return (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => editCourse(record)} />
            <Button icon={<DeleteOutlined />} onClick={() => deleteCourse(record)} />
          </Space>
        )
      }
    },
  ];

  const handleAddOrEditCourse = async (course, isEdit) => {
    if (isEdit && !course.course_id) {
      console.error("Error: No ID provided for the course to edit");
      message.error("No course ID provided for editing.");
      return;
    }
  
    setLoading(true);
    const endpoint = isEdit ? `/api/courses/${course.course_id}` : '/api/courses';

    course.is_active = true
    course.category = "A"
    course.course_duration_in_hours = parseInt(course.course_duration_in_hours)
    course.course_score = parseInt(course.course_score)
    course.course_passing_score = parseInt(course.course_passing_score)
    course.course_max_attempts = parseInt(course.course_max_attempts)

    const res = await post(endpoint, course);
    if (res.status == 200) {
      /* const updatedCourses = isEdit
        ? data.map(item => (item.id === course.course_id ? { ...item, ...course } : item))
        : [...data, course]; // This assumes the API returns the updated list or new course
      console.log("yyyyyyyyyyy", updatedCourses) */
      // setData(updatedCourses);
      fetchData();

      message.success(`Course ${isEdit ? 'updated' : 'added'} successfully.`);
    } else {
      message.error(`Failed to ${isEdit ? 'update' : 'add'} course.`);
    }
    setLoading(false);
    setIsModalVisible(false);
  };

  const addCourse = () => {
    setCurrentCourse(null); // No current course when adding new
    setIsModalVisible(true);
  };

  const editCourse = (course) => {
    setCurrentCourse(course); // Set current course to edit
    setIsModalVisible(true);
  };

  const deleteCourse = async (course) => {
    console.log("course", course)
    const endpoint = `/api/courses/${course.course_id}`
    const res = await deleteData(endpoint, course);
    fetchData()
  };

  const { Search } = Input;
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

        setData(rawData.data.course);
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    

    fetchData();
  }, []);

  return (
    <div id="exam-container">
          <Button 
            style={{ width: '150px', height: '40px', backgroundColor: '#f54290', marginBottom:'10px' }} 
            type="primary" 
            block 
            onClick={addCourse}
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
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddOrEditCourse}
        initialData={currentCourse}
      />
    </div>
  );
};

export default Exam;
