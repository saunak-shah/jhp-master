import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authStore from '../stores/authStore';
import '../css/Header.css'; // Import the CSS file
import '../pages/constants'; // Import the CSS file
import { allowModules } from '../pages/constants';

const { Header: AntHeader } = Layout;

const Header = ({ history }) => {
  const [userName, setUserName] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [roleAccess, setRoleAccess] = useState([]);

  useEffect(() => {
    const firstName = localStorage.getItem('teacher_first_name');
    const lastName = localStorage.getItem('teacher_last_name');
    setRegisterNo(localStorage.getItem('register_no'));
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    }
    // Retrieve role_access and parse it as an array
    const roleAccessStored = localStorage.getItem('role_access');
    if (roleAccessStored) {
      setRoleAccess(JSON.parse(roleAccessStored));
    }
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    authStore.logout();
  };

  const handleMenuItemClick = (path) => {
    // history.push(path);
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: 'change_password',
      icon: <UnlockOutlined />,
      label: <Link to="/changepassword">Change Password</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const mainMenuItems = [
    {
      key: 'home',
      roles: [allowModules.Home],  // Specify which roles should see this item
      label: <Link to="/home" className="header-menu-item">Home</Link>,
    },
    {
      key: 'exam',
      roles: [allowModules.Exam],  // Exam role
      label: <Link to="/exam" className="header-menu-item">Exam</Link>,
    },
    /* {
      key: 'admin',
      roles: [allowModules.Admin],  // Admin visibility
      label: <Link to="/admin" className="header-menu-item">Admin</Link>,
    }, */
    {
      key: 'student',
      roles: [allowModules.Student],  // Assume role 1 for students
      label: <Link to="/student" className="header-menu-item">Student</Link>,
    },
    {
      key: 'attendance',
      roles: [allowModules.Attendance],  // For example, if attendance is general access
      label: <Link to="/attendance" className="header-menu-item">Attendance</Link>,
    },
    {
      key: 'result',
      roles: [allowModules.Result],  // For example, if attendance is general access
      label: <Link to="/result" className="header-menu-item">Update Result</Link>,
    },
    {
      key: 'teacher',
      roles: [allowModules.Teacher],  // Specific to teachers
      label: <Link to="/teacher" className="header-menu-item">Teacher</Link>,
    },
    {
      key: 'profile',
      roles: [allowModules.Profile],
      label: (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span style={{ marginLeft: '8px' }}>
              {userName}
            </span>
          </div>
        </Dropdown>

      ),
      style: { float: 'right', marginLeft: 'auto' }
    }
  ].filter(item => item.roles.some(role => roleAccess.includes(role)));  // Filter items based on role access

  return (
    <AntHeader className="header" style={{ backgroundColor: "#001529" }}>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" style={{ backgroundColor: "#001529", fontSize: "18px", fontFamily: "sans-serif", color: 'white' }} defaultSelectedKeys={['2']} items={mainMenuItems} />
    </AntHeader>
  );
};

export default Header;
