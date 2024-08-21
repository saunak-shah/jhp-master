import React from 'react';
import { List, Card, Typography } from 'antd';

const { Title } = Typography;

const data = [
  { month: 'Total Guruji', attendance: 24 },
  { month: 'Total Students', attendance: 21 },
  { month: 'Student count for teacher', attendance: 19 },
  { month: 'Top 5 small age student count', attendance: 22 },
  { month: 'Top 5 max age student countrch', attendance: 20 },
  { month: '1 to 10 age student', attendance: 18 },
  { month: '11 to 20 age student', attendance: 18 },
];

const Home = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <Title level={2}>Dashboard</Title>
    <List
      grid={{ gutter: 16, column: 2 }}
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Card 
            title={item.month}
            bordered={true}
            style={{ textAlign: 'center' }}
          >
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Attendance: {item.attendance}</p>
            <p style={{ color: 'gray' }}>Notes: Regular attendance with minor absences.</p>
          </Card>
        </List.Item>
      )}
    />
  </div>
);

export default Home;
