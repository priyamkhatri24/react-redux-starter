import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import AddIcon from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import './ScrollableCards.scss';
import useWindowDimensions from '../../../Utilities/utilities';

export const DynamicCards = (props) => {
  const { data, dynamicCardClicked } = props;

  const windowDimensions = useWindowDimensions();
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState({});
  const [modalHeading, setModalHeading] = useState(null);

  const { width } = windowDimensions;

  const isScreenBig = () => {
    let isScreenBigger;
    if (width > 768) {
      isScreenBigger = true;
    } else {
      isScreenBigger = false;
    }
    return isScreenBigger;
  };

  const showCardOnModal = (card) => {
    setModalImage(card);
    setShowImageModal(true);
    if (card.homepage_section_homepage_section_id === 3) {
      setModalHeading('Testimonials');
    } else if (card.homepage_section_homepage_section_id === 2) {
      setModalHeading('Our Star Performers');
    } else if (card.homepage_section_homepage_section_id === 1) {
      setModalHeading('Poster');
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const bigScreen = isScreenBig();

  return (
    <>
      <Modal show={showImageModal} onHide={closeImageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalHeading}</Modal.Title>{' '}
        </Modal.Header>
        <Modal.Body style={{ margin: 'auto' }}>
          {modalImage.file_type === 'video' ? (
            /* eslint-disable */
            <video
              width='inherit'
              className='testimonialVideoTag'
              controls='controls'
              autoplay='autoplay'
            >
              <source src={modalImage.file_link} type='video/mp4' />
              <track src='' kind='subtitles' srcLang='en' label='English' />
            </video>
          ) : (
            <img src={modalImage.file_link} alt='img' className='img-fluid' />
          )}
        </Modal.Body>
      </Modal>

      <section className='Scrollable__card' style={{ minHeight: '113px' }}>
        <div className='aspectCardsInnerContainer'>
          {data.length > 0 &&
            data.map((elem) => {
              return [
                <Card
                  className={'text-center m-2 Scrollable__dynamicCard'}
                  key={`elem+${elem.homepage_section_file_id}`}
                  style={{
                    backgroundImage:
                      'url("https://ingenium-userfiles.s3.ap-south-1.amazonaws.com/ingenium_edu_20211215_21639589471347.png")',
                  }}
                  onClick={() => {
                    dynamicCardClicked(elem);
                  }}
                >
                  {/* <img
                    style={{ width: '100%' }}
                    src='https://ingenium-userfiles.s3.ap-south-1.amazonaws.com/ingenium_edu_20211215_21639589471347.png'
                  /> */}
                  {/* <Row className='mt-2 p-4'>
                    <Col xs={8}>
                      <p className='Dashboard__todaysHitsText'>
                        <span className='Scrollable__heading'>{elem.client_feature_name}</span>
                      </p>
                      <p className='Dashboard__attendanceSubHeading'>{elem.description}</p>
                    </Col>
                    <Col xs={4} className='Scrollable__cardImage'>
                      <img src={elem.file_url} alt='ad' height={78} width={62} />
                    </Col>
                  </Row> */}
                </Card>,
                <Card
                  className={'text-center m-2 Scrollable__dynamicCard'}
                  key={`elem+${elem.homepage_section_file_id}`}
                  style={{
                    backgroundImage: `url(${elem.file_url})`,
                  }}
                  onClick={() => {
                    dynamicCardClicked(elem);
                  }}
                >
                  {/* <img
                  style={{ width: '100%' }}
                  src='https://ingenium-userfiles.s3.ap-south-1.amazonaws.com/ingenium_edu_20211215_21639589471347.png'
                /> */}
                  <div className='mt-2 p-4 m-auto w-100'>
                    <p className='Dashboard__todaysHitsText'>
                      <span
                        style={{ color: 'white', fontSize: '28px' }}
                        className='Scrollable__heading'
                      >
                        {elem.client_feature_name}
                      </span>
                    </p>
                    <p
                      style={{ color: 'white', fontSize: '18px' }}
                      className='Dashboard__attendanceSubHeading'
                    >
                      {elem.description}
                    </p>
                    {/* <Col xs={4} className='Scrollable__cardImage'>
                      <img src={elem.file_url} alt='ad' height={78} width={62} />
                    </Col> */}
                  </div>
                </Card>,
              ];
            })}
        </div>
      </section>
    </>
  );
};

DynamicCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  dynamicCardClicked: PropTypes.func.isRequired,
};
