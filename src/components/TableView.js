// HomePage.js
import { Table } from "antd";
import React from "react";
import { pageSize } from "../pages/constants";

function TableView({
  data,
  columns,
  loading,
  currentPage,
  totalCount,
  setSortField,
  setSortOrder,
  setOffset,
  setCurrentPage,
  fetchData,
}) {
  const handleChange = (pagination, filters, sorter) => {
    // Update sortField and sortOrder based on sorter
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }

    const newOffset = (pagination.current - 1) * pagination.pageSize;
    setOffset(newOffset);
    setCurrentPage(pagination.current);
    fetchData(newOffset, pagination.pageSize);
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      bordered={true}
      onChange={handleChange}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalCount,
      }}
    />
  );
}

export default TableView;
