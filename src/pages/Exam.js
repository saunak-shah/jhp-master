import React, { useState, useEffect } from "react";
import { Input, Button, Space, message, Form, Modal } from "antd";
import AddCourseForm from "../components/AddCourseForm"; // Make sure the path is correct
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { post, deleteData } from "../global/api";
import { useNavigate } from "react-router-dom";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import { debounce } from 'lodash';
import '../css/Teacher.css'; // Import the CSS file


const Exam = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [form] = Form.useForm();
  const [sortField, setSortField] = useState("course_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCourseCount, setTotalCoursesCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  
  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  // Inside your Exam component
  const navigate = useNavigate();

  // Define columns for the table
  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      sorter: true,
    },
    {
      title: "Marks",
      dataIndex: "course_score",
      key: "course_score",
      sorter: true,
    },
    {
      title: "Passing Marks",
      dataIndex: "course_passing_score",
      key: "course_passing_score",
      sorter: true,
    },
    {
      title: "Exam Duration (In minute)",
      dataIndex: "course_duration_in_hours",
      key: "course_duration_in_hours",
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => editCourse(record)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
            <Button
              type="primary"
              icon={<DatabaseOutlined />}
              onClick={() => navigate(`/applicants/${record.course_id}`)}
            >
              View Applicants
            </Button>

            <Button
              type="primary"
              icon={<DatabaseOutlined />}
              onClick={() => navigate(`/results/${record.course_id}`)}
            >
              View Results
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleCourseSearchChange = async (value) => {
    value = value.length > 0 ? value : null;
    fetchData(0, pageSize, sortField, sortOrder, value);
  };

  // Debounce search key handler
  const debouncedSearchHandler = debounce(handleCourseSearchChange, 500);


  const handleAddOrEditCourse = async (course) => {
    if (isEdit && !course.course_id) {
      console.error("Error: No ID provided for the course to edit");
      message.error("No course ID provided for editing.");
      return;
    }

    setLoading(true);
    const endpoint = isEdit
      ? `/api/courses/${course.course_id}`
      : "/api/courses";

    course.is_active = true;
    course.category = "A";
    course.course_duration_in_hours = parseInt(course.course_duration_in_hours);
    course.course_score = parseInt(course.course_score);
    course.course_passing_score = parseInt(course.course_passing_score);
    course.course_max_attempts = parseInt(course.course_max_attempts);

    const res = await post(endpoint, course);
    if (res.status === 200) {
      fetchData(0, pageSize);
      message.success(`Course ${isEdit ? "updated" : "added"} successfully.`);
      setIsModalVisible(false);
    } else {
      message.error(`${res.message}`);
    }
    setLoading(false);
  };

  const addCourse = () => {
    setCurrentCourse(null); // No current course when adding new
    setIsModalVisible(true);
    setIsEdit(false);
  };

  const editCourse = (course) => {
    setCurrentCourse(course); // Set current course to edit
    setIsModalVisible(true);
    setIsEdit(true);
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };

  const deleteCourse = async () => {
    const endpoint = `/api/courses/${dataToDelete.course_id}`;
    const res = await deleteData(endpoint, dataToDelete);
    if(res.status === 200){
      fetchData(offset, pageSize);
    } else{
      message.error(res.message);
    }
    setDeleteModalVisibility(false);
    setDataToDelete({});
  };

  const { Search } = Input;
  
  const fetchData = async (offset, limit, sortField = "course_id", sortOrder = "asc", searchKey = null) => {  
    setLoading(true);
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl = `${apiHost}/api/courses?limit=${limit}&offset=${offset}`;
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
        const rawData = await response.json();
        if (
          rawData.data &&
          rawData.data.courses &&
          rawData.data.courses.length > 0
        ) {
          setCourses(rawData.data.courses);
          setTotalCoursesCount(rawData.data.totalCount);
        } else {
          setCourses([]);
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      message.error(`Failed to load data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, pageSize);
  }, []); // Only fetch when searchKey changes after debounce


  return (
    <div className="main-container">

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteCourse}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>


      <Space style={{ marginBottom: 16 }}>
        <Search
          className="search-class"
          placeholder="Search exams"
          enterButton
          onChange={(e) => debouncedSearchHandler(e.target.value)}
        />
      </Space>
      <Button className="button-class"
        type="primary"
        block
        icon={<PlusOutlined />}
        onClick={addCourse}
      >
        Add Course
      </Button>
      <div className="table-container">
        <TableView
          data={courses}
          columns={columns}
          loading={loading}
          currentPage={currentPage}
          totalCount={totalCourseCount}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
          setOffset={setOffset}
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
        />
      </div>
      <AddCourseForm
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddOrEditCourse}
        initialData={currentCourse}
      />
    </div>
  );
};

export default Exam;
