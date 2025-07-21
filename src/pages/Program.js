import React, { useState, useEffect } from "react";
import { Input, Button, Space, message, Form, Modal } from "antd";
import AddProgramForm from "../components/AddProgramForm"; // Make sure the path is correct
import { EditOutlined, DeleteOutlined, PlusOutlined, DatabaseOutlined } from "@ant-design/icons";
import { post, deleteData } from "../global/api";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import { debounce } from "lodash";
import "../css/Teacher.css"; // Import the CSS file
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Program = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [form] = Form.useForm();
  const [sortField, setSortField] = useState("program_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalProgramsCount, setTotalProgramsCount] = useState(0);
  const [programs, setPrograms] = useState([]);
  console.log("🚀 ~ Program ~ programs:", programs);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});

  const navigate = useNavigate();

  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  // Define columns for the table
  const columns = [
    {
      title: "Program Name",
      dataIndex: "program_name",
      key: "program_name",
      sorter: true,
    },
    {
      title: "File",
      dataIndex: "file_url",
      key: "file_url",
      sorter: true,
      render: (fileUrl) => {
        if (!fileUrl) return "-";
        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
            Download
          </a>
        );
      },
    },
    {
      title: "Program Description",
      dataIndex: "program_description",
      key: "program_description",
      sorter: true,
    },
    {
      title: "Program Starting Date",
      dataIndex: "program_starting_date",
      key: "program_starting_date",
      sorter: true,
    },
    {
      title: "Program Ending Date",
      dataIndex: "program_ending_date",
      key: "program_ending_date",
      sorter: true,
    },
    {
      title: "Program Location",
      dataIndex: "program_location",
      key: "program_location",
      sorter: true,
    },
    {
      title: "Registration Starting Date",
      dataIndex: "registration_starting_date",
      key: "registration_starting_date",
      sorter: true,
    },
    {
      title: "Registration Ending Date",
      dataIndex: "registration_closing_date",
      key: "registration_closing_date",
      sorter: true,
    },
    {
      title: "Created Date",
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
              icon={<EditOutlined />}
              onClick={() => editProgram(record)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
            <Button
              type="primary"
              icon={<DatabaseOutlined />}
              onClick={() => navigate(`/applicants/programs/${record.program_id}`)}
            >
              View Applicants
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleProgramSearchChange = async (value) => {
    value = value.length > 0 ? value : null;
    fetchData(0, pageSize, sortField, sortOrder, value);
  };

  // Debounce search key handler
  const debouncedSearchHandler = debounce(handleProgramSearchChange, 500);

  const handleAddOrEditProgram = async (program) => {
    if (isEdit && !program.program_id) {
      console.error("Error: No ID provided for the program to edit");
      message.error("No program ID provided for editing.");
      return;
    }
    setLoading(true);
    const endpoint = isEdit
      ? `/api/programs/${program.program_id}`
      : "/api/programs";

    program.is_program_active = true;

    const res = await post(endpoint, program);
    if (res.status === 200) {
      fetchData(0, pageSize);
      message.success(`Program ${isEdit ? "updated" : "added"} successfully.`);
      setIsModalVisible(false);
    } else {
      message.error(`${res.message}`);
    }
    setLoading(false);
  };

  const addProgram = () => {
    setCurrentProgram(null); // No current program when adding new
    setIsModalVisible(true);
    setIsEdit(false);
  };

  const editProgram = (program) => {
    console.log("🚀 ~ editProgram ~ program:", program);
    setCurrentProgram(program); // Set current program to edit
    setIsModalVisible(true);
    setIsEdit(true);
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };

  const deleteProgram = async () => {
    const endpoint = `/api/programs/${dataToDelete.program_id}`;
    const res = await deleteData(endpoint, dataToDelete);
    if (res.status === 200) {
      fetchData(offset, pageSize);
    } else {
      message.error(res.message);
    }
    setDeleteModalVisibility(false);
    setDataToDelete({});
  };

  const { Search } = Input;

  const fetchData = async (
    offset,
    limit,
    sortField = "program_id",
    sortOrder = "asc",
    searchKey = null
  ) => {
    console.log("🚀 ~ fetchData ~ offset:", offset);
    setLoading(true);
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl = `${apiHost}/api/programs?limit=${limit}&offset=${offset}`;
      if (searchKey && searchKey.length > 0) {
        apiUrl = apiUrl + `&searchKey=${searchKey}`;
      }

      if (sortField) {
        apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      });
      if (response.ok) {
        const rawData = await response.json();
        if (
          rawData.data &&
          rawData.data.programs &&
          rawData.data.programs.length > 0
        ) {
          rawData.data.programs.map((program) => {
            program.created_at = moment(program.created_at).format(
              "DD-MM-YYYY"
            );
            program.registration_starting_date = moment(
              program.registration_starting_date
            ).format("DD-MM-YYYY");
            program.registration_closing_date = moment(
              program.registration_closing_date
            ).format("DD-MM-YYYY");
            program.program_starting_date = moment(
              program.program_starting_date
            ).format("DD-MM-YYYY");
            program.program_ending_date = moment(
              program.program_ending_date
            ).format("DD-MM-YYYY");
            return program;
          });
          setPrograms(rawData.data.programs);
          setTotalProgramsCount(rawData.data.totalCount);
        } else {
          setPrograms([]);
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      message.error(`Failed to load data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, pageSize);
  }, []); // Only fetch when searchKey changes after debounce

  return (
    <div className="main-container">
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteProgram}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>

      <Space style={{ marginBottom: 16 }}>
        <Search
          className="search-class"
          placeholder="Search exams"
          enterButton
          onChange={(e) => debouncedSearchHandler(e.target.value)}
        />
      </Space>
      <Button
        className="button-class"
        type="primary"
        block
        icon={<PlusOutlined />}
        onClick={addProgram}
      >
        Add Program
      </Button>
      <div className="table-container">
        <TableView
          data={programs}
          columns={columns}
          loading={loading}
          currentPage={currentPage}
          totalCount={totalProgramsCount}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
          setOffset={setOffset}
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
        />
      </div>
      <AddProgramForm
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddOrEditProgram}
        initialData={currentProgram}
      />
    </div>
  );
};

export default Program;
