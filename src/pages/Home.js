import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import axios from 'axios';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Home = () => {
  const [data, setData] = useState([
    { month: 'Total Teachers', attendance: 0, icon: <UserOutlined /> },
    { month: 'Total Students', attendance: 0, icon: <TeamOutlined /> },
    { month: 'Student count for teacher', attendance: 19 },
    { month: 'Top 5 small age student count', attendance: 22 },
    { month: 'Top 5 max age student count', attendance: 20 },
    { month: '1 to 10 age student', attendance: 18 },
    { month: '11 to 20 age student', attendance: 18 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const teacherCount = axios.get('/api/teachercount');
        const studentCount = axios.get('/api/studentcount');
        const [teachers, students] = await Promise.all([teacherCount, studentCount]);
        
        setData([
          { month: 'Total Teachers', attendance: teachers.data.count, icon: <UserOutlined /> },
          { month: 'Total Students', attendance: students.data.count, icon: <TeamOutlined /> }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
        setLoading(false);
        // Optionally set an error state and show an error message
      }
    };

    fetchCounts();
  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>Dashboard</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card 
                title={<div>{item.icon} {item.month}</div>}
                bordered={true}
                hoverable
                style={{ textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              >
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{item.attendance}</p>
                <p style={{ color: 'gray' }}>Notes: Regular attendance with minor absences.</p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Home;
