import React, { useEffect, useState } from "react";
import { Button, Space, Modal, Input, message, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import {
  DeleteOutlined,
  DownloadOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import * as XLSX from "xlsx";
import TableView from "./TableView";
import { pageSize } from "../pages/constants";
import axios from "axios";
import { deleteData } from "../global/api";

const ProgramApplicantsView = () => {
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("student_apply_program_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});

  const token = localStorage.getItem("token") || "";
  const { programId } = useParams(); // Use useParams to get programId from the route

  const fetchData = async (
    offset,
    limit,
    sortField = "student_apply_program_id",
    sortOrder = "asc",
    searchKey = null
  ) => {
    setLoading(true);
    const apiHost = process.env.REACT_APP_API_HOST;
    let apiUrl = `${apiHost}/api/registrations/programs/${programId}?limit=${limit}&offset=${offset}`;
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
        const createdAtDate = new Date(data.created_at);
        data.created_at =
          createdAtDate.getDate() +
          "/" +
          (createdAtDate.getMonth() + 1) + // <-- Add +1 here
          "/" +
          createdAtDate.getFullYear();

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
    let apiUrl = `${apiHost}/api/download/programs/registrations/${programId}?limit=${limit}&offset=${offset}`;

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
          const createdAtDate = new Date(data.created_at);
          data.created_at =
            createdAtDate.getDate() +
            "/" +
            (createdAtDate.getMonth() + 1) + // <-- Add +1 here
            "/" +
            createdAtDate.getFullYear();

          data.email = data.email;
        });
        setLoading(false);
        return data.data.registrations;
      }
    }
    setLoading(false);
    return null;
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };


  const deleteApplicant = async () => {
    const applicantId = dataToDelete.reg_id;
    const endpoint = `/api/programs/registration/${applicantId}`;
    const res = await deleteData(endpoint, dataToDelete);
    if(res.status === 200){
      fetchData(offset, pageSize);
    } else{
      message.error(res.message);
    }
    setDeleteModalVisibility(false);
    setDataToDelete({});
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
    if (!data) {
      message.error("No data to export.");
      return;
    }
    exportToExcel(data, "Applicants");
  };

  const columns = [
    {
      title: "Reg Id",
      dataIndex: "reg_id",
      key: "reg_id",
      sorter: true,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Applied On",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Space>

            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  return (
    <div className="main-container">
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteApplicant}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this record?</p>
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

export default ProgramApplicantsView;
