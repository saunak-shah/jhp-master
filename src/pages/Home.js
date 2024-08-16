import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import firstImage from "../assets/1.jpg";
import secondImage from "../assets/2.jpg";
import thirdImage from "../assets/3.jpg";
import fourthImage from "../assets/4.jpg";
import fifthImage from "../assets/5.jpg";
import '../css/Home.css'; // Import the CSS file

const contentStyle = {
  margin: 0,
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const messageFlag = localStorage.getItem('showSignupMessage');
    if (messageFlag === 'true') {
      setShowMessage(true);
      localStorage.removeItem('showSignupMessage');
    }
  }, []);

  return (
    <>
      {showMessage && (
        <div className="signup-message">
          <h2>Congratulations !!</h2>
          <p>You have successfully signed up. Please save your username and password for future logins.We have also sent an email with your login details.</p>
        </div>
      )}
      <Carousel 
        arrows
        infinite={false}
        prevArrow={<button className="slick-prev"></button>}
        nextArrow={<button className="slick-next"></button>}
        style={{margin: '50px'}}
      >
        {/* <div>
          <h3 style={contentStyle}><img src={firstImage} alt="First slide" className="carousel-image" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={secondImage} alt="Second slide" className="carousel-image" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={thirdImage} alt="First slide" className="carousel-image" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={fourthImage} alt="First slide" className="carousel-image" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={fifthImage} alt="First slide" className="carousel-image" /></h3>
        </div> */}
      </Carousel>
    </>
  );
};

export default Home;
