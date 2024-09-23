import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import * as XLSX from "xlsx";
import TableView from "./TableView";
import { pageSize } from "../pages/constants";
import axios from "axios";

const ApplicantsView = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("student_apply_course_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [offset, setOffset] = useState(0);

  const token = localStorage.getItem("token") || "";
  const { examId } = useParams(); // Use useParams to get examId from the route

  const fetchData = async (offset, limit) => {
    setLoading(true);
    const apiHost = process.env.REACT_APP_API_HOST;

    let apiUrl = `${apiHost}/api/courses/registrations/${examId}?limit=${limit}&offset=${offset}`;
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
      response.data.data.registrations &&
      response.data.data.registrations.length > 0
    ) {
      response.data.data.registrations.map((data) => {
        data.updated_at =
          new Date(data.updated_at).getDate() +
          "/" +
          new Date(data.updated_at).getMonth() +
          "/" +
          new Date(data.updated_at).getFullYear();
        data.email = data.student.email;
        data.name = data.student.first_name + " " + data.student.last_name;
      });
      setTotalApplicantsCount(response.data.data.totalCount);
      setApplicants(response.data.data.registrations);
    } else {
      setApplicants([]);
    }

    setLoading(false);
  };

  const fetchAllApplicantsData = async () => {
    setLoading(true);

    const limit = 10000;
    const offset = 0;
    const apiHost = process.env.REACT_APP_API_HOST;
    let apiUrl = `${apiHost}/api/download/courses/registrations/${examId}?limit=${limit}&offset=${offset}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (
        data.data &&
        data.data.registrations &&
        data.data.registrations.length > 0
      ) {
        data.data.registrations.map((data) => {
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
          data.email = data.email;
        });
        setLoading(false);
        return data.data.registrations;
      }
    }
    setLoading(false);
    return null;
  };

  const handleApplicantsSearchChange = async (value) => {
    setSearchKey(value);
  };

  useEffect(() => {
    fetchData(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, totalApplicantsCount, examId]);

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

  const exportDataToExcel = async () => {
    const data = await fetchAllApplicantsData();
    exportToExcel(data, "Applicants");
  };

  const columns = [
    /* {
      title: "RegistrationId",
      dataIndex: "student_apply_course_id",
      key: "student_apply_course_id",
      sorter: true,
    }, */
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Applied On",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: true,
    },
  ];

  return (
    <div className="main-container">
      <Space style={{ marginTop: 20, marginRight: 20, float: "right" }}>
        <Search
          style={{ marginTop: 0, marginLeft: 10 }}
          placeholder="Search applicants"
          enterButton
          onChange={(e) => handleApplicantsSearchChange(e.target.value)}
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

export default ApplicantsView;
