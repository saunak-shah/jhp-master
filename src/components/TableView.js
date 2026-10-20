import { Card, Table } from "antd";
import React, { useMemo } from "react";
import { pageSize } from "../pages/constants";

const estimateColumnWidth = (col) => {
  if (col.width) {
    return col.width;
  }
  if (col.key === "action" || col.dataIndex === "action") {
    return 300;
  }
  const titleLength = String(col.title ?? "").length;
  return Math.max(titleLength * 9 + 36, 120);
};

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
  searchKey,
}) {
  const scrollX = useMemo(
    () => columns.reduce((sum, col) => sum + estimateColumnWidth(col), 0),
    [columns]
  );

  const handleChange = (pagination, filters, sorter) => {
    const newSortField = sorter.field;
    const newSortOrder = (!sorter.order || sorter.order === "ascend") ? "asc" : "desc";
    setSortField(newSortField);
    setSortOrder(newSortOrder);

    const newOffset = (pagination.current - 1) * pagination.pageSize;
    setOffset(newOffset);
    setCurrentPage(pagination.current);

    fetchData(newOffset, pagination.pageSize, newSortField, newSortOrder, searchKey);
  };

  return (
    <Card className="table-card">
      <Table
        dataSource={data}
        columns={columns}
        bordered={true}
        onChange={handleChange}
        loading={loading}
        size={"middle"}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          showSizeChanger: false,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
          simple: false,
        }}
        tableLayout="fixed"
        scroll={{
          y: "calc(100vh - 320px)",
          x: scrollX,
        }}
      />
    </Card>
  );
}

export default TableView;
