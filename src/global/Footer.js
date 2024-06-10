// Footer.js
import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center', backgroundColor: '#001529', color: 'white', position: 'fixed', bottom: 0, width: '100%' }}>
      @Powered By JHP Parivar
    </AntFooter>
  );
};

export default Footer;
