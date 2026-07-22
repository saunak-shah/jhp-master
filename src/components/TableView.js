import { Card, Table } from "antd";
import React, { useMemo } from "react";
import { pageSize } from "../pages/constants";
import useWindowSize from "../hooks/useWindowSize";

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
  hideOnMobile,
}) {
  const { isMobile } = useWindowSize();

  const filteredColumns = useMemo(() => {
    if (!isMobile || !hideOnMobile || hideOnMobile.length === 0) return columns;
    return columns.filter((col) => !hideOnMobile.includes(col.dataIndex));
  }, [columns, isMobile, hideOnMobile]);

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
        columns={filteredColumns}
        bordered={true}
        onChange={handleChange}
        loading={loading}
        size={isMobile ? "small" : "middle"}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          showSizeChanger: false,
          showTotal: isMobile
            ? (total) => `${total} items`
            : (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
          simple: isMobile,
        }}
        scroll={{
          y: "calc(100vh - 320px)",
          x: filteredColumns.length > 5 ? "max-content" : undefined,
        }}
      />
    </Card>
  );
}

export default TableView;
