import React from 'react';
import { Carousel } from 'antd';
const contentStyle = {
  margin: 0,
  height: '500px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const App = () => (
  <>
    <Carousel
      arrows
      infinite={false}
      style={{ margin: '50px' }}
      prevArrow={<button className="slick-prev" style={{left: '0'}}>Previous</button>}
      nextArrow={<button className="slick-next" style={{right: '0'}}>Next</button>}
    >
      <div>
        <h3 style={contentStyle}></h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
    <br />
  </>
);
export default App;