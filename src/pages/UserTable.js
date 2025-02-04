import React, { useEffect, useState } from "react";
import {
  Input,
  Space,
  Button,
  Select,
  Modal,
  Form,
  message,
  DatePicker,
} from "antd";
import { observer } from "mobx-react-lite";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import "../css/Teacher.css"; // Import the CSS file
import { deleteData } from "../global/api";
import ChangeTeacher from "../components/ChangeTeacher"; // Make sure the path is correct
import moment from "moment";
import { StudentView } from "../components/StudentView";
import StudentEditModal from "../components/StudentEdit";

const { Option } = Select;

const UserTable = observer(() => {
  let filter = {};
  const { Search } = Input;
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [teacherId, setTeacherId] = useState(0);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTeacherValue, setSelectedTeacherValue] = useState(null);
  const [selectedGenderValue, setSelectedGenderValue] = useState(null);
  const [selectedStatusValue, setSelectedStatusValue] = useState(null);

  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const master_role_id = Number(localStorage.getItem("master_role_id"));
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchKey, setSearchKey] = useState("");


  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [form] = Form.useForm();

  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  const token = localStorage.getItem("token");

  const handleTeacherFilterChange = (teacherId) => {
    setTeacherId(teacherId);
    setSelectedTeacherValue(teacherId);
    setOffset(0);
    fetchData(offset, pageSize, null, teacherId);
    setCurrentPage(1);
  };

  const handleGenderFilterChange = (gender) => {
    setSelectedGenderValue((val) => gender);
    setOffset(0);
    fetchData(offset, pageSize, null, teacherId);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatusValue(status);
    setOffset(0);
    filter = {...filter, status};
    fetchData(offset, pageSize, null, teacherId, null, filter);
    setCurrentPage(1);
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };

  const deleteStudent = async () => {
    const endpoint = `/api/students/${dataToDelete.student_id}`;
    await deleteData(endpoint, dataToDelete);
    setDeleteModalVisibility(false);
    setDataToDelete({});
    fetchData(offset, pageSize);
  };

  const handleFromDateChange = async (date) => {
    if (!date) {
      setFromDate(null);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, null);
      return;
    }

    if (toDate && date > toDate) {
      message.error("From date should be smaller than to date");
      setFromDate(fromDate);
    } else {
      setFromDate(date);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey);
    }
  };

  const handleToDateChange = async (date) => {
    if (!date) {
      setToDate(null);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey);
      return;
    }

    if (fromDate && date < fromDate) {
      message.error("To date should be greater than from date");
      setToDate(toDate);
    } else {
      setToDate(date);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey);
    }
  };

  const handleChangeAssignee = (record) => {
    setCurrentStudent(record); // Set current course to edit
    // setCurrentCourse(course); // Set current course to edit
    setIsModalVisible(true);
  };

  const handleStudentView = (record) => {
    setCurrentStudent(record); // Set current course to edit
    // setCurrentCourse(course); // Set current course to edit
    setViewModalVisible(true);
  };

  const handleStudentEdit = (record) => {
    setCurrentStudent(record); // Set current course to edit
    // setCurrentCourse(course); // Set current course to edit
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 300
    },
    { title: "Email", dataIndex: "email", key: "email", sorter: true },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
      sorter: true,
    },
    {
      title: "Enrolled On",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    { title: "Gender", dataIndex: "gender", key: "gender", sorter: true },
    {
      title: "Assigned To",
      dataIndex: "assigned_to",
      key: "assigned_to",
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
              icon={<EyeOutlined />}
              onClick={() => handleStudentView(record)}
            >
              View
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleStudentEdit(record)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={() => handleChangeAssignee(record)}
            >
              Change Teacher
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleUserSearchChange = (value) => {
    value = value.length > 0 ? value : null;
    setSearchKey(value);
    fetchData(offset, pageSize, sortField, sortOrder, value);
  };

  const fetchData = async (
    offset,
    limit,
    sortField = "first_name",
    sortOrder = "asc",
    searchKey = null,
    filter = {}
  ) => {
    setLoading(true);
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl;
      if (teacherId) {
        apiUrl = `${apiHost}/api/teachers/assignees/${teacherId}?limit=${limit}&offset=${offset}`;
      } else {
        apiUrl = `${apiHost}/api/students?limit=${limit}&offset=${offset}`;
      }
      // Append filters if searchKey is present
      if (searchKey) {
        apiUrl += `&searchKey=${encodeURIComponent(searchKey)}`;
      }
      // Append sorting parameters
      if (sortField) {
        apiUrl += `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }
      // Append gender filter
      if (selectedGenderValue) {
        apiUrl += `&gender=${selectedGenderValue}`;
      }

      // Append status filter
      if (filter.status) {
        apiUrl += `&status=${filter.status}`;
      }
      console.log(fromDate);
      console.log(toDate);
      if (fromDate) {
        apiUrl += `&fromDate=${fromDate}`;
      }

      if (toDate) {
        apiUrl += `&toDate=${toDate}`;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(apiUrl, { headers });
      if (response.data && response.data.data) {
        setTotalUserCount(response.data.data.totalCount);
        response.data.data.users.map((user) => {
          user.assigned_to =
            (user.teacher?.teacher_first_name || "-") +
            " " +
            (user.teacher?.teacher_last_name || "-");

          user.name =
            user.first_name + " " + user.father_name + " " + user.last_name;

          user.created_at = moment(user.created_at).format("DD-MM-YYYY");

          return user;
        });
        setUsers(response.data.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachersData = async () => {
    try {
      const limit = 100;
      const offset = 0;
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl = `${apiHost}/api/teachers?limit=${limit}&offset=${offset}`;

      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(apiUrl, { headers });

      if (
        response.data &&
        response.data.data &&
        response.data.data.teachers.length > 0
      ) {
        setTeachers(response.data.data.teachers);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, pageSize);
    fetchTeachersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId, selectedGenderValue, fromDate, toDate]);

  return (
    <div className="main-container">
      <StudentView
        data={currentStudent}
        isViewModalVisible={isViewModalVisible}
        setViewModalVisibility={setViewModalVisible}
      />

      <StudentEditModal
        data={currentStudent}
        isEditModalVisible={isEditModalVisible}
        setEditModalVisibility={setEditModalVisible}
        fetchData={fetchData}
        offset={offset}
        pageSize={pageSize}
      />
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteStudent}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <Space style={{ marginBottom: 16 }}>
        <Search
          className="search-class"
          placeholder="Search users"
          enterButton
          onChange={(e) => handleUserSearchChange(e.target.value)}
        />
      </Space>
      {master_role_id !== 2 ? (
        <Space style={{ float: "right", marginTop: "10px" }}>
          <Space
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <DatePicker
              style={{ width: "100%", maxWidth: "150px" }}
              placeholder="From date"
              // defaultValue={dayjs(defaultFromDate)}
              allowClear={true}
              onChange={(date) => handleFromDateChange(date)}
            />
            <DatePicker
              style={{ width: "100%", maxWidth: "150px" }}
              placeholder="To date"
              // defaultValue={dayjs(defaultToDate)}
              allowClear={true}
              onChange={(date) => handleToDateChange(date)}
            />
            <Select
              onChange={handleGenderFilterChange}
              showSearch={true}
              placeholder="Select Gender"
              optionFilterProp="children"
              value={selectedGenderValue}
              allowClear={true}
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: "100%", maxWidth: "120px" }}
            >
              <Option key={"M"} value={"Male"}>
                Male
              </Option>
              <Option key={"F"} value={"Female"}>
                Female
              </Option>
            </Select>

            <Select
              onChange={handleStatusFilterChange}
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
              <Option key={"1"} value={"Pending"}>
                Pending
              </Option>
              <Option key={"2"} value={"Approve"}>
                Approve
              </Option>
            </Select>
          </Space>

          <Space>
            <Select
              onChange={handleTeacherFilterChange}
              showSearch={true}
              allowClear={true}
              placeholder="Select Teacher"
              optionFilterProp="children"
              value={selectedTeacherValue}
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: "100%", maxWidth: "180px" }}
            >
              <Option key={"None"} value="None">
                None
              </Option>
              <Option key={"0"} value="0">
                No Assignee
              </Option>
              {teachers.map((teacher, index) => (
                <Option key={index} value={teacher.teacher_id}>
                  {teacher.teacher_first_name + " " + teacher.teacher_last_name}
                </Option>
              ))}
            </Select>
          </Space>
        </Space>
      ) : (
        ""
      )}

      <div className="table-container">
        <TableView
          data={users}
          columns={columns}
          loading={loading}
          currentPage={currentPage}
          totalCount={totalUserCount}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
          setOffset={setOffset}
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
        />
      </div>

      <ChangeTeacher
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        initialData={currentStudent}
        teachersData={teachers}
        setCurrentStudent={setCurrentStudent}
        setLoading={setLoading}
        fetchData={fetchData}
        pageSize={pageSize}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
});
export default UserTable;
