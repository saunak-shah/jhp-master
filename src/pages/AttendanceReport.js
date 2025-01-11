/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, DatePicker, message, Space } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import { post } from "../global/api";
import moment from "moment";
import { pageSize } from "./constants";
import TableView from "../components/TableView";
import * as XLSX from "xlsx";
import FormItemLabel from "antd/es/form/FormItemLabel";
import dayjs from 'dayjs';

const AttendanceView = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [sortField, setSortField] = useState("attendance_count");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAttedanceCount, setTotalAttedanceCount] = useState(0);
  const [searchKey, setSearchKey] = useState(null);

  const defaultFromDate = moment().startOf("month").format('YYYY-MM-DD');
  const defaultToDate = moment().endOf('day').format('YYYY-MM-DD');
  
  const [lowerDateLimit, setLowerDateLimit] = useState(defaultFromDate);
  const [upperDateLimit, setUpperDateLimit] = useState(defaultToDate);

  const fetchData = async (
    offset,
    limit,
    sortField,
    sortOrder,
    searchKey = null,
    lowerDateLimit = null,
    upperDateLimit = null
  ) => {
    try {
      setLoading(true);

      let apiUrl = `/api/attendance_report?limit=${limit}&offset=${offset}`;
      if (searchKey && searchKey.length > 0) {
        apiUrl = apiUrl + `&searchKey=${searchKey}`;
      }

      if (sortField) {
        apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
      }

      if (lowerDateLimit) {
        apiUrl = apiUrl + `&lowerDateLimit=${lowerDateLimit}`;
      }

      if (upperDateLimit) {
        apiUrl = apiUrl + `&upperDateLimit=${upperDateLimit}`;
      }
      let date = moment().format();

      let reqObj = {
        limit: 20,
        offset: 0,
        date,
      };
      const response = await post(apiUrl, reqObj);

      if (
        response.data &&
        response.data.attendance &&
        response.data.attendance.length > 0
      ) {
        setTotalAttedanceCount(response.data.totalCount);
        setApplicants(response.data.attendance);
      } else {
        setApplicants([]);
        setTotalAttedanceCount(0);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicantsSearchChange = async (value) => {
    setSearchKey(value);
    await fetchData(0, pageSize, sortField, sortOrder, value, lowerDateLimit, upperDateLimit);
  };

  useEffect(() => {
    fetchData(offset, pageSize);
  }, []);

  const fetchAllAttendanceData = async () => {
    setLoading(true);

    const limit = 10000;
    const offset = 0;
    try {
      setLoading(true);

      let apiUrl = `/api/attendance_report?limit=${limit}&offset=${offset}`;
      if (lowerDateLimit) {
        apiUrl = apiUrl + `&lowerDateLimit=${lowerDateLimit}`;
      }

      if (upperDateLimit) {
        apiUrl = apiUrl + `&upperDateLimit=${upperDateLimit}`;
      }
      let date = moment().format();
      let reqObj = {
        limit: 20,
        offset: 0,
        date,
      };
      const response = await post(apiUrl, reqObj);

      if (!response.data || !response.data.attendance) {
        throw new Error(`Unable to fetch attendance`);
      }

      return response.data.attendance;
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }

    return null;
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportDataToExcel = async () => {
    const data = await fetchAllAttendanceData();
    exportToExcel(data, "Monthly_Attendance");
  };

  const handleFromDateChange = async (date, dateString) => {
    if (!date) {
      setLowerDateLimit(null);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, null, upperDateLimit);
      return;
    }

    if (upperDateLimit && date > upperDateLimit) {
      message.error('From date should be smaller than to date');
      setLowerDateLimit(lowerDateLimit); 
    } else {
      const fromDate = moment(dateString).format("YYYY-MM-DD");
      setLowerDateLimit(fromDate);

      await fetchData(0, pageSize, sortField, sortOrder, searchKey, fromDate, upperDateLimit);
    }
  };

  const handleToDateChange = async (date, dateString) => {
    if (!date) {
      setUpperDateLimit(null);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, lowerDateLimit, null);
      return;
    }

    if (lowerDateLimit && date < lowerDateLimit) {
      message.error('To date should be greater than from date');
      setUpperDateLimit(upperDateLimit);
    } else {
      const toDate = moment(dateString).format("YYYY-MM-DD");
      setUpperDateLimit(toDate);
      // setUpperDateLimit(date);
      await fetchData(0, pageSize, sortField, sortOrder, searchKey, lowerDateLimit, toDate);
    }

  };


  const columns = [
    { title: "Name", dataIndex: "full_name", key: "full_name" },
    {
      title: "Attendance Count",
      dataIndex: "attendance_count",
      key: "attendance_count",
      sorter: true,
    },
  ];

  return (
    <div>
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

      <Space style={{ marginTop: 20, marginRight: 20 }}>
        <Search
          style={{ marginTop: 0, marginLeft: 10 }}
          placeholder="Search applicants"
          enterButton
          onChange={(e) => handleApplicantsSearchChange(e.target.value)}
        />
      </Space>
      <Space style={{ float: "right" }}>
        <Space>
          <FormItemLabel label="From" />
          <DatePicker
          style={{}}
          placeholder="Select from date"
          defaultValue={defaultFromDate}
          value={dayjs(lowerDateLimit)}
          allowClear={true}
          onChange={handleFromDateChange}
        />
        </Space>
        <Space style={{ marginLeft: 10 }}>
          <FormItemLabel label="To" />

          <DatePicker
          style={{}}
          placeholder="Select to date"
          defaultValue={defaultToDate}
          value={dayjs(upperDateLimit)}
          allowClear={true}
          onChange={handleToDateChange}
        />
        </Space>
        <Button
          type="primary"
          style={{
            margin: "20px",
            float: "right",
          }}
          onClick={() => exportDataToExcel()}
          icon={<DownloadOutlined />}
        >
          Export To Excel
        </Button>
      </Space>

      <TableView
        style={{
          margin: "20px",
        }}
        data={applicants}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalCount={totalAttedanceCount}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        setOffset={setOffset}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
    </div>
  );
};

export default AttendanceView;
