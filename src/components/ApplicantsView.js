import React, { useEffect, useState } from "react";
import { Button, Space, Modal, Input, message, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import {
  DownloadOutlined,
  EditOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import * as XLSX from "xlsx";
import TableView from "./TableView";
import { pageSize } from "../pages/constants";
import axios from "axios";
import { post } from "../global/api";

const ApplicantsView = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("student_apply_course_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isUpdateModelVisible, setUpdateModelVisibility] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [scoreToUpdate, setScoreToUpdate] = useState(0);
  
  const token = localStorage.getItem("token") || "";
  const { examId } = useParams(); // Use useParams to get examId from the route

  const fetchData = async (
    offset,
    limit,
    sortField = "student_apply_course_id",
    sortOrder = "asc",
    searchKey = null
  ) => {
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
        data.created_at =
          new Date(data.created_at).getDate() +
          "/" +
          new Date(data.created_at).getMonth() +
          "/" +
          new Date(data.created_at).getFullYear();
        data.email = data.student.email;
        data.name = data.student.first_name + " " + data.student.last_name;
        data.score =
          data.result.length > 0 && data.result[0].score
            ? data.result[0].score
            : "Not Available";
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

          data.created_at =
            new Date(data.created_at).getDate() +
            "/" +
            new Date(data.created_at).getMonth() +
            "/" +
            new Date(data.created_at).getFullYear();
          data.email = data.email;
          data.exam_status = "Not available";
          const score = data?.score;
          const passingScore = data?.passing_score;
            if (score >= passingScore) {
              data.exam_status = "Pass";
            } else {
              data.exam_status = "Fail";
            }
          });
        setLoading(false);
        return data.data.registrations;
      }
    }
    setLoading(false);
    return null;
  };

  const handleApplicantsSearchChange = async (value) => {
    value = value.length > 0 ? value : null;
    fetchData(offset, pageSize, sortField, sortOrder, value);
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

  const exportDataToExcel = async () => {
    const data = await fetchAllApplicantsData();
    exportToExcel(data, "Applicants");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Applied On",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    {
      title: "Result",
      dataIndex: "score",
      key: "score",
      sorter: true,
    },
    {
      title: "Total marks",
      dataIndex: "course_passing_score",
      key: "course_passing_score",
      sorter: true,
      render: (_, record) => record.result[0]?.course_passing_score ?? "-",
    },
    {
      title: "Course Score",
      dataIndex: "course_score",
      key: "course_score",
      sorter: true,
      render: (_, record) => record.result[0]?.course_score ?? "-",
    },
    {
      title: "Status",
      dataIndex: "exam_status",
      key: "exam_status",
      sorter: true,
      render: (_, record) => {
        const score = record.result[0]?.score;
        const passingScore = record.result[0]?.course_passing_score;
    
        if (score == null) {
          return <Tag color="default">Not available</Tag>;
        } else if (score >= passingScore) {
          return <Tag color="green">Pass</Tag>;
        } else {
          return <Tag color="red">Fail</Tag>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record)}
            >
              Update Result
            </Button>
          </Space>
        );
      },
    },
  ];
  const handleUpdateCancel = () => {
    setUpdateModelVisibility(false);
    setDataToUpdate("");
  };

  const handleUpdate = (record) => {
    setUpdateModelVisibility(true);
    setDataToUpdate(record);
    setScoreToUpdate(record.score);
  };

  const handleUpdateScoreChange = (value) => {
    // Allow user to input raw numbers without immediate conversion
    if (!isNaN(value) && value.trim() !== "") {
      setScoreToUpdate(value); // Store as string
    } else {
      setScoreToUpdate(""); // Reset if invalid
    }
  };

  const updateStudentScore = async () => {
    setLoading(true);

    const data = {
      student_apply_course_id: dataToUpdate.student_apply_course_id,
      score: parseFloat(scoreToUpdate),
    };

    const endpoint = `/api/result`;
    const res = await post(endpoint, {
      data,
    });

    if (res.status === 200) {
      fetchData(0, pageSize);
      message.success(`Score updated successfully.`);
      setUpdateModelVisibility(false);
      setDataToUpdate({});
      setScoreToUpdate(0);
    } else {
      message.error(`${res.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="main-container">
      <Modal
        title="Confirm Updation"
        open={isUpdateModelVisible}
        onOk={updateStudentScore}
        onCancel={handleUpdateCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <p> Enter new score: </p>
        <Input
          type="number"
          value={scoreToUpdate}
          onChange={(e) => handleUpdateScoreChange(e.target.value)}
        ></Input>
      </Modal>
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
