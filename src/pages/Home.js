import React, { useState, useEffect } from "react";
import { Card, DatePicker, message } from "antd";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../css/Home.css";
import moment from "moment";
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Home = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);

  const [studentAssigneeCount, setStudentAssigneeCount] = useState([]);
  const [assignedTeacherNames, setAssignedTeacherNames] = useState([]);

  const [studentAttendanceCount, setStudentAttendanceCount] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState([]);

  const [studentAgeGroupCount, setStudentAgeGroupCount] = useState([]);
  const [ageGroupData, setAgeGroupData] = useState([]);

  const [studentGenderCount, setStudentGenderCount] = useState([]);
  const [genderGroup, setGenderGroup] = useState([]);

  const defaultEndDate = moment();
  const defaultStartDate = moment().subtract(6, "day");
  const [lowerDateLimit, setLowerDateLimit] = useState(defaultStartDate);
  const [upperDateLimit, setUpperDateLimit] = useState(defaultEndDate);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
      datalabels: {
        anchor: "end",
        align: "start",
        color: "#000",
        formatter: (value) => value,
      },
    },
  };

  const lineData = {
    labels: [
      "2015", "2016", "2017", "2018", "2019",
      "2020", "2021", "2022", "2023", "2024",
    ],
    datasets: [
      {
        label: "Growth of Pathshala",
        data: [100, 140, 170, 225, 300, 350, 372, 428, 535, 637],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const barData1 = {
    labels: assignedTeacherNames,
    datasets: [
      {
        label: "Students Assigned to Teacher",
        data: studentAssigneeCount,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const attendanceBarData = {
    labels: attendanceDate,
    datasets: [
      {
        label: "Students Attendance to Date",
        data: studentAttendanceCount,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const ageGroupBarData = {
    labels: ageGroupData,
    datasets: [
      {
        label: "Students by Age Group",
        data: studentAgeGroupCount,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const studentGenderBarData = {
    labels: genderGroup,
    datasets: [
      {
        label: "Students by Gender",
        data: studentGenderCount,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const fetchAttendanceGraphData = async () => {
    const apiHost = process.env.REACT_APP_API_HOST;
    const startStr = lowerDateLimit.format('YYYY-MM-DD');
    const endStr = upperDateLimit.format('YYYY-MM-DD');
    const apiUrl = `${apiHost}/api/attendance_report_for_graph/${startStr}/${endStr}`;

    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    try {
      const response = await axios.get(apiUrl, { headers });
      setStudentAttendanceCount(response.data.data.attendanceCount);
      setAttendanceDate(response.data.data.attendanceDate);
    } catch (error) {
      console.error("Failed to fetch attendance graph data:", error);
      message.error("Failed to load attendance chart data");
    }
  };

  useEffect(() => {
    fetchAttendanceGraphData();
  }, [lowerDateLimit, upperDateLimit]);

  useEffect(() => {
    const fetchAssigneeGraphData = async () => {
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiUrl = `${apiHost}/api/students-assign-graph-data`;
      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      try {
        const response = await axios.get(apiUrl, { headers });
        setStudentAssigneeCount(response.data.data.studentCount);
        setAssignedTeacherNames(response.data.data.teachers);
      } catch (error) {
        console.error("Failed to fetch assignee graph data:", error);
      }
    };

    const fetchStudentAgeGroupData = async () => {
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiUrl = `${apiHost}/api/students-age-group-data`;
      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      try {
        const response = await axios.get(apiUrl, { headers });
        setStudentAgeGroupCount(response.data.data.studentCount);
        setAgeGroupData(response.data.data.ageGroup);
      } catch (error) {
        console.error("Failed to fetch age group data:", error);
      }
    };

    const fetchStudentGenderGroupData = async () => {
      const apiHost = process.env.REACT_APP_API_HOST;
      const apiUrl = `${apiHost}/api/students-gender-group-data`;
      let headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      try {
        const response = await axios.get(apiUrl, { headers });
        setStudentGenderCount(response.data.data.studentCount);
        setGenderGroup(response.data.data.genderGroup);
      } catch (error) {
        console.error("Failed to fetch gender group data:", error);
      }
    };

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

        const [teachers, students] = await Promise.all([
          teacherCount,
          studentCount,
        ]);
        setStudentCount(students.data?.data.totalCount);
        setTeacherCount(teachers.data?.data.totalCount);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
        setLoading(false);
      }
    };

    fetchAssigneeGraphData();
    fetchCounts();
    fetchStudentAgeGroupData();
    fetchStudentGenderGroupData();
  }, []);

  const handleStartDateChange = (date, dateString) => {
    if (!date) return;
    if (date > upperDateLimit) {
      message.error("Start date should be less than end date");
      return;
    }
    setLowerDateLimit(date);
  };

  const handleEndDateChange = (date, dateString) => {
    if (!date) return;
    if (date < lowerDateLimit) {
      message.error("End date should be greater than start date");
      return;
    }
    setUpperDateLimit(date);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
      <div className="container">
        <div className="card">
          <Card title={<div>Total Teachers</div>} bordered={true} hoverable>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {teacherCount}
            </p>
            <p style={{ color: "gray" }}>
              Notes: A total of {teacherCount} Guruji's are currently teaching
              students in the Pathshala.
            </p>
          </Card>
        </div>
        <div className="card">
          <Card title={<div>Total Students</div>} bordered={true} hoverable>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {studentCount}
            </p>
            <p style={{ color: "gray" }}>
              Notes: A total of {studentCount} Students are currently studying
              in the Pathshala.
            </p>
          </Card>
        </div>
      </div>

      <div className="container">
        <div className="card">
          { /*<Card title={<div>Pathshala Growth</div>} bordered={true} hoverable>
            <Line
              data={lineData}
              options={{
                ...commonOptions,
                title: { ...commonOptions.title, text: "Pathsala Growth" },
              }}
            />
          </Card> */}
          <Card
            title={<div>Number of Students for Each Age Group</div>}
            bordered={true}
            hoverable
          >
            <Bar
              data={ageGroupBarData}
              options={{
                ...commonOptions,
                title: { ...commonOptions.title, text: "Age Group Data" },
              }}
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
              options={{
                ...commonOptions,
                title: { ...commonOptions.title, text: "Teacher Assignments" },
              }}
            />
          </Card>
        </div>
        </div>
        <div className="container">
        <div className="card">
          <Card
            title={<div>Number of Students for Each Gender</div>}
            bordered={true}
            hoverable
          >
            <Bar
              data={studentGenderBarData}
              options={{
                ...commonOptions,
                title: { ...commonOptions.title, text: "Students By Gender" },
              }}
            />
          </Card>
        </div>
        <div className="card">
          <Card
            title={<div>Student's attendance for Each Date</div>}
            bordered={true}
            hoverable
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                justifyContent: "center",
              }}
            >
              <DatePicker
                onChange={handleStartDateChange}
                placeholder="Start Date"
                value={dayjs(lowerDateLimit)}
                allowClear={false}
              />
              <DatePicker
                onChange={handleEndDateChange}
                placeholder="End Date"
                value={dayjs(upperDateLimit)}
                allowClear={false}
              />
            </div>
            <Line
              style={{  width: "100%" }}
              data={attendanceBarData}
              options={{
                ...commonOptions,
                responsive: true, // Makes the chart responsive
                maintainAspectRatio: true, // Allows better control over the chart dimensions
                title: { ...commonOptions.title, text: "Student's Attendance" },
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
