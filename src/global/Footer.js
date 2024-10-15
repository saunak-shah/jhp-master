import React from 'react';
import { Layout } from 'antd';
import { InstagramFilled, FacebookFilled, YoutubeFilled } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;

const iconStyle = {
  fontSize: '24px', // Adjust the size as needed
  margin: '0 8px', // Add some margin for spacing
  color: 'white' // Ensure the icon color is white
};

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center', backgroundColor: '#001529', color: 'white', position: 'relative', bottom: 0, width: '100%', padding: '24px 200px 10px 0px'  }}>
      @Powered By JHP Parivar
      <div style={{ float: 'right' }}>
        <a href="https://www.youtube.com/@jhpparivar" target="_blank" rel="noopener noreferrer">
          <YoutubeFilled style={iconStyle} />
        </a>
        <a href="https://www.facebook.com/jhpparivar?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
          <FacebookFilled style={iconStyle} />
        </a>
        <a href="https://www.instagram.com/jhpparivar?igsh=eGttOTUwNm5kZXpy" target="_blank" rel="noopener noreferrer">
          <InstagramFilled style={iconStyle} />
        </a>
      </div>
    </AntFooter>
  );
};

export default Footer;
