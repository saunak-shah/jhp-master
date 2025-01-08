import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button, Drawer } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, UnlockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../stores/authStore';
import '../css/Header.css'; // Import the CSS file
import { allowModules } from '../pages/constants';

const { Header: AntHeader } = Layout;

const Header = ({ history }) => {
  const [userName, setUserName] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [roleAccess, setRoleAccess] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false); // Drawer visibility state
  const navigate = useNavigate()

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

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleLogout = () => {
    // Implement logout logic here
    authStore.logout();
  };

  const handleMenuItemClick = (path) => {
    // Close the drawer and navigate
    setDrawerVisible(false);  // Close the drawer when a menu item is clicked
    navigate(path);       // Use useNavigate to navigate to the path
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

  const profileMenu = (
    <Menu>
      {menuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const mainMenuItems = [
    {
      key: 'home',
      roles: [allowModules.Home],  // Specify which roles should see this item
      label: <Link to="/home" className="header-menu-item">Home</Link>,
      onClick: () => handleMenuItemClick('/home') 
    },
    {
      key: 'exam',
      roles: [allowModules.Exam],  // Exam role
      label: <Link to="/exam" className="header-menu-item">Exam</Link>,
      onClick: () => handleMenuItemClick('/exam')
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
      onClick: () => handleMenuItemClick('/student') 
    },
    {
      key: 'attendance',
      roles: [allowModules.Attendance],  // For example, if attendance is general access
      label: <Link to="/attendance" className="header-menu-item">Attendance</Link>,
      onClick: () => handleMenuItemClick('/attendance') 
    },

    // {
    //   key: 'result',
    //   roles: [allowModules.Result],  // For example, if attendance is general access
    //   label: <Link to="/result" className="header-menu-item">Update Result</Link>,
    //   onClick: () => handleMenuItemClick('/result') 
    // },

    {
      key: 'group',
      roles: [allowModules.Group],
      label: <Link to="/group" className="header-menu-item">Groups</Link>,
      onClick: () => handleMenuItemClick('/group') 
    },
    {
      key: 'teacher',
      roles: [allowModules.Teacher],  // Specific to teachers
      label: <Link to="/teacher" className="header-menu-item">Teacher</Link>,
      onClick: () => handleMenuItemClick('/teacher') 
    },
    /* {
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
    } */
  ];  // Filter items based on role access

  /* return (
    <AntHeader className="header" style={{ backgroundColor: "#001529" }}>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" style={{ backgroundColor: "#001529", fontSize: "18px", fontFamily: "sans-serif", color: 'white' }} defaultSelectedKeys={['2']} items={mainMenuItems} />
    </AntHeader>
  ); */

  return (
    <Layout.Header className="main-header-custom">
      <Button className="mobile-menu-button" icon={<MenuOutlined />} onClick={toggleDrawer} />
      
      {/* Horizontal Menu for Larger Screens */}
      <Menu mode="horizontal" className="main-menu">
        {mainMenuItems.map(item => (
          <Menu.Item key={item.key} onClick={item.onClick}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>

      <Dropdown overlay={profileMenu}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href="/">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} className="custom-avatar" />
          <span className="custom-user-info">{userName}</span>
        </a>
      </Dropdown>

      {/* User Dropdown */}
      {/* <Menu theme="dark" mode="horizontal" style={{ backgroundColor: "#001529", fontSize: "18px", fontFamily: "sans-serif", color: 'white' }} defaultSelectedKeys={['2']} items={mainMenuItems} /> */}

      {/* Drawer for Mobile View */}
      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={toggleDrawer}
        visible={drawerVisible}
      >
        <Menu mode="vertical">
          {mainMenuItems.map(item => (
            <Menu.Item key={item.key} onClick={item.onClick}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </Layout.Header>
  );
};

export default Header;
