import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import axios from 'axios';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ArcElement, Tooltip, and Legend for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [data, setData] = useState([
    { month: 'Total Teachers', attendance: 23, icon: <UserOutlined /> },
    { month: 'Total Students', attendance: 637, icon: <TeamOutlined /> },
  ]);

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        // text: 'Chart Data',
      },
    },
  };

  const lineData = {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Growth of Pathshala',
        data: [100, 140, 170, 225, 300, 350, 372, 428, 535, 637],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const barData1 = {
    labels: ['Khushbuben', 'Pinaben', 'Rekhaben', 'Tirth', 'Arhat'],
    datasets: [
      {
        label: 'Students Assigned to Teacher',
        data: [130, 80, 40, 30, 25],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const teacherCount = axios.get('/api/teachercount');
        const studentCount = axios.get('/api/studentcount');
        const [teachers, students] = await Promise.all([teacherCount, studentCount]);

        setData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [teachers.data.count, students.data.count] // Example of how to integrate fetched data
          }]
        }));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div style={{ margin: '30px' }}>
      {/* <h1>Dashboard</h1> */}

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <Card title={<div>Total Teachers</div>}
            bordered={true}
            hoverable
            style={{ textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>23</p>
            <p style={{ color: 'gray' }}>Notes: A total of 23 Guruji's are currently teaching students in the Pathshala.</p>
          </Card>
        </div>
        <div style={{ flex: 1, marginLeft: '20px', marginTop: '10px' }}>
          <Card title={<div>Total Students</div>}
            bordered={true}
            hoverable
            style={{ textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>637</p>
            <p style={{ color: 'gray' }}>Notes: A total of 637 Students are currently studying in the Pathshala.</p>
          </Card>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <Card title={<div>Pathshala Growth</div>}
            bordered={true}
            hoverable
            style={{ textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Line data={lineData} options={{ ...commonOptions, title: { ...commonOptions.title, text: 'Pathsala Growth' } }} />

          </Card>
        </div>
        <div style={{ flex: 1, marginLeft: '20px', marginTop: '10px' }}>
          <Card title={<div>Teacher Class Data</div>}
            bordered={true}
            hoverable
            style={{ textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Bar data={barData1} options={{ ...commonOptions, title: { ...commonOptions.title, text: 'Teacher Assignments' } }} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
