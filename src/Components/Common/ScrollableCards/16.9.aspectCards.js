import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import AddIcon from '@material-ui/icons/Add';
import './ScrollableCards.scss';
import useWindowDimensions from '../../../Utilities/utilities';

export const AspectCards = (props) => {
  const { data, clickCard, clickAddCard, section, noAddCard, bigAspectCard } = props;

  const windowDimensions = useWindowDimensions();

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

  const bigScreen = isScreenBig();

  return (
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

      <div style={{ display: 'flex' }}>
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
                style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)' }}
                onClick={() => clickCard(elem)}
              >
                {elem.type === 'video' ? (
                  /* eslint-disable */
                  <video controls='controls' muted>
                    <source src={elem.file_link} type='video/mp4' />
                    <track src='' kind='subtitles' srcLang='en' label='English' />
                  </video>
                ) : (
                  <img
                    src={elem.file_link}
                    alt='student'
                    height={bigAspectCard ? '177px' : '113px'}
                    width={bigAspectCard ? '315px' : '200px'}
                    style={{ borderRadius: '5px' }}
                  />
                )}
              </Card>
            );
          })}
      </div>
    </section>
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
