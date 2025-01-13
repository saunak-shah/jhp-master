import React, { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import * as XLSX from "xlsx";
import TableView from "./TableView";
import { pageSize } from "../pages/constants";
import axios from "axios";

const ResultsView = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("student_apply_course_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const token = localStorage.getItem("token") || "";
  const { examId } = useParams(); // Use useParams to get examId from the route

  const fetchData = async (offset, limit, sortField = "result_id", sortOrder = "asc", searchKey = null) => {  
    setLoading(true);
    const apiHost = process.env.REACT_APP_API_HOST;

    let apiUrl = `${apiHost}/api/courses/result/${examId}?limit=${limit}&offset=${offset}`;
    if (searchKey && searchKey.length > 0) {
      apiUrl = apiUrl + `&searchKey=${searchKey}`;
    }

    if (sortField) {
      apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
    }
    let headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    const response = await axios.get(apiUrl, { headers });

    if (
      response.data.data &&
      response.data.data.result &&
      response.data.data.result.length > 0
    ) {
      response.data.data.result.map((data) => {
        data.updated_at =
          new Date(data.updated_at).getDate() +
          "/" +
          new Date(data.updated_at).getMonth() +
          "/" +
          new Date(data.updated_at).getFullYear();
        data.email = data.student_apply_course.student.email;

        data.name =
          data.student_apply_course.student.first_name +
          " " +
          data.student_apply_course.student.last_name;
        data.course_name = data.student_apply_course.course.course_name;
      });
      setTotalApplicantsCount(response.data.data.totalCount);
      setApplicants(response.data.data.result);
    } else {
      setApplicants([]);
    }

    setLoading(false);
  };

  const fetchAllResults = async () => {
    setLoading(true);

    const limit = 10000;
    const offset = 0;
    const apiHost = process.env.REACT_APP_API_HOST;
    let apiUrl = `${apiHost}/api/download/courses/result/${examId}?limit=${limit}&offset=${offset}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.result && data.data.result.length > 0) {
        data.data.result.map((data) => {
          data.student_name =
            data.student_apply_course.student.first_name +
            " " +
            data.student_apply_course.student.last_name;
          data.course_name = data.student_apply_course.course.course_name;
          data.updated_at =
            new Date(data.updated_at).getDate() +
            "/" +
            new Date(data.updated_at).getMonth() +
            "/" +
            new Date(data.updated_at).getFullYear();

          data.created_at =
            new Date(data.created_at).getDate() +
            "/" +
            new Date(data.created_at).getMonth() +
            "/" +
            new Date(data.created_at).getFullYear();
          delete data.student_apply_course;
        });
        setLoading(false);
        return data.data.result;
      }
    }
    setLoading(false);
    return null;
  };

  const handleResultSearchChange = async (value) => {
    value = value.length > 0 ? value : null;
    fetchData(offset, pageSize, value);
  };

  useEffect(() => {
    fetchData(offset, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const isStudentPass = (record) => {
    if (record.score > record.course_passing_score) {
      return <Button type="primary">Pass</Button>;
    }
    return <Button type="" danger style={{backgroundColor: "red", color: "white"}}>Fail</Button>;
  };

  const exportDataToExcel = async () => {
    const data = await fetchAllResults();
    exportToExcel(data, "Results");
  };

  const columns = [
    { title: "Course Name", dataIndex: "course_name", key: "course_name" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Your Score", dataIndex: "score", key: "score" },
    {
      title: "Passing Score",
      dataIndex: "course_passing_score",
      key: "course_passing_score",
    },
    { title: "Course Score", dataIndex: "course_score", key: "course_score" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return <Space>{isStudentPass(record)}</Space>;
      },
    },
  ];

  return (
    <div>
      <Space style={{ marginTop: 20, marginRight: 20, float: "right" }}>
        <Search
          style={{ marginTop: 0, marginLeft: 10 }}
          placeholder="Search applicants"
          enterButton
          onChange={(e) => handleResultSearchChange(e.target.value)}
        />

        <Button
          type="primary"
          style={{
            margin: "20px",
          }}
          onClick={() => exportDataToExcel()}
          icon={<DownloadOutlined />}
        >
          Export To Excel
        </Button>
      </Space>
      <Button
        type="default"
        style={{
          margin: "20px",
        }}
        onClick={() => navigate(-1)}
        icon={<LeftOutlined />}
      >
        Back
      </Button>

      <TableView
        data={applicants}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalCount={totalApplicantsCount}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setOffset={setOffset}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
    </div>
  );
};

export default ResultsView;
