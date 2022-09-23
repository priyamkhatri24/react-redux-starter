import React from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './DashboardCards.scss';
import Button from 'react-bootstrap/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
    buttonText,
    buttonClick,
    uploadVideoClicked,
    height,
    width,
    textColor,
    uploadVideoText,
  } = props;

  const style = {
    boxShadow: boxshadow,
    background: backGround,
    backgroundImage: backgroundImg,
  };

  return (
    <div
      className='DashboardCards my-3 mx-auto'
      role='button'
      tabIndex='-1'
      style={style}
      onClick={() => buttonClick()}
      onKeyDown={() => buttonClick()}
    >
      <span className='Dashboard__verticalDots'>{/* <MoreVertIcon /> */}</span>
      <Row className='mt-2 p-4'>
        <Col xs={8}>
          <p className='Dashboard__todaysHitsText'>
            {coloredHeading && <span style={{ color }}>{coloredHeading}</span>}{' '}
            <span style={{ color: textColor }} className='DashboardCards__heading'>
              {heading}
            </span>
          </p>
          <p style={{ color: textColor }} className='Dashboard__attendanceSubHeading'>
            {subHeading}
          </p>

          {buttonText && (
            <Button variant='liveClasses'>
              {buttonText}{' '}
              <span>
                <ChevronRightIcon />
              </span>
            </Button>
          )}
          {uploadVideoText && (
            <Button
              onClick={(e) => uploadVideoClicked(e)}
              className='uploadVideoText'
              variant='uploadVideoButton'
            >
              {uploadVideoText}{' '}
              <span>
                <ChevronRightIcon />
              </span>
            </Button>
          )}
        </Col>
        <Col xs={4} className='DashboardCard_Image'>
          {image && <img src={image} alt='notebook' height={`${height}`} width={`${width}`} />}
        </Col>
      </Row>
    </div>
  );
};

DashboardCards.propTypes = {
  image: PropTypes.string.isRequired,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  boxshadow: PropTypes.string,
  backGround: PropTypes.string,
  backgroundImg: PropTypes.string,
  coloredHeading: PropTypes.string,
  color: PropTypes.string,
  buttonText: PropTypes.string,
  buttonClick: PropTypes.func,
  uploadVideoClicked: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number,
  textColor: PropTypes.string,
  uploadVideoText: PropTypes.string,
};

DashboardCards.defaultProps = {
  heading: undefined,
  subHeading: '',
  boxshadow: '',
  backGround: '',
  backgroundImg: '',
  coloredHeading: '',
  color: '',
  buttonText: null,
  uploadVideoText: null,
  buttonClick: () => {},
  uploadVideoClicked: () => {},
  height: 76,
  width: 78,
  textColor: '#000',
};
