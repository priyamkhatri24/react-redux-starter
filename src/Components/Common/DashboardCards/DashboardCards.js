import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './DashboardCards.scss';

export const DashboardCards = (props) => {
  const {
    image,
    heading,
    subHeading,
    boxshadow,
    backGround,
    backgroundImg,
    coloredHeading,
    color,
  } = props;

  const style = {
    boxShadow: boxshadow,
    background: backGround,
    backgroundImage: backgroundImg,
  };

  return (
    <div className='DashboardCards my-3 mx-auto' style={style}>
      <span className='Dashboard__verticalDots'>
        <MoreVertIcon />
      </span>
      <Row className='mt-2 p-4'>
        <Col xs={8}>
          <p className='Dashboard__todaysHitsText'>
            {coloredHeading && <span style={{ color }}>{coloredHeading}</span>}{' '}
            <span>{heading}</span>
          </p>
          <p className='Dashboard__attendanceSubHeading'>{subHeading}</p>
        </Col>
        <Col xs={4}>
          <img src={image} alt='notebook' height='80' width='80' />
        </Col>
      </Row>
    </div>
  );
};
