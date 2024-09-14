import React, { useState, useEffect } from "react";
import { Form, Table, Checkbox, Button, Card, Tooltip, message } from "antd";
import moment from "moment";
import { post, deleteData } from "../global/api";
import { useNavigate } from "react-router-dom";
import '../css/Teacher.css'; // Import the CSS file


const StaffAttendance = () => {
  // Inside your Exam component
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const master_role_id = localStorage.getItem('master_role_id');

  let daysLength = 6;
  // Teacher role show only 2 days
  if(master_role_id === 2){
    daysLength = 2;
  }
  const last10Days = [];
  for (let i = daysLength; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('DD/MM/YYYY');
      last10Days.push(date);
  }

  const [staff, setStaff] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiHost = process.env.REACT_APP_API_HOST;

      let uperdate = moment().utc().startOf('day').format();
      let lowerdate = moment().utc().startOf('day').subtract(6, 'days').format();

      if(master_role_id === 2){
        lowerdate = moment().subtract(2, 'days').format();
      }

      const apiURL = `${apiHost}/api/attendance/?lowerDateLimit=${lowerdate}&upperDateLimit=${uperdate}`;
      
      const response = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const rawData = await response.json();
        const updatedStaff = rawData.data.map((staffMember) => {
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
    fetchData();
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
      fetchData();
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
      dataIndex: "name",
      key: "name",
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
            onChange={(e) => handleCheckboxChange(record.student_id, i, e.target.checked)}
          />
        </Tooltip>
      ),
    })),
  ];

  return (
    <div className="table-container">
      <Card title="Attendance" className="attendance-card">
      <Button
              type="primary"
              onClick={() => navigate(`/attendance/report/`)}
            >
              Report
            </Button>
        <Form onFinish={onFinish}>
          <Table
            columns={columns}
            dataSource={staff}
            pagination={true}
            rowKey="key"
            className="attendance-table"
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
