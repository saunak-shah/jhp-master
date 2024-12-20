import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import axios from 'axios';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import "../css/Home.css"; // Import the CSS file


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
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  const token = localStorage.getItem("token");

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
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
        const apiHost = process.env.REACT_APP_API_HOST;
        let headers = {
          "Content-Type": "application/json",
          Authorization: token,
        };
        let apiUrl = `${apiHost}/api/dashboard/teachers/count`;
        let studentapiUrl = `${apiHost}/api/dashboard/students/count`;
        
        const teacherCount = axios.get(apiUrl, { headers });
        const studentCount = axios.get(`${studentapiUrl}`, { headers });

        const [teachers, students] = await Promise.all([teacherCount, studentCount]);
        setStudentCount(students.data?.data.totalCount)
        setTeacherCount(teachers.data?.data.totalCount)
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
      <div className="container">
        <div className="card">
          <Card title={<div>Total Teachers</div>} bordered={true} hoverable>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{teacherCount}</p>
            <p style={{ color: 'gray' }}>
              Notes: A total of {teacherCount} Guruji's are currently teaching students in
              the Pathshala.
            </p>
          </Card>
        </div>
        <div className="card">
          <Card title={<div>Total Students</div>} bordered={true} hoverable>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{studentCount}</p>
            <p style={{ color: 'gray' }}>
              Notes: A total of {studentCount} Students are currently studying in the
              Pathshala.
            </p>
          </Card>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <Card title={<div>Pathshala Growth</div>} bordered={true} hoverable>
            <Line
              data={lineData}
              options={{ ...commonOptions, title: { ...commonOptions.title, text: 'Pathsala Growth' } }}
            />
          </Card>
        </div>

        <div className="card">
          <Card
            title={<div>Number of Students for Each Teacher</div>}
            bordered={true}
            hoverable
          >
            <Bar
              data={barData1}
              options={{ ...commonOptions, title: { ...commonOptions.title, text: 'Teacher Assignments' } }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
