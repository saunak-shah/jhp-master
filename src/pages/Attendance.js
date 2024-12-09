import React, { useState, useEffect } from "react";
import { Form, Checkbox, Button, Card, Tooltip, message,  } from "antd";
import moment from "moment";
import { post } from "../global/api";
import { useNavigate } from "react-router-dom";
import "../css/Teacher.css"; // Import the CSS file
import TableView from "../components/TableView";
import { DownloadOutlined } from "@ant-design/icons";
import { pageSize } from "../pages/constants";


const StaffAttendance = () => {
  // Inside your Exam component
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const master_role_id = localStorage.getItem("master_role_id");
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

const fetchData = async (offset, limit, sortField = "first_name", sortOrder = "asc", searchKey = null) => {
    try {
      setLoading(true);
      const apiHost = process.env.REACT_APP_API_HOST;

      let uperdate = moment().endOf("day").format();
      let lowerdate = moment()
        .startOf("day")
        .subtract(6, "days")
        .format();

        if (Number(master_role_id) === 2) {
          lowerdate = moment()
          .startOf("day")
          .subtract(2, "days")
          .format();
        }
        
      lowerdate = encodeURIComponent(lowerdate);
      uperdate = encodeURIComponent(uperdate);

      let apiURL = `${apiHost}/api/attendance/?lowerDateLimit=${lowerdate}&upperDateLimit=${uperdate}&limit=${limit}&offset=${offset}`;
      
      if (sortField) {
        apiURL += `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      const response = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
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

  useEffect(() => {
    fetchData(offset, pageSize);
  }, []);

  const handleCheckboxChange = (key, index, checked) => {
    setStaff((prevData) =>
      prevData.map((item) =>
        item.student_id === key // Use student_id instead of key if that's more reliable
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

  const onFinish = async () => {
    const payload = {
      attendance: staff.map((staff) => ({
        student_id: staff.student_id,
        checked_dates: staff.attendance
          .map((att, idx) => (att.checked ? last10Days[idx] : null))
          .filter((date) => date !== null),
      })),
    };

    const endpoint = "/api/attendance";
    const res = await post(endpoint, payload);
    if (res.status === 200) {
      fetchData(offset, pageSize);
      message.success(`Attendance filled successfully.`);
    } else {
      message.error(`Failed to update attendance.`);
    }
    setLoading(false);
    // Make an API request or handle the payload as needed
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: true,
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

  return (
    <div className="main-container">
      <Card title="Attendance" className="attendance-card">
        <Button type="primary" onClick={() => navigate(`/attendance/report/`)} style={{marginBottom: "20px"}} icon={<DownloadOutlined/ >}>
          Attendance Report
        </Button>
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
            fetchData={fetchData}
          />
          <div className="button-container">
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
