// Header.js
import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { withRouter, Link } from 'react-router-dom';
import Exam from '../Exam'; // Import the Exam component

const { Header: AntHeader } = Layout;

const Header = ({ user, history }) => {
  const handleLogout = () => {
    // Implement logout logic here
    history.push('/login');
  };

  const handleMenuItemClick = (path) => {
    history.push(path);
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
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
      label: <Link to="/home">Home</Link>,
      onClick: () => handleMenuItemClick('/home')
    },
    {
      key: 'exam',
      label: <Link to="/exam">Exam</Link>,
      onClick: () => handleMenuItemClick('/exam')
    },
    {
      key: 'videos',
      label: <Link to="/videos">Videos</Link>,
      onClick: () => handleMenuItemClick('/videos')
    },
    {
      key: 'training',
      label: <Link to="/training">Training</Link>,
      onClick: () => handleMenuItemClick('/training')
    },
    {
      key: 'profile',
      label: (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <Avatar size="small" icon={<UserOutlined />} />
        </Dropdown>
      ),
      style: { float: 'right', marginLeft: '1300px' }
    }
  ];

  return (
    <AntHeader className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={mainMenuItems} />
    </AntHeader>
  );
};

export default withRouter(Header);
