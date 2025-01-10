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
} from "antd";
import moment from "moment";
import { post } from "../global/api";
import { useNavigate } from "react-router-dom";
import "../css/Teacher.css"; // Import the CSS file
import TableView from "../components/TableView";
import { DownloadOutlined } from "@ant-design/icons";
import { pageSize } from "../pages/constants";
import axios from "axios";

const { Option } = Select;

const StaffAttendance = () => {
  // Inside your Exam component
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [todayAttendanceCount, setTodayAttendanceCount] = useState("Fetching...");
  const [offset, setOffset] = useState(0);
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [teachers, setTeachers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [teacherId, setTeacherId] = useState(0);
  const token = localStorage.getItem("token");
  const master_role_id = Number(localStorage.getItem("master_role_id"));
  let daysLength = 6;
  // Teacher role show only 2 days
  if (Number(master_role_id) === 2) {
    daysLength = 1;
  }
  const last10Days = [];
  for (let i = daysLength; i >= 0; i--) {
    const date = moment().subtract(i, "days").format("DD/MM/YYYY");
    last10Days.push(date);
  }

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

      let uperdate = moment().endOf("day").format();
      let lowerdate = moment().startOf("day").subtract(6, "days").format();

      if (Number(master_role_id) === 2) {
        lowerdate = moment().startOf("day").subtract(2, "days").format();
      }

      lowerdate = encodeURIComponent(lowerdate);
      uperdate = encodeURIComponent(uperdate);

      let apiURL = `${apiHost}/api/attendance/?lowerDateLimit=${lowerdate}&upperDateLimit=${uperdate}&limit=${limit}&offset=${offset}`;

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
    fetchData(offset, pageSize);
    fetchTeachersData();
    getTotalCount();
  }, []);

  const handleFetchData = (offset, limit, sortField, sortOrder) => {
    fetchData(offset, limit, sortField, sortOrder, teacherId);
  };

  const handleCheckboxChange = (key, index, checked) => {
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

  const onFinish = async () => {
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
      render: (_, record) =>
        `${record.first_name || ""} ${record.father_name || ""} ${
          record.last_name || ""
        }`,
    },
    ...last10Days.map((date, i) => ({
      title: date,
      dataIndex: `day${i + 1}`,
      key: `day${i + 1}`,
      render: (_, record) => (
        <Tooltip title={date}>
          <Checkbox
            checked={record.attendance[i].checked}
            disabled={record.attendance[i].disabled}
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
            Today's Attendance Count:  {todayAttendanceCount}
          </span> 
          
          </>
        }
        className="attendance-card"
      >
        <Button
          type="primary"
          onClick={() => navigate(`/attendance/report/`)}
          style={{ marginBottom: "20px" }}
          icon={<DownloadOutlined />}
        >
          Attendance Report
        </Button>
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
              <Button type="primary" htmlType="submit" style={{marginTop: '20px'}}>
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default StaffAttendance;
