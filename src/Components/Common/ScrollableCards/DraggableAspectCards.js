import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import AddIcon from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { post } from '../../../Utilities';
import './ScrollableCards.scss';
import useWindowDimensions from '../../../Utilities/utilities';

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  opacity: isDragging ? '0.7' : '1',
  height: '113px',
  width: '200px',
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
  //  backgroundColor: isDragging ? 'var(--primary-blue)' : '#fff',
  //  color: isDragging ? '#fff' : '#010102',
});

export const DraggableAspectCards = (props) => {
  const { data, clickCard, clickAddCard, section, noAddCard, bigAspectCard } = props;

  const windowDimensions = useWindowDimensions();
  const [array, setArray] = useState([...data]);
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

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDrag = (result) => {
    // let temp1;
    if (!result.destination) {
      return;
    }
    console.log(result, 'hp');
    console.log(array);

    const items = reorder(array, result.source.index, result.destination.index);
    const finalArr = items.map((ele, i) => {
      return {
        ...ele,
        priority_order: i + 1,
      };
    });
    setArray(finalArr);
    const payload = {
      file_array: JSON.stringify(finalArr),
    };
    post(payload, '/rearrangeHomePageContent').then((res) => console.log(res));
  };

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
      <DragDropContext
        onDragEnd={handleDrag}
        className='Scrollable__card d-flex'
        style={
          noAddCard
            ? { minHeight: '113px' }
            : { flexDirection: bigScreen ? 'row' : 'row-reverse', minHeight: '113px' }
        }
      >
        <Droppable
          droppableId='cardds'
          className='aspectCardsInnerContainer'
          direction='horizontal'
        >
          {(provided) => (
            <div
              className='aspectCardsInnerContainer'
              {...provided.droppableProps}
              ref={provided.innerRef}
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
              {provided.placeholder}
              {array.length > 0 &&
                array.map((elem, i) => {
                  return (
                    <Draggable
                      style={cardStyle}
                      index={i}
                      key={elem.homepage_section_file_id.toString()}
                      draggableId={elem.homepage_section_file_id.toString()}
                    >
                      {(provided, snapshot) => (
                        <Card
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={
                            bigAspectCard
                              ? 'text-center m-2 Scrollable__aspectCardBig'
                              : 'Scrollable__aspectCardContent text-center m-2'
                          }
                          key={`${elem.homepage_section_file_id}`}
                          //   style={cardStyle}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
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
                              style={{ borderRadius: '5px' }}
                            />
                          )}
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

DraggableAspectCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  clickCard: PropTypes.func.isRequired,
  clickAddCard: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  noAddCard: PropTypes.bool,
  bigAspectCard: PropTypes.bool,
};

DraggableAspectCards.defaultProps = {
  noAddCard: false,
  bigAspectCard: false,
};
