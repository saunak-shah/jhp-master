import React, { useEffect, useState, useCallback } from "react";
import { Button, Space, message, Form, Modal, Select, Switch } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import TableView from "./TableView";
import { pageSize } from "../pages/constants";
import { post, deleteData, put } from "../global/api";
import AddExamForm from "../components/AddExamForm";
import axios from "axios";
import moment from "moment";
import { Option } from "antd/es/mentions";
import debounce from "lodash/debounce";


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
  const [searchKey, setSearchKey] = useState("");
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
      fetchData(offset, pageSize, sortField, sortOrder, searchKey);
    } else{
      message.error(res.message);
    }
    setDeleteModalVisibility(false);
    setDataToDelete({});
  };

  const handlePublishToggle = async (record, checked) => {
    try {
      const payload = {
        is_result_publish: checked,
        schedule_id: record.schedule_id,
      };
  
      const apiHost = process.env.REACT_APP_API_HOST;
      const url = `${apiHost}/api/exam/result/publish`;
  
      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
  
      const res = await axios.put(url, payload, { headers });
  
      if (res.status === 200) {
        message.success(
          `Result ${checked ? "published" : "unpublished"} successfully.`
        );
        fetchData(offset, pageSize, sortField, sortOrder, searchKey);
      } else {
        message.error(res.data?.message || "Failed to update publish status");
      }
    } catch (error) {
      console.error("Publish toggle error:", error);
      message.error("Error while updating publish status");
    }
  };

  const fetchData = async (offset, limit, sortField = "schedule_id", sortOrder = "asc", searchKeyValue = null) => {  
    setLoading(true);
    const apiHost = process.env.REACT_APP_API_HOST;

    let apiUrl = `${apiHost}/api/exam/schedule/${examId}?limit=${limit}&offset=${offset}`;
    if (searchKeyValue && searchKeyValue.length > 0) {
      apiUrl = apiUrl + `&searchKey=${searchKeyValue}`;
    }

    if (sortField) {
      apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
    }

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
      setTotalExamScheduleCount(0);
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
      fetchData(0, pageSize, sortField, sortOrder, searchKey);
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
  
  const handleSearchChange = useCallback(
    debounce((value) => {
      const key = value.length > 0 ? value : null;
      setSearchKey(key);
      setOffset(0);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchData(offset, pageSize, sortField, sortOrder, searchKey);
  }, [selectedStatusValue]);

  const columns = [
    { title: "Exam Name", dataIndex: "exam_name", key: "exam_name", ellipsis: true, width: 150 },
    { title: "Reg Start", dataIndex: "registration_starting_date", key: "start_date", width: 120 },
    { title: "Reg Close", dataIndex: "registration_closing_date", key: "end_date", width: 120 },
    { title: "Location", dataIndex: "location", key: "location", ellipsis: true, width: 120 },
    { title: "Total Marks", dataIndex: "total_marks", key: "total_marks", width: 100 },
    { title: "Pass Marks", dataIndex: "passing_score", key: "passing_score", width: 100 },
    { title: "Schedule", dataIndex: "exam_date", key: "exam_date", width: 220,
    render: (_, record) =>
      `${moment(record.start_time).format("DD-MM-YYYY HH:mm A") || ""} - ${moment(record.end_time).format("HH:mm A") || ""}
    `},
    { title: "Created", dataIndex: "created_at", key: "created_at", width: 120,
    render: (_, record) =>
      `${moment(record.created_at).format("DD-MM-YYYY") || ""}
    `},
    // Inside columns array
    {
      title: "Pub Result",
      dataIndex: "is_result_publish",
      key: "is_result_publish",
      width: 120,
      render: (value, record) => (
        <Switch
          checked={!!value} // true/false
          disabled={master_role_id === 2} // disable for role 2
          onChange={(checked) => handlePublishToggle(record, checked)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 280,
      render: (text, record) => {
        return (
          <Space size="small">
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
              Applicants
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
      <Button
        type="default"
        style={{
          margin: "0 0 16px 0",
        }}
        onClick={() => navigate(-1)}
        icon={<LeftOutlined />}
      >
        Back
      </Button>
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <Search
            placeholder="Search applicants"
            enterButton
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="table-toolbar-right">
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
            style={{ maxWidth: "120px" }}
          >
            <Option key={"1"} value={"true"}>
              Active
            </Option>
            <Option key={"2"} value={"false"}>
              DeActive
            </Option>
          </Select>
          <Button
              type="primary"
              block
              icon={<PlusOutlined />}
              onClick={addExam}
          >
              Add Exam
          </Button>
        </div>
      </div>

      <div className="table-container">
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
        searchKey={searchKey}
        hideOnMobile={["registration_starting_date", "registration_closing_date", "location", "total_marks", "created_at"]}
      />
      </div>
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
