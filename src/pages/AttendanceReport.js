/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, List, message, Space, Select, Flex, Menu, Dropdown } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import { post } from "../global/api";
import moment from "moment";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import * as XLSX from "xlsx";
import FormItemLabel from "antd/es/form/FormItemLabel";
import dayjs from 'dayjs';
import attendanceStore from "../stores/attendanceStore";
import { observer } from "mobx-react-lite";
import axios from "axios";
import "../css/Teacher.css"; // Import the CSS file
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const { Option } = Select;


const AttendanceView = observer(() => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [sortField, setSortField] = useState("attendance_count");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAttedanceCount, setTotalAttedanceCount] = useState(0);
  const [searchKey, setSearchKey] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherValue, setSelectedTeacherValue] = useState(null);
  const [selectedGenderValue, setSelectedGenderValue] = useState(null);

  const master_role_id = localStorage.getItem("master_role_id");

  const defaultFromDate = moment().startOf("month").format('YYYY-MM-DD');
  const defaultToDate = moment().endOf('day').format('YYYY-MM-DD');
  
  const [lowerDateLimit, setLowerDateLimit] = useState(defaultFromDate);
  const [upperDateLimit, setUpperDateLimit] = useState(defaultToDate);

  const [customExportDrawerVisible, setCustomExportDrawerVisible] = useState(false);
  const [cutoffStartDate, setCutoffStartDate] = useState(null);
  const [cutoffEndDate, setCutoffEndDate] = useState(null);
  const [cutoffAttendance, setCutoffAttendance] = useState(null);
  const [attnStartDate, setAttnStartDate] = useState(null);
  const [attnEndDate, setAttnEndDate] = useState(null);
  const [currentAttendanceCutoff, setcurrentAttendanceCutoff] = useState(null);


  const fetchData = async (
    offset,
    limit,
    sortField,
    sortOrder,
    searchKey = null,
    fromDate = null,
    toDate = null
  ) => {
    try {
      setLoading(true);

      let apiUrl = `/api/attendance_report?limit=${limit}&offset=${offset}`;
      if (searchKey && searchKey.length > 0) {
        apiUrl = apiUrl + `&searchKey=${searchKey}`;
      }

      if (sortField) {
        apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      const startDate = (fromDate) ? fromDate : lowerDateLimit;
      const endDate = (toDate) ? toDate : upperDateLimit;

      if (lowerDateLimit) {
        apiUrl = apiUrl + `&lowerDateLimit=${startDate}`;
      }

      if (upperDateLimit) {
        apiUrl = apiUrl + `&upperDateLimit=${endDate}`;
      }

      if(selectedTeacherValue){
        apiUrl = apiUrl + `&teacherId=${selectedTeacherValue}`;
      }

      if(selectedGenderValue){
        apiUrl = apiUrl + `&gender=${selectedGenderValue}`;
      }

      let date = moment().format();

      let reqObj = {
        limit: 20,
        offset: 0,
        date,
      };
      const response = await post(apiUrl, reqObj);

      if (
        response.data &&
        response.data.attendance &&
        response.data.attendance.length > 0
      ) {
        setTotalAttedanceCount(response.data.totalCount);
        setApplicants(response.data.attendance);
      } else {
        setApplicants([]);
        setTotalAttedanceCount(0);
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
        Authorization: localStorage.getItem("token") || "",
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

  // Menu for dropdown
const exportMenu = (
  <Menu
    onClick={({ key }) => {
      if (key === "default") {
        exportDataToExcel();
      } else if (key === "custom") {
        setCustomExportDrawerVisible(true);
      }
    }}
  >
    <Menu.Item key="default">Default Export</Menu.Item>
    <Menu.Item key="custom">Custom Export</Menu.Item>
  </Menu>
);

  const handleGenderFilterChange = (gender) => {
    setSelectedGenderValue(gender);
    setOffset(0);
    setCurrentPage(1);
  };

   const handleTeacherFilterChange = (teacherId) => {
      setSelectedTeacherValue(teacherId);
      setOffset(0);
      setCurrentPage(1);
    };



  const handleApplicantsSearchChange = async (value) => {
    setSearchKey(value);
    await fetchData(0, pageSize, sortField, sortOrder, value, lowerDateLimit, upperDateLimit);
  };

  useEffect(() => {
    fetchData(offset, pageSize);
  }, [selectedGenderValue, selectedTeacherValue]);

  useEffect(() => {
    fetchTeachersData();
  }, []);

  const fetchAllAttendanceData = async () => {
    setLoading(true);

    const limit = 10000;
    const offset = 0;
    try {
      setLoading(true);

      let apiUrl = `/api/attendance_report?limit=${limit}&offset=${offset}`;
      if (lowerDateLimit) {
        apiUrl = apiUrl + `&lowerDateLimit=${lowerDateLimit}`;
      }

      if (upperDateLimit) {
        apiUrl = apiUrl + `&upperDateLimit=${upperDateLimit}`;
      }
      let date = moment().format();
      let reqObj = {
        limit: 20,
        offset: 0,
        date,
      };
      const response = await post(apiUrl, reqObj);

      if (!response.data || !response.data.attendance) {
        throw new Error(`Unable to fetch attendance`);
      }

      return response.data.attendance;
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }

    return null;
  };

  const fetchCustomAttendanceData = async (
    fromDate = lowerDateLimit,
    toDate = upperDateLimit,
    teacherId = selectedTeacherValue,
    cutoffStart = cutoffStartDate,
    cutoffEnd = cutoffEndDate,
    cutoffAttendanceVal = cutoffAttendance,
    currentAttendanceCutoffVal = currentAttendanceCutoff
  ) => {
    setLoading(true);

    const limit = 10000;
    const offset = 0;
    try {
      setLoading(true);
      
      console.log("fromDate", fromDate)
      console.log("toDate", toDate)
      console.log("cutoffStart", cutoffStart)
      console.log("cutoffEnd", cutoffEnd)
      let apiUrl = `/api/custom/attendance_report?limit=${limit}&offset=${offset}`;

      if (fromDate) apiUrl += `&attendanceStartDate=${fromDate}`;
      if (toDate) apiUrl += `&attendanceEndDate=${toDate}`;
      if (cutoffStart) apiUrl += `&cutoffStartDate=${cutoffStart}`;
      if (cutoffEnd) apiUrl += `&cutoffEndDate=${cutoffEnd}`;
      if (cutoffAttendanceVal) apiUrl += `&cutoffAttendanceCount=${cutoffAttendanceVal}`;
      if (currentAttendanceCutoffVal) apiUrl += `&currentAttendanceCutoff=${currentAttendanceCutoffVal}`;
      if(selectedGenderValue){
        apiUrl = apiUrl + `&gender=${selectedGenderValue}`;
      }
      if(selectedTeacherValue){
        apiUrl = apiUrl + `&teacherId=${selectedTeacherValue}`;
      }
      let date = moment().format();
      let reqObj = {
        limit: 20,
        offset: 0,
        date,
      };
      const response = await post(apiUrl, reqObj);

      if (!response.data || !response.data.attendance) {
        throw new Error(`Unable to fetch attendance`);
      }

      return response.data.attendance;
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }

    return null;
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportDataToExcel = async () => {
    const data = await fetchAllAttendanceData();
    exportToExcel(data, "Monthly_Attendance");
  };

  const handleFromDateChange = async (date, dateString) => {
    if (!date) {
      setLowerDateLimit(null);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, null, upperDateLimit);
      return;
    }

    if (upperDateLimit && date > upperDateLimit) {
      message.error('From date should be smaller than to date');
      setLowerDateLimit(lowerDateLimit); 
    } else {
      const fromDate = moment(dateString).format("YYYY-MM-DD");
      setLowerDateLimit(fromDate);

      await fetchData(0, pageSize, sortField, sortOrder, searchKey, fromDate, upperDateLimit);
    }
  };

  const handleToDateChange = async (date, dateString) => {
    if (!date) {
      setUpperDateLimit(null);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, lowerDateLimit, null);
      return;
    }

    if (lowerDateLimit && date < lowerDateLimit) {
      message.error('To date should be greater than from date');
      setUpperDateLimit(upperDateLimit);
    } else {
      const toDate = moment(dateString).format("YYYY-MM-DD");
      setUpperDateLimit(toDate);
      // setUpperDateLimit(date);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, lowerDateLimit, toDate);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "full_name", key: "full_name" },
    {
      title: "Attendance Count",
      dataIndex: "attendance_count",
      key: "attendance_count",
      sorter: true,
      render:(_, item) => (
        <p style={{
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "blue",
        }} 
        onClick={() => attendanceStore.openDrawer(item)}
        >
           {item.attendance_count}
        </p>
      )
    },
  ];

  return (
    <div className="main-container">
      <Flex
        wrap="wrap"
        gap={8} // Reduced space between items
        align="center"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Button
          type="default"
          onClick={() => navigate(-1)}
          icon={<LeftOutlined />}
        >
          Back
        </Button>

        {/* Search Bar */}
        <div className="att-report-search">
          <Search
            placeholder="Search applicants"
            enterButton
            onChange={(e) => handleApplicantsSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        <Flex
          wrap="wrap"
          gap={8}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          {master_role_id !== 2 && (
            <Select
              onChange={handleGenderFilterChange}
              showSearch
              placeholder="Select Gender"
              allowClear
              style={{ width: 150 }}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          )}

          <Select
            onChange={handleTeacherFilterChange}
            showSearch
            placeholder="Select Teacher"
            allowClear
            style={{ width: 180 }}
          >
            {teachers.map((teacher, index) => (
              <Option key={index} value={teacher.teacher_id}>
                {teacher.teacher_first_name} {teacher.teacher_last_name}
              </Option>
            ))}
          </Select>

          <DatePicker
            placeholder="From Date"
            value={dayjs(lowerDateLimit)}
            allowClear
            onChange={handleFromDateChange}
            style={{ width: 140 }}
          />

          <DatePicker
            placeholder="To Date"
            value={dayjs(upperDateLimit)}
            allowClear
            onChange={handleToDateChange}
            style={{ width: 140 }}
          />

          <Dropdown overlay={exportMenu} trigger={["click"]}>
            <Button icon={<DownloadOutlined />} type="primary">
              Export To Excel
            </Button>
          </Dropdown>
        </Flex>
      </Flex>

      <TableView
        style={{ margin: "20px" }}
        data={applicants}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalCount={totalAttedanceCount}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setOffset={setOffset}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />

      <Drawer
        title="Custom Export"
        placement="right"
        open={customExportDrawerVisible}
        onClose={() => setCustomExportDrawerVisible(false)}
        width={360}
      >
        <Flex vertical gap={16}>
          {/* === Section 1: Cut-off Filters === */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                backgroundColor: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: 16 }}>
                Cut-off Filters
              </span>

              <Tooltip
                title={
                  <div>
                    <p>
                      <strong>Cut-off Start Date:</strong> Select previous month 
                        start date when last time gift distributed.
                    </p>
                    <p>
                      <strong>Cut-off End Date:</strong> Select previous month 
                        end date when last time gift distributed.
                    </p>
                    <p>
                      <strong>Cut-off Attendance:</strong> Students above this
                      count will be included.
                    </p>
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: "#1890ff", cursor: "pointer", fontSize: 16 }}
                />
              </Tooltip>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Cut-off Start Date</label>
              <DatePicker
                placeholder="Select Cut-off Start Date"
                value={cutoffStartDate ? dayjs(cutoffStartDate) : null}
                onChange={(date, dateStr) => setCutoffStartDate(dateStr)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Cut-off End Date</label>
              <DatePicker
                placeholder="Select Cut-off End Date"
                value={cutoffEndDate ? dayjs(cutoffEndDate) : null}
                onChange={(date, dateStr) => setCutoffEndDate(dateStr)}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label>Cut-off Attendance</label>
              <Select
                placeholder="Select attendance"
                value={cutoffAttendance}
                onChange={setCutoffAttendance}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                {[...Array(100)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* === Section 2: Attendance Date Range === */}
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                backgroundColor: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: 16 }}>
                Attendance Filters
              </span>
              <Tooltip
                title={
                  <div>
                    <p>
                      <strong>Attendance start date:</strong> Select Current month start date
                    </p>
                    <p>
                      <strong>Attendance end date:</strong> Select current month end date.
                    </p>
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: "#1890ff", cursor: "pointer", fontSize: 16 }}
                />
              </Tooltip>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Attendance Start Date</label>
              <DatePicker
                placeholder="Select Attendance Start Date"
                value={attnStartDate ? dayjs(attnStartDate) : null}
                onChange={(date, dateStr) => setAttnStartDate(dateStr)}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label>Attendance End Date</label>
              <DatePicker
                placeholder="Select Attendance End Date"
                value={attnEndDate ? dayjs(attnEndDate) : null}
                onChange={(date, dateStr) => setAttnEndDate(dateStr)}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label>Current Attendance Cut Off</label>
              <Select
                placeholder="Select attendance"
                value={currentAttendanceCutoff}
                onChange={setcurrentAttendanceCutoff}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                {[...Array(100)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div>
          
          {master_role_id !== 2 && (
            <Select
              onChange={handleGenderFilterChange}
              showSearch
              placeholder="Select Gender"
              allowClear
              style={{ width: 150 }}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          )}
          </div>
          <div>
          <Select
            onChange={handleTeacherFilterChange}
            showSearch
            placeholder="Select Teacher"
            allowClear
            style={{ width: 180 }}
          >
            {teachers.map((teacher, index) => (
              <Option key={index} value={teacher.teacher_id}>
                {teacher.teacher_first_name} {teacher.teacher_last_name}
              </Option>
            ))}
          </Select>
          </div>

          {/* === Export Button === */}
          <Button
            type="primary"
            block
            onClick={async () => {
              const data = await fetchCustomAttendanceData(
                attnStartDate,
                attnEndDate
              );
              exportToExcel(data, "Custom_Attendance");
              setCustomExportDrawerVisible(false);
            }}
          >
            Export
          </Button>
        </Flex>
      </Drawer>

      <Drawer
        title="Attendance Details"
        placement="right"
        width={400}
        onClose={() => attendanceStore.closeDrawer()}
        open={attendanceStore.isDrawerOpen}
      >
        <List
          dataSource={attendanceStore.attendanceDetails}
          renderItem={(item) => (
            <List.Item>
              <span>{dayjs(item.date, "YYYY/MM/DD").format("DD-MM-YYYY")}</span>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
});

export default AttendanceView;
