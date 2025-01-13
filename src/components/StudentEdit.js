import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  message,
} from "antd";
import moment from "moment";
import { post } from "../global/api";

const { Option } = Select;

const StudentEditModal = ({
  data,
  isEditModalVisible,
  setEditModalVisibility,
  fetchData,
  offset,
  pageSize,
}) => {
   // Function to hide the modal
  const hideModal = () => setEditModalVisibility(false);

  // Handle form submission (e.g., saving the edited data)
  const handleSubmit = async (values) => {
   
    const updateProfileUrl = `/api/students/update_profile`;
    values = {
      data: values,
    };
    const response = await post(updateProfileUrl, values);

    if (response.status === 200) {
      message.success("Teacher updated");
      fetchData(offset, pageSize);
    } else {
      message.success(response.error);
      // throw new Error("Failed to update teacher.");
    }
    hideModal();
  };

  return (
    <>
      <Modal
        title="Edit Student Details"
        open={isEditModalVisible}
        onCancel={hideModal}
        footer={null} // Custom footer
        width={600}
      >
        {data && (
          <Form
            layout="vertical"
            initialValues={{
              first_name: data.first_name,
              last_name: data.last_name,
              father_name: data.father_name,
              phone_number: data.phone_number,
              address: data.address,
              email: data.email,
              birth_date: moment(data.birth_date),
              gender: data.gender,
              register_no: data.register_no,
              username: data.username,
            }}
            onFinish={handleSubmit}
          >
            {/* First Name */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="first_name"
                  rules={[
                    { required: true, message: "Please input the first name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              {/* Last Name */}
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="last_name"
                  rules={[
                    { required: true, message: "Please input the last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Father's Name */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Father's Name"
                  name="father_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the father's name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input the email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Phone Number */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone_number"
                  rules={[
                    {
                      required: true,
                      message: "Please input the phone number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* Username */}
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input the username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                {/* Birth Date */}
                <Form.Item
                  label="Birth Date"
                  name="birth_date"
                  rules={[
                    {
                      required: true,
                      message: "Please select the birth date!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Gender */}
              <Col span={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[
                    { required: true, message: "Please select the gender!" },
                  ]}
                >
                  <Select>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Address */}
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input the address!" }]}
            >
              <Input />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", fontSize: 20 }}
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default StudentEditModal;
