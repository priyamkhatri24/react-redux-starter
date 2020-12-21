import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { PageHeader } from '../Common';
import CkeditorQuestion from './CkeditorQuestion';
import PreviewCkeditor from './PreviewCkeditor';

const CreateQuestion = () => {
  const [slide, setSlide] = useState(0);

  const indicatorStyles = {
    background: 'rgba(0, 0, 0, 0.11)',
    width: '3rem',
    height: '0.5rem',
    display: 'inline-block',
    margin: '0 8px',
    borderRadius: '5px',
  };

  return (
    <div>
      <PageHeader title='Create Question' />
      <div style={{ marginTop: '7rem' }} className='Homework__carousel'>
        <Carousel
          style={{ backgroundColor: 'red' }}
          showArrows={false}
          showThumbs={false}
          autoPlay={false}
          showStatus={false}
          selectedItem={slide}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            if (isSelected) {
              return (
                <li
                  style={{ ...indicatorStyles, background: 'var(--primary-blue)' }}
                  aria-label={`Selected: ${label} ${index + 1}`}
                  title={`Selected: ${label} ${index + 1}`}
                />
              );
            }
            return (
              <li
                style={indicatorStyles}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role='button' // eslint-disable-line
                tabIndex={0}
                title={`${label} ${index + 1}`}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
        >
          <CkeditorQuestion />
          <PreviewCkeditor />
        </Carousel>
      </div>
    </div>
  );
};

export default CreateQuestion;
