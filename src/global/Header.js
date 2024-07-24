// Header.js
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authStore from '../stores/authStore';
import '../css/Header.css'; // Import the CSS file

const { Header: AntHeader } = Layout;

const Header = ({ history }) => {
  const [userName, setUserName] = useState('');
  const [registerNo, setRegisterNo] = useState('');

  useEffect(() => {
    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');
    setRegisterNo(localStorage.getItem('register_no'));
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    }
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    // history.push('/login');
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
      icon: <UserOutlined />,
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
      label: <Link to="/home" className="header-menu-item">Home</Link>,
      onClick: () => handleMenuItemClick('/home')
    },
    {
      key: 'exam',
      label: <Link to="/exam" className="header-menu-item">Exam</Link>,
      onClick: () => handleMenuItemClick('/exam')
    },
    {
      key: 'attendance',
      label: <Link to="/attendance" className="header-menu-item">Attendance</Link>,
      onClick: () => handleMenuItemClick('/attendance')
    },
    {
      key: 'profile',
      label: (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span style={{ marginLeft: '8px' }}>
              {userName} (<span style={{ color: '#ddd' }}>#{registerNo}</span>)
            </span>
          </div>
        </Dropdown>

      ),
      style: { float: 'right', marginLeft: 'auto' }
    }
  ];

  return (
    <AntHeader className="header" style={{ backgroundColor: "#F54290" }}>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" style={{ backgroundColor: "#F54290", fontSize: "18px", fontFamily: "sans-serif", color: 'white' }} defaultSelectedKeys={['2']} items={mainMenuItems} />
    </AntHeader>
  );
};

export default Header;
