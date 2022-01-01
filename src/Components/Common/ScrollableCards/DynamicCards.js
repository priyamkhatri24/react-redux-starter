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
  const { data, dynamicCardClicked, titleData } = props;

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
    setModalHeading(titleData.client_feature_name);
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
              <source src={modalImage.file_url} type='video/mp4' />
              <track src='' kind='subtitles' srcLang='en' label='English' />
            </video>
          ) : (
            <img src={modalImage.file_url} alt='img' className='img-fluid' />
          )}
        </Modal.Body>
      </Modal>
      <div className='Scrollable__subHeadTextUnderHeadingDyn'>
        <div className='d-flex justify-content-between w-100'>
          <h5 className='Scrollable__coursesInitialHeading mb-1'>
            {titleData.client_feature_name}
          </h5>
        </div>
        <p className='smallTextUnderHeading mb-0'>{titleData.description}</p>
      </div>
      <section className='Scrollable__card' style={{ minHeight: '113px' }}>
        <div className='aspectCardsInnerContainer'>
          {data.length > 0 &&
            data.map((elem) => {
              return [
                <Card
                  className={'text-center m-2 Scrollable__dynamicCard'}
                  key={`elem+${elem.homepage_section_file_id}`}
                  // style={{
                  //   backgroundImage: `url(${elem.file_url})`,
                  // }}
                  onClick={() => {
                    dynamicCardClicked(elem);
                    showCardOnModal(elem);
                  }}
                >
                  {/* <img className='Scrollable__imageAd' src={elem.file_url} /> */}
                  {elem.file_type === 'video' ? (
                    /* eslint-disable */
                    <video
                      className='Scrollable__imageAd'
                      style={{ borderRadius: '5px' }}
                      muted
                      autoplay='autoplay'
                    >
                      <source src={elem.file_url} type='video/mp4' />
                      <track src='' kind='subtitles' srcLang='en' label='English' />
                    </video>
                  ) : (
                    <img src={elem.file_url} alt='student' className='Scrollable__imageAd' />
                  )}
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
  titleData: PropTypes.instanceOf(Object).isRequired,
};
