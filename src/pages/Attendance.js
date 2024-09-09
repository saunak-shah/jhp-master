import React, { useState, useEffect } from "react";
import { Form, Table, Checkbox, Button, Card, Tooltip, message } from "antd";
import moment from "moment";
import { post, deleteData } from "../global/api";

const StaffAttendance = () => {
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const last10Days = Array.from({ length: 2 }, (_, i) =>
    moment()
      .subtract(9 - i, "days")
      .format("DD/MM/YYYY")
  );
  const [staff, setStaff] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiHost = process.env.REACT_APP_API_HOST;
      const uperdate = "2025-08-12T18:30:00.000Z";
      const lowerdate = "2023-08-12T18:30:00.000Z";
      const apiURL = `${apiHost}/api/attendance/?lowerDateLimit=${lowerdate}&upperDateLimit=${uperdate}`;
      const response = await fetch(apiURL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const rawData = await response.json();
        console.log("Fetched data:", rawData);
        console.log("previous 10 date data ", last10Days);
        const updatedStaff = rawData.data.staff.map((staffMember) => {
          const attendance = last10Days.map((date, index) => {
            const isChecked = staffMember.checked_dates.includes(date);
            return {
              date,
              checked: isChecked,
              disabled: false,
            };
          });
          return { ...staffMember, attendance }; // Ensure the structure matches what is expected by the table
        });

        console.log("updated staff data", updatedStaff);
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
        item.key === key
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
    console.log("Payload:", payload);

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
            onChange={(e) =>
              handleCheckboxChange(record.key, i, e.target.checked)
            }
          />
        </Tooltip>
      ),
    })),
  ];

  return (
    <div className="attendance-container">
      <Card title="Staff Attendance" className="attendance-card">
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
