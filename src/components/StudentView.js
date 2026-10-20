import { useEffect, useState } from "react";
import { Col, Modal, Row, Spin, Typography, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
export const StudentView = ({
  data,
  isViewModalVisible,
  setViewModalVisibility,
}) => {
  const navigate = useNavigate();
  const [exams, setExams] = useState(null);
  const [examsLoading, setExamsLoading] = useState(false);

  useEffect(() => {
    if (!isViewModalVisible || !data?.student_id) {
      setExams(null);
      setExamsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchExams = async () => {
      setExams(null);
      setExamsLoading(true);
      try {
        const apiHost = process.env.REACT_APP_API_HOST;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiHost}/api/students/${data.student_id}/exams`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (!cancelled) {
          setExams(response.data.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          message.error("Failed to load exams");
        }
      } finally {
        if (!cancelled) {
          setExamsLoading(false);
        }
      }
    };

    fetchExams();

    return () => {
      cancelled = true;
    };
  }, [isViewModalVisible, data?.student_id]);

  const handleExamClick = (scheduleId) => {
    setViewModalVisibility(false);
    navigate(`/applicants/${scheduleId}`);
  };

  return (
    <Modal
      title="Student Details"
      open={isViewModalVisible && data}
      onCancel={() => setViewModalVisibility(false)}
      footer={null}
      width={600}
    >
      {" "}
      {data && data.username && (
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {/* Username */}
          <Col span={8}>
            <Text strong>Username:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.username}</Text>
          </Col>

          {/* Full Name */}
          <Col span={8}>
            <Text strong>Full Name:</Text>
          </Col>
          <Col span={16}>
            <Text>{`${data.first_name} ${data.father_name} ${data.last_name}`}</Text>
          </Col>

          {/* Phone Number */}
          <Col span={8}>
            <Text strong>Phone Number:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.phone_number}</Text>
          </Col>

          {/* Email */}
          <Col span={8}>
            <Text strong>Email:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.email}</Text>
          </Col>

          {/* Address */}
          <Col span={8}>
            <Text strong>Address:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.address}</Text>
          </Col>

          {/* Birth Date */}
          <Col span={8}>
            <Text strong>Birth Date:</Text>
          </Col>
          <Col span={16}>
            <Text>{moment(data.birth_date).format("DD-MM-YYYY")}</Text>
          </Col>

          {/* Gender */}
          <Col span={8}>
            <Text strong>Gender:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.gender}</Text>
          </Col>

          {/* Register No */}
          <Col span={8}>
            <Text strong>Register No:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.register_no}</Text>
          </Col>

          {/* Assigned To */}
          {data.teacher && data.teacher.teacher_first_name && (
            <>
              <Col span={8}>
                <Text strong>Assigned Teacher:</Text>
              </Col>
              <Col span={16}>
                <Text>
                  {data.teacher.teacher_first_name}{" "}
                  {data.teacher.teacher_last_name}
                </Text>
              </Col>
            </>
          )}
          {/* Registered On */}
          <Col span={8}>
            <Text strong>Registered On:</Text>
          </Col>
          <Col span={16}>
            <Text>{data.created_at}</Text>
          </Col>

          {/* Exams */}
          <Col span={8}>
            <Text strong>Exams:</Text>
          </Col>
          <Col span={16}>
            {examsLoading ? (
              <Spin size="small" />
            ) : exams === null ? null : exams.length === 0 ? (
              <Text>No exams registered</Text>
            ) : (
              exams.map((exam) => (
                <div key={exam.schedule_id}>
                  <a onClick={() => handleExamClick(exam.schedule_id)}>
                    {exam.exam_schedule?.exam_name}
                  </a>
                  <Text type="secondary">{` (${exam.course?.course_name})`}</Text>
                </div>
              ))
            )}
          </Col>
        </Row>
      )}
    </Modal>
  );
};
