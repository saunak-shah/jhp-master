// components/ApplyForProgramModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Select, message, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const ApplyForProgramModal = ({
  visible,
  onCancel,
  student,
  fetchData,
  offset,
  pageSize,
}) => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const apiHost = process.env.REACT_APP_API_HOST;
      const url = `${apiHost}/api/programs?limit=1000&offset=0&is_program_active=true&fetch_for_student=true`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      const response = await axios.get(url, { headers });

      if (response.data?.data?.programs) {
        setPrograms(response.data.data.programs);
      } else {
        message.warning("No programs found.");
      }
    } catch (err) {
      message.error("Failed to fetch programs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedProgramId) {
      message.warning("Please select a program.");
      return;
    }

    try {
      setLoading(true);
      const apiHost = process.env.REACT_APP_API_HOST;
      const url = `${apiHost}/api/programs/register`;

      const response = await axios.post(
        url,
        {
          student_id: student?.student_id,
          program_id: selectedProgramId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        message.success("Student successfully applied for the program.");
        onCancel(); // Close modal
        fetchData(offset, pageSize); // Refresh data
        setSelectedProgramId(null);
      } else {
        message.error("Application failed.");
      }
    } catch (err) {
      message.error(
        `${err.response.data.message || "Failed to apply for the program."}`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchPrograms();
    }
  }, [visible]);

  return (
    <Modal
      title="Apply for Program"
      open={visible}
      onOk={handleApply}
      onCancel={() => {
        setSelectedProgramId(null);
        onCancel();
      }}
      okText="Apply"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      {loading ? (
        <Spin />
      ) : (
        <Select
          showSearch
          placeholder="Select a program"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(value) => setSelectedProgramId(value)}
          style={{ width: "100%" }}
          value={selectedProgramId}
        >
          {programs.map((program) => (
            <Option key={program.program_id} value={program.program_id}>
              {program.program_name}
            </Option>
          ))}
        </Select>
      )}
    </Modal>
  );
};

export default ApplyForProgramModal;
