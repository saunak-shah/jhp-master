import React, { useState, useEffect } from 'react';
import { Form, Table, Checkbox, Button, Card, Tooltip } from 'antd';
import moment from 'moment';

const StaffAttendance = () => {
    // const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const last10Days = Array.from({ length: 2 }, (_, i) =>
        moment().subtract(9 - i, 'days').format('DD/MM/YYYY')
    );
    const [staff, setStaff] = useState([])

    
    const fetchData = async () => {
        try {
            setLoading(true);
          const apiHost = process.env.REACT_APP_API_HOST;
          const uperdate = '2025-08-12T18:30:00.000Z'
          const lowerdate = '2023-08-12T18:30:00.000Z'
          const apiURL = `${apiHost}/api/attendance/${lowerdate}/${uperdate}`;
          const response = await fetch(apiURL, {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token") || "",
            },
          });
          if (response.ok) {
            const rawData = await response.json();
            console.log("Fetched data:", rawData);
            console.log("previous 10 date data ", last10Days)
            const updatedStaff = rawData.data.staff.map((staffMember) => {
                const attendance = last10Days.map((date, index) => {
                    const isChecked = staffMember.checked_dates.includes(date);
                    return {
                        date,
                        checked: isChecked,
                        disabled: !isChecked
                    };
                });
                return { ...staffMember, attendance }; // Ensure the structure matches what is expected by the table
            });

            
            console.log("updated staff data", updatedStaff)
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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
                        // onChange={(e) => handleCheckboxChange(record.key, i, e.target.checked)}
                    />
                </Tooltip>
            ),
        })),
    ];

    return (
        <div className="attendance-container">
            <Card title="Staff Attendance" className="attendance-card">
                <Form>
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
