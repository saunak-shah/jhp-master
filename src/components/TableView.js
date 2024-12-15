import { Card, Table } from "antd";
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
    const newSortField = sorter.field;
    const newSortOrder = sorter.order === "ascend" ? "asc" : "desc";
    // Update state
    setSortField(newSortField);
    setSortOrder(newSortOrder);

    const newOffset = (pagination.current - 1) * pagination.pageSize;
    setOffset(newOffset);
    setCurrentPage(pagination.current);

    // Pass the newSortField and newSortOrder directly to fetchData
    fetchData(newOffset, pagination.pageSize, newSortField, newSortOrder);
  };

  return (
    <Card>
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
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items`, // Custom message for total count
        }}
        scroll={{
          y: 600, // Set a fixed height for vertical scrolling
          x: "max-content", // Enable horizontal scrolling for wide columns
        }}
      />
    </Card>
  );
}

export default TableView;
