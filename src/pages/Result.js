import React, { useEffect, useState } from "react";
import { Input, Button, Form, message } from "antd";
import { observer } from "mobx-react-lite";
import axios from "axios";
import "../css/Teacher.css"; // Import the CSS file
import { post } from "../global/api";

// const { Option } = Select;

const Result = observer(() => {
  const [form] = Form.useForm();

//   const [students, setStudents] = useState([]);
//   const [totalUserCount, setTotalUserCount] = useState(0);
//   const [courseId, setCourseId] = useState(0);
//   const [studentId, setStudentId] = useState(0);
//   const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  //   const [selectedCourseValue, setSelectedCourseValue] = useState(null);
  //   const [selectedStudentValue, setSelectedStudentValue] = useState(null);

  const handleResultSubmit = async () => {
    setLoading(true); // Set loading to true when starting the submit

    try {
        await form
        .validateFields()
        .then((values) => {
          console.log("Form values:", values);
          const appUrl = `/api/result`;

          return post(appUrl, values);
        })
        .then((data) => {
            if(data.status == 200){
                message.success(data.message);
            } else {
                message.error(data.message);
            }
          console.log("Data parsed:", data);
        })
        .catch((error) => {
          console.error("Error during post or processing response:", error);
          message.error(
            "An error occurred during create result. Please try again later."
          );
        });
    } catch (error) {
      console.error("Error during create result:", error);
      message.error(
        "An error occurred during create result. Please try again later."
      );
    } finally {
      setLoading(false); // Set loading to false when the submit is finished
    }

  };

  //   const handleCourseChange = (courseId) => {
  //     setCourseId(courseId);
  //     setSelectedCourseValue(courseId);
  //     setOffset(0);
  //     fetchCoursesData(offset, null);
  //     setCurrentPage(1);
  //   };

  //   const handleStudentChange = (studentId) => {
  //     setStudentId(studentId);
  //     setSelectedStudentValue(studentId);
  //     setOffset(0);
  //     fetchStudentData(offset, null);
  //     setCurrentPage(1);
  //   };

  //   useEffect(() => {
  //     fetchStudentData(offset, null);
  //     fetchCoursesData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [searchKey, totalUserCount, courseId, studentId]);

  //   const fetchStudentData = async (offset, limit) => {
  //     setLoading(true);
  //     try {
  //       const apiHost = process.env.REACT_APP_API_HOST;
  //       let apiUrl;
  //       //   if (teacherId) {
  //       //     apiUrl = `${apiHost}/api/teachers/assignees/${teacherId}?limit=${limit}&offset=${offset}`;
  //       //   } else {
  //       apiUrl = `${apiHost}/api/students?limit=${limit}&offset=${offset}`;
  //       //   }
  //       if (searchKey && searchKey.length > 0) {
  //         apiUrl = apiUrl + `&searchKey=${searchKey}`;
  //       }

  //       if (sortField) {
  //         apiUrl = apiUrl + `&sortBy=${sortField}&sortOrder=${sortOrder}`;
  //       }

  //       let headers = {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       };
  //       const response = await axios.get(apiUrl, { headers });
  //       if (response.data && response.data.data) {
  //         setTotalUserCount(response.data.data.totalCount);
  //         setStudents(response.data.data.users);
  //       } else {
  //         setStudents([]);
  //       }
  //     } catch (error) {
  //       console.error("Error during API call:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const fetchCoursesData = async () => {
  //     try {
  //       const offset = 0;
  //       const apiHost = process.env.REACT_APP_API_HOST;
  //       let apiUrl = `${apiHost}/api/courses?limit=${null}&offset=${offset}`;

  //       let headers = {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       };
  //       const response = await axios.get(apiUrl, { headers });

  //       if (
  //         response.data &&
  //         response.data.data &&
  //         response.data.data.courses.length > 0
  //       ) {
  //         setCourses(response.data.data.courses);
  //       } else {
  //         setCourses([]);
  //       }
  //     } catch (error) {
  //       console.error("Error during API call:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchStudentData(0, null);
  //     fetchCoursesData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <div className="profile-container" style={{ marginTop: "100px" }}>
      <h2>Update Result</h2>

      <Form form={form} layout="vertical">
        {/* <Form.Item
          name="course"
          label="Select Course"
          rules={[{ required: true, message: "Please select course" }]}
        >
          <Select
            onChange={handleCourseChange}
            showSearch={true}
            placeholder="Select Course"
            optionFilterProp="children"
            value={selectedCourseValue}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            style={{ textAlign: "center" }}
          >
            <Option key={"None"} value={undefined}>
              None
            </Option>

            {courses.map((course, index) => (
              <Option key={index} value={course.course_id}>
                {course.course_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="student"
          label="Select Student"
          rules={[{ required: true, message: "Please select student" }]}
        >
          <Select
            onChange={handleStudentChange}
            showSearch={true}
            placeholder="Select Student"
            optionFilterProp="children"
            value={selectedStudentValue}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            style={{ textAlign: "center" }}
          >
            <Option key={"None"} value={undefined}>
              None
            </Option>

            {students.map((student, index) => (
              <Option key={index} value={student.student_id}>
                {student.first_name + " " + student.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item
          name="student_apply_course_id"
          label="ApplicationId"
          rules={[
            { required: true, message: "Please input application number" },
          ]}
        >
          <Input
            placeholder="Enter application id"
          />
        </Form.Item>

        <Form.Item
          name="score"
          label="Score"
          rules={[{ required: true, message: "Please input student's score" }]}
        >
          <Input
            type="number"
            placeholder="Enter student's score"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: "10px", textAlign: "center" }}>
          <Button
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "#f54290",
            }}
            type="primary"
            block
            onClick={handleResultSubmit}
            loading={loading} // Add loading prop to the button
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
export default Result;
