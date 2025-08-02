import React, { useEffect, useState } from "react";
import { Button, Space, message, Form, Modal, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import { DatabaseOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import TableView from "./TableView";
import { pageSize } from "../pages/constants";
import { post, deleteData, put } from "../global/api";
import AddExamForm from "../components/AddExamForm"; // Make sure the path is correct
import axios from "axios";
import moment from "moment";
import { Option } from "antd/es/mentions";


const ScheduleExam = () => {
  const [examSchedules, setExamSchedule] = useState([]);
  const [currentCourse, setCurrentExam] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("schedule_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExamScheduleCount, setTotalExamScheduleCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [selectedStatusValue, setSelectedStatusValue] = useState("true");
  const master_role_id = Number(localStorage.getItem("master_role_id"));


  const token = localStorage.getItem("token") || "";
  const { examId } = useParams(); // Use useParams to get examId from the route

  const addExam = () => {
    setCurrentExam(null); // No current course when adding new
    setIsModalVisible(true);
    setIsEdit(false);
  };

  const editExam = (course) => {
    setCurrentExam(course); // Set current course to edit
    setIsModalVisible(true);
    setIsEdit(true);
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };


  const deleteExam = async () => {
    const endpoint = `/api/exam/schedule/${dataToDelete.schedule_id}`;
    const res = await deleteData(endpoint, dataToDelete);
    if(res.status === 200){
      fetchData(offset, pageSize);
    } else{
      message.error(res.message);
    }
    setDeleteModalVisibility(false);
    setDataToDelete({});
  };

  const fetchData = async (offset, limit, sortField = "schedule_id", sortOrder = "asc", searchKey = null) => {  
    setLoading(true);
    const apiHost = process.env.REACT_APP_API_HOST;

    let apiUrl = `${apiHost}/api/exam/schedule/${examId}?limit=${limit}&offset=${offset}`;
    if (searchKey && searchKey.length > 0) {
      apiUrl = apiUrl + `&searchKey=${searchKey}`;
    }

    if (sortField) {
      apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
    }

    // Append exam status filter
    if (selectedStatusValue) {
      apiUrl += `&is_exam_active=${selectedStatusValue}`;
    }
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response = await axios.get(apiUrl, { headers });

    if (
      response.data.data &&
      response.data.data.courses &&
      response.data.data.courses.length > 0
    ) {
      response.data.data.courses.map((exam) => {
        exam.registration_starting_date = moment(exam.registration_starting_date).format("DD-MM-YYYY");
        exam.registration_closing_date = moment(exam.registration_closing_date).format("DD-MM-YYYY");
        return exam;
      });
      setTotalExamScheduleCount(response.data.data.totalCount);
      setExamSchedule(response.data.data.courses);
    } else {
      setExamSchedule([]);
    }

    setLoading(false);
  };

  const handleAddOrEditCourse = async (exam) => {
    if (isEdit && !exam.course_id) {
      console.error("Error: No ID provided for the course to edit");
      message.error("No course ID provided for editing.");
      return;
    }

    setLoading(true);
    const endpoint = `/api/exam/schedule/`;

      exam.total_marks = parseInt(exam.total_marks);
      exam.passing_score = parseInt(exam.passing_score);

      let res;
      res = isEdit ? await post(endpoint, exam) : await put(endpoint, exam);

    if (res.status === 200) {
      fetchData(0, pageSize);
      message.success(`Exam ${isEdit ? "updated" : "added"} successfully.`);
      setIsModalVisible(false);
    } else {
      message.error(`${res.message}`);
    }
    setLoading(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  const handleExamStatusFilterChange = (status) => {
    setSelectedStatusValue(status);
    setOffset(0);
    setCurrentPage(1);
  };
  
  const handleResultSearchChange = async (value) => {
    value = value.length > 0 ? value : null;
    fetchData(offset, pageSize, sortField, sortOrder, value);
  };

  useEffect(() => {
    fetchData(offset, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatusValue]);

  const columns = [
    { title: "Exam Name", dataIndex: "exam_name", key: "exam_name" },
    { title: "Reg. start date", dataIndex: "registration_starting_date", key: "start_date" },
    { title: "Reg. close date", dataIndex: "registration_closing_date", key: "end_date" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Total Marks", dataIndex: "total_marks", key: "total_marks" },
    { title: "Passing Marks", dataIndex: "passing_score", key: "passing_score" },
    { title: "Exam Date & Time", dataIndex: "exam_date", key: "exam_date",
    render: (_, record) =>
      `${moment(record.start_time).format("DD-MM-YYYY HH:MM A") || ""}, ${moment(record.end_time).format("DD-MM-YYYY HH:MM A") || ""}
    `},
    { title: "Create Date", dataIndex: "created_at", key: "created_at",
    render: (_, record) =>
      `${moment(record.created_at).format("DD-MM-YYYY HH:MM A") || ""}
    `},
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => editExam(record)}
            >
              Edit
            </Button>
          {master_role_id != 2 ? (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
            ) : ''}
            <Button
              type="primary"
              icon={<DatabaseOutlined />}
              onClick={() => navigate(`/applicants/${record.schedule_id}`)}
            >
              View Applicants
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div  className="main-container">
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteExam}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>
      <Space style={{ marginTop: 20, marginRight: 20, float: "right" }}>
        <Search
          style={{ marginTop: 0, marginLeft: 10 }}
          placeholder="Search applicants"
          enterButton
          onChange={(e) => handleResultSearchChange(e.target.value)}
        />

        <Select
              onChange={handleExamStatusFilterChange}
              showSearch={true}
              placeholder="Select Status"
              optionFilterProp="children"
              value={selectedStatusValue}
              allowClear={true}
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: "100%", maxWidth: "120px" }}
            >
              <Option key={"1"} value={"true"}>
                Active
              </Option>
              <Option key={"2"} value={"false"}>
                DeActive
              </Option>
            </Select>

        <Button className="button-class"
            type="primary"
            block
            icon={<PlusOutlined />}
            onClick={addExam}
        >
            Add Exam
      </Button>
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

      <TableView
        data={examSchedules}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalCount={totalExamScheduleCount}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setOffset={setOffset}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
      <AddExamForm
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddOrEditCourse}
        initialData={currentCourse}
      />
    </div>
  );
};

export default ScheduleExam;
