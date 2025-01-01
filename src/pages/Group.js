import React, { useEffect, useState } from "react";
import { Input, Space, Button, Select, Modal, Form, message } from "antd";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import '../css/Teacher.css'; // Import the CSS file
import { deleteData } from "../global/api";
import { post } from "../global/api";
import AddGroup from "../components/AddGroup";

const { Option } = Select;

const Group = observer(() => {
  const { Search } = Input;
  const [sortField, setSortField] = useState("group_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalGroupsCount, setTotalGroupsCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const master_role_id = localStorage.getItem("master_role_id");
  const [isEdit, setIsEdit] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);


  const [form] = Form.useForm();
  
  const handleDeleteCancel = () => {
    setDeleteModalVisibility(false);
    setDataToDelete("");
  };

  const handleAddOrEditGroup = async (group) => {
    if (isEdit && !group.group_id) {
      console.error("Error: No ID provided for the group to edit");
      message.error("No group ID provided for editing.");
      return;
    }

    setLoading(true);
    const endpoint = isEdit
      ? `/api/group/${group.group_id}`
      : "/api/group";

    const res = await post(endpoint, group);
    if (res.status === 200) {
      fetchData(0, pageSize);
      message.success(`Group ${isEdit ? "updated" : "added"} successfully.`);
      setIsModalVisible(false);
    } else {
      message.error(`${res.message}`);
    }
    setLoading(false);
  };

  const addGroup = async () => {
    setCurrentGroup(null); // No current group when adding new
    setIsModalVisible(true);
    setIsEdit(false);
    // teachers api call
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      const limit = 100;
      let apiUrl = `${apiHost}/api/teachers?limit=${limit}&offset=${offset}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      };
      const response = await axios.get(apiUrl, { headers });
      if (response.data && response.data.data) {
        // setTotalUserCount(response.data.data.totalCount);
        setTeachers(response.data.data.teachers);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.log("There is some error", error);
    }

  };

  const editGroup = async(group) => {
    setCurrentGroup(group); // Set current group to edit
    setIsModalVisible(true);
    setIsEdit(true);

    // teachers api call
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      const limit = 100;
      let apiUrl = `${apiHost}/api/teachers?limit=${limit}&offset=${offset}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      };
      const response = await axios.get(apiUrl, { headers });
      if (response.data && response.data.data) {
        // setTotalUserCount(response.data.data.totalCount);
        setTeachers(response.data.data.teachers);
      } else {
        setTeachers([]);
      }
    } catch (error) {
      console.log("There is some error", error);
    }
  };

  const handleDelete = (record) => {
    setDeleteModalVisibility(true);
    setDataToDelete(record);
  };

  const deleteGroup = async () => {
    const endpoint = `/api/group/${dataToDelete.group_id}`;
    await deleteData(endpoint, dataToDelete);
    setDeleteModalVisibility(false);
    setDataToDelete({});
    fetchData(offset, pageSize);
  };

  const columns = [
    {
      title: "Group Name",
      dataIndex: "group_name",
      key: "group_name",
      sorter: true,
    },
    {
      title: "Teachers",
      dataIndex: "teacher_names",
      key: "teacher_names",
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return Number(master_role_id) !== 2 ? (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => editGroup(record)}
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
          </Space>
        ) : null; // Return null if no actions should be shown
      },
    },
  ];
  
  const fetchData = async (
    offset,
    limit,
    sortField = "group_name",
    sortOrder = "asc",
    searchKey = null
  ) => {
    setLoading(true);
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      let apiUrl = `${apiHost}/api/group?limit=${limit}&offset=${offset}`;
      
      // Append filters if searchKey is present
      if (searchKey) {
        apiUrl += `&searchKey=${encodeURIComponent(searchKey)}`;
      }
      // Append sorting parameters
      if (sortField) {
        apiUrl += `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      };
      const response = await axios.get(apiUrl, { headers });
      if (response.data && response.data.data) {
        setTotalGroupsCount(response.data.data.totalCount);
        setGroups(response.data.data.groups);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-container">
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={deleteGroup}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
      <Space style={{ marginBottom: 16 }}>
        <Search
          className="search-class"
          placeholder="Search Group"
          enterButton
          // onChange={(e) => debouncedSearchHandler(e.target.value)}
        />
      </Space>
      {master_role_id != 2 ? (
        <Button className="button-class"
        type="primary"
        block
        icon={<PlusOutlined />}
        onClick={addGroup}
      >
        Add Group
      </Button>
      ) : ''}
      
      <div className="table-container">
      <TableView
        data={groups}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalCount={totalGroupsCount}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setOffset={setOffset}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
      </div>
      <AddGroup
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddOrEditGroup}
        initialData={currentGroup}
        teachers={teachers}
      />
    </div>
  );
});
export default Group;
