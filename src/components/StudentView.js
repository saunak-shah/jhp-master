import { Col, Modal, Row, Typography } from "antd";
import moment from "moment";
const { Text } = Typography;
export const StudentView = ({
  data,
  isViewModalVisible,
  setViewModalVisibility,
}) => {
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
        </Row>
      )}
    </Modal>
  );
};
