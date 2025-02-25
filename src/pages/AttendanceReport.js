/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Drawer, List, message, Space, Select } from "antd";
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
    <div>
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

      <Space style={{ marginTop: 20, marginRight: 20 }}>
        <Search
          style={{ marginTop: 0, marginLeft: 10 }}
          placeholder="Search applicants"
          enterButton
          onChange={(e) => handleApplicantsSearchChange(e.target.value)}
        />
      </Space>
      <Space style={{ float: "right" }}>
        <Space>
          {master_role_id !== 2 && (
            <Space>
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
                style={{ width: 200 }}
              >
                <Option key={"M"} value={"Male"}>
                  Male
                </Option>
                <Option key={"F"} value={"Female"}>
                  Female
                </Option>
              </Select>

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
                style={{ width: 200 }}
              >
                {teachers.map((teacher, index) => (
                  <Option key={index} value={teacher.teacher_id}>
                    {teacher.teacher_first_name +
                      " " +
                      teacher.teacher_last_name}
                  </Option>
                ))}
              </Select>
            </Space>
          )}
        </Space>
        <Space>
          <FormItemLabel label="From" />
          <DatePicker
          style={{}}
          placeholder="Select from date"
          defaultValue={defaultFromDate}
          value={dayjs(lowerDateLimit)}
          allowClear={true}
          onChange={handleFromDateChange}
        />
        </Space>
        <Space style={{ marginLeft: 10 }}>
          <FormItemLabel label="To" />

          <DatePicker
          style={{}}
          placeholder="Select to date"
          defaultValue={defaultToDate}
          value={dayjs(upperDateLimit)}
          allowClear={true}
          onChange={handleToDateChange}
        />
        </Space>
        <Button
          type="primary"
          style={{
            margin: "20px",
            float: "right",
          }}
          onClick={() => exportDataToExcel()}
          icon={<DownloadOutlined />}
        >
          Export To Excel
        </Button>
      </Space>

      <TableView
        style={{
          margin: "20px",
        }}
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

      {/* Drawer to show attendance details */}
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
              <span>
                {moment(item.date, "YYYY/MM/DD").format("DD-MM-YYYY")}
              </span>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
});

export default AttendanceView;
