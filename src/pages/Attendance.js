import React, { useState, useEffect } from "react";
import {
  Form,
  Checkbox,
  Button,
  Card,
  Tooltip,
  message,
  Space,
  Select,
  DatePicker
} from "antd";
import moment from "moment";
import { post } from "../global/api";
import { useNavigate } from "react-router-dom";
import "../css/Teacher.css"; // Import the CSS file
import TableView from "../components/TableView";
import { DownloadOutlined } from "@ant-design/icons";
import { pageSize, ATTENDANCE_DAYS } from "../pages/constants";
import axios from "axios";
import dayjs from "dayjs";
import { StudentView } from "../components/StudentView";

const { Option } = Select;
const { RangePicker } = DatePicker;

const StaffAttendance = () => {
  // Inside your Exam component
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [todayAttendanceCount, setTodayAttendanceCount] =
    useState("Fetching...");
  const [offset, setOffset] = useState(0);
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [teachers, setTeachers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [teacherId, setTeacherId] = useState(0);
  const token = localStorage.getItem("token");
  const master_role_id = Number(localStorage.getItem("master_role_id"));
  const [lastSelectedDays, setLastSelectedDays] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isViewModalVisible, setViewModalVisible] = useState(false);

  // const [dates, setDates] = useState(null);
  const [dates, setDates] = useState([
    dayjs().subtract(ATTENDANCE_DAYS, "day"), // Two days before today
    dayjs(), // Today
  ]);

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };


  /* const disabledDate = (current) => {
    if (!dates || !dates[0]) {
      return false;
    }
    const startDate = dates[0];
    const tooLate = startDate.add(ATTENDANCE_DAYS, "day").isBefore(current, "day");
    const tooEarly = startDate.subtract(ATTENDANCE_DAYS, "day").isAfter(current, "day");
    return tooLate || tooEarly;
  }; */

  const handleDateChange = (val) => {
    if (val && val.length > 0) {
      const startDate = val[0];
      // console.log("Start Date:", startDate.format("YYYY-MM-DD"));
      // Calculate the new default end date
      const newDate = startDate.add(ATTENDANCE_DAYS, "day");
      let endDate = dayjs(val[1]); // Ensure endDate is a Day.js object

      if (endDate.isAfter(newDate)) {
        endDate = newDate;
      }
      // console.log("Final End Date:", endDate.format("YYYY-MM-DD"));
      setDates([startDate, endDate]);
      console.log("teacherIdteacherId", teacherId)
      fetchData(0, 10, "first_name", "asc", teacherId);
    }
  };

  /* let daysLength = ATTENDANCE_DAYS;
  const last10Days = [];
  for (let i = daysLength; i >= 0; i--) {
    const date = moment().subtract(i, "days").format("DD/MM/YYYY");
    last10Days.push(date);
  } */
  const getLast10Days = (startDate, endDate) => {
    const days = [];
    let currentDate = dayjs(startDate);
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      days.push(currentDate.format("DD/MM/YYYY"));
      currentDate = currentDate.add(1, "day");
    }
    return days;
  };
  const last10Days = dates ? getLast10Days(dates[0], dates[1]) : getLast10Days(moment().subtract(ATTENDANCE_DAYS, "days"), moment());

  const [staff, setStaff] = useState([]);
  const [uncheckedData, setUncheckedData] = useState([]);

  const fetchData = async (
    offset,
    limit,
    sortField = "first_name",
    sortOrder = "asc",
    teacherId
  ) => {
    try {
      setLoading(true);
      const apiHost = process.env.REACT_APP_API_HOST;
      const startDate = dates[0].startOf("day");
      const endDate = dates[1].endOf("day");

      const lowerDate = encodeURIComponent(startDate.format());
      const upperDate = encodeURIComponent(endDate.format());


      let apiURL = `${apiHost}/api/attendance/?lowerDateLimit=${lowerDate}&upperDateLimit=${upperDate}&limit=${limit}&offset=${offset}`;

      if (teacherId && teacherId !== "None") {
        apiURL += `&teacherId=${teacherId}`;
      }

      if (sortField) {
        if (sortField === "name") {
          sortField = "first_name";
        }
        apiURL += `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      } else {
        sortField = "first_name";
        sortOrder = "asc";
        apiURL += `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      const response = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        await getTotalCount();
        const rawData = await response.json();
        setTotalCount(rawData.data.totalCount);

        const updatedStaff = rawData.data?.users.map((staffMember) => {
          const attendance = last10Days.map((date, index) => {
            const isChecked = staffMember.checked_dates.includes(date);
            return {
              date,
              checked: isChecked,
              disabled: false,
            };
          });
          return { ...staffMember, key: staffMember.student_id, attendance }; // Set key here
        });

        setStaff(updatedStaff);
      } else {
        console.error("Error fetching data:", response.statusText);
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
    if (dates && dates[0] && dates[1]) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);
      const range = [];
  
      for (let i = 0; i <= end.diff(start, "day"); i++) {
        range.push(start.add(i, "day").format("DD/MM/YYYY"));
      }
      
      setLastSelectedDays(range); // Update state when date range changes
    } else {
      // Default to last 2 days + today when no date selected
      const defaultRange = [];
      for (let i = 2; i >= 0; i--) {
        defaultRange.push(dayjs().subtract(i, "day").format("DD/MM/YYYY"));
      }
      setLastSelectedDays(defaultRange);
    }
  
    fetchData(offset, pageSize);
    fetchTeachersData();
    getTotalCount();
  }, [dates]);

  const handleFetchData = (offset, limit, sortField, sortOrder) => {
    fetchData(offset, limit, sortField, sortOrder, teacherId);
  };

  const handleCheckboxChange = (key, index, checked) => {
    console.log("key=========", key)
    console.log("index=========", index)
    console.log("checked=========", checked)
    if (!checked) {
      const uncheckedStaff = staff
        .filter((item) => item.student_id === key)
        .map((item) =>
          item.attendance.map((att, idx) =>
            idx === index ? { ...att, student_id: key, checked } : null
          )
        )
        .flat()
        .find((item) => item !== null);

      setUncheckedData((prevUncheckedData) => [
        ...prevUncheckedData,
        uncheckedStaff,
      ]);
    }

    setStaff((prevData) =>
      prevData.map((item) =>
        item.student_id === key
          ? {
              ...item,
              attendance: item.attendance.map((att, idx) =>
                idx === index ? { ...att, checked } : att
              ),
            }
          : item
      )
    );
  };

  const handleFilterChange = (teacherId) => {
    setTeacherId(teacherId);
    setSelectedValue(teacherId);
    setOffset(0);
    fetchData(0, pageSize, null, null, teacherId);
    setCurrentPage(1);
  };

  const handleStudentView = (record) => {
    setCurrentStudent(record); // Set current course to edit
    setViewModalVisible(true);
  };

  const onFinish = async () => {
    console.log("last10Days", last10Days)
    setLoading(true);
    const payload = {
      attendance: staff.map((staff) => ({
        student_id: staff.student_id,
        checked_dates: staff.attendance
          .map((att, idx) => (att.checked ? last10Days[idx] : null))
          .filter((date) => date !== null),
      })),
      removals: uncheckedData,
    };

    const endpoint = "/api/attendance";
    const res = await post(endpoint, payload);
    if (res.status === 200) {
      fetchData(offset, pageSize, null, null, teacherId);
      message.success(`Attendance filled successfully.`);
    } else {
      message.error(`Failed to update attendance.`);
    }
    setUncheckedData([]);
    setLoading(false);
    // Make an API request or handle the payload as needed
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 300,
      render: (text, record) => (
        <a
          onClick={() => handleStudentView(record)}
          style={{ color: "#1677ff", cursor: "pointer" }}
        >
          {text}
        </a>
      ),    
    },
    ...lastSelectedDays.map((date, i) => ({
      title: date,
      dataIndex: `day${i + 1}`,
      key: `day${i + 1}`,
      render: (_, record) => (
        <Tooltip title={date}>
          <Checkbox
            className="custom-checkbox"
            checked={record.attendance[i]?.checked}
            disabled={record.attendance[i]?.disabled}
            onChange={(e) =>
              handleCheckboxChange(record.student_id, i, e.target.checked)
            }
          />
        </Tooltip>
      ),
    })),
  ];

  const getTotalCount = async () => {
    // const apiHost = process.env.REACT_APP_API_HOST;
    let apiUrl = `/api/attendance_report_by_day`;
    let date = moment().format();

    let reqObj = {
      limit: 20,
      offset: 0,
      date,
    };
    const res = await post(apiUrl, reqObj);
    if (res.status === 200) {
      setTodayAttendanceCount(res.data.toString());
    } else {
      message.error(`Failed to course.`);
    }
  };

  return (
    <div className="main-container">
      <Card
        title="Attendance"
        extra={
          <>
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              Today's Attendance Count: {todayAttendanceCount}
            </span>
          </>
        }
      >
        <Button
          type="primary"
          onClick={() => navigate(`/attendance/report/`)}
          style={{ marginBottom: "20px" }}
          icon={<DownloadOutlined />}
        >
          Attendance Report
        </Button>
        <StudentView
        data={currentStudent}
        isViewModalVisible={isViewModalVisible}
        setViewModalVisibility={setViewModalVisible}
      />
        {master_role_id !== 2 ? (
          <Space style={{ float: "right", marginTop: "10px" }}>
            Filter by teacher:
            <Select
              onChange={handleFilterChange}
              showSearch={true}
              placeholder="Select Teacher"
              optionFilterProp="children"
              value={selectedValue}
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: 200 }}
            >
              <Option key={"None"} value={undefined}>
                None
              </Option>

              {teachers.map((teacher, index) => (
                <Option key={index} value={teacher.teacher_id}>
                  {teacher.teacher_first_name + " " + teacher.teacher_last_name}
                </Option>
              ))}
            </Select>
          </Space>
        ) : (
          ""
        )}
        <Space style={{ float: "right", marginTop: "10px" }}>
        <RangePicker
          value={dates}
          onChange={handleDateChange} // Trigger API call when dates change
          disabledDate={disabledDate}
        />
        </Space>
        <div className="table-container">
          <Form onFinish={onFinish}>
            <TableView
              data={staff}
              columns={columns}
              loading={loading}
              currentPage={currentPage}
              totalCount={totalCount}
              setSortField={setSortField}
              setSortOrder={setSortOrder}
              setOffset={setOffset}
              setCurrentPage={setCurrentPage}
              // fetchData={fetchData}
              fetchData={handleFetchData} // Pass the wrapper instead of fetchData
            />
            <div className="button-container">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: "30px", float: "right" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default StaffAttendance;
