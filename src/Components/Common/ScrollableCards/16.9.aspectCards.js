import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import AddIcon from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import './ScrollableCards.scss';
import useWindowDimensions from '../../../Utilities/utilities';

export const AspectCards = (props) => {
  const { data, clickCard, clickAddCard, section, noAddCard, bigAspectCard } = props;

  const windowDimensions = useWindowDimensions();
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState({});
  const [modalHeading, setModalHeading] = useState(null);
  const cardStyle = {
    height: bigAspectCard ? '177px' : '113px',
    width: bigAspectCard ? '315px' : '200px',
    overflow: 'hidden',
    borderRadius: '10px',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
  };

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
      <section
        className='Scrollable__card'
        style={
          noAddCard
            ? { minHeight: '113px' }
            : { flexDirection: bigScreen ? 'row' : 'row-reverse', minHeight: '113px' }
        }
      >
        {!noAddCard && (
          <Card
            className='Scrollable__aspectCardContent text-center m-2 justify-content-center align-items-center'
            style={{
              boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
              fontSize: '17px',
              lineHeight: '20px',
              fontFamily: 'Montserrat-Medium',
              color: 'var(--primary-blue)',
            }}
            onClick={() => clickAddCard(section)}
          >
            <span className='my-auto'>
              <AddIcon /> ADD
            </span>
          </Card>
        )}

        <div className='aspectCardsInnerContainer'>
          {data.length > 0 &&
            data.map((elem) => {
              return (
                <Card
                  className={
                    bigAspectCard
                      ? 'text-center m-2 Scrollable__aspectCardBig'
                      : 'Scrollable__aspectCardContent text-center m-2'
                  }
                  key={`elem+${elem.homepage_section_file_id}`}
                  style={cardStyle}
                  onClick={() => {
                    clickCard(elem);
                    showCardOnModal(elem);
                  }}
                >
                  {elem.file_type === 'video' ? (
                    /* eslint-disable */
                    <video
                      // height={bigAspectCard ? '177px' : '113px'}
                      // width={bigAspectCard ? '315px' : '200px'}
                      style={{ borderRadius: '5px' }}
                      muted
                      autoplay='autoplay'
                    >
                      <source src={elem.file_link} type='video/mp4' />
                      <track src='' kind='subtitles' srcLang='en' label='English' />
                    </video>
                  ) : (
                    <img
                      src={elem.file_link}
                      alt='student'
                      // height={bigAspectCard ? '177px' : '113px'}
                      // width={bigAspectCard ? '315px' : '200px'}
                      style={{
                        borderRadius: '5px',
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  )}
                </Card>
              );
            })}
        </div>
      </section>
    </>
  );
};

AspectCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  clickCard: PropTypes.func.isRequired,
  clickAddCard: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  noAddCard: PropTypes.bool,
  bigAspectCard: PropTypes.bool,
};

AspectCards.defaultProps = {
  noAddCard: false,
  bigAspectCard: false,
};
