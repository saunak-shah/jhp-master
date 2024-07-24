import React, { useState, useEffect } from 'react';
import { Form, Table, Checkbox, Button, Card, Tooltip } from 'antd';
import moment from 'moment';

const StaffAttendance = () => {
    const [data, setData] = useState([
        {
            key: '1',
            name: 'John Doe',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '2',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '3',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '4',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '5',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '6',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '7',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '8',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '9',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        {
            key: '10',
            name: 'Jane Smith',
            attendance: Array(10).fill({ checked: false, disabled: false }),
        },
        // Add more data as needed
    ]);

    const last10Days = Array.from({ length: 10 }, (_, i) =>
        moment().subtract(9 - i, 'days').format('M/D/YYYY')
    );

    // Simulate API response
    const apiResponse = {
        staff: [
            {
                key: '1',
                checked_dates: ['6/3/2024', '6/2/2024', '6/2/2024'],
            },
            {
                key: '2',
                checked_dates: ['6/3/2024', '6/1/2024'],
            },
        ],
    };

    useEffect(() => {
        // Update state based on API response
        setData((prevData) =>
            prevData.map((staff) => {
                const responseStaff = apiResponse.staff.find((s) => s.key === staff.key);
                if (responseStaff) {
                    return {
                        ...staff,
                        attendance: last10Days.map((date) => ({
                            checked: responseStaff.checked_dates.includes(date),
                            disabled: responseStaff.checked_dates.includes(date),
                        })),
                    };
                }
                return staff;
            })
        );
    }, []);

    const handleCheckboxChange = (key, index, checked) => {
        setData((prevData) =>
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

    const onFinish = () => {
        const payload = {
            staff: data.map((staff) => ({
                key: staff.key,
                checked_dates: staff.attendance
                    .map((att, idx) => (att.checked ? last10Days[idx] : null))
                    .filter((date) => date !== null),
            })),
        };
        console.log('Payload:', payload);
        // Make an API request or handle the payload as needed
    };

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
                        onChange={(e) => handleCheckboxChange(record.key, i, e.target.checked)}
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
                        dataSource={data}
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
