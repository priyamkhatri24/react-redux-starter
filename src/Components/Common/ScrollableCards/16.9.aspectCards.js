import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import AddIcon from '@material-ui/icons/Add';
import './ScrollableCards.scss';

export const AspectCards = (props) => {
  const { data } = props;

  return (
    <section className='Scrollable__card'>
      {data.length > 0 &&
        data.map((elem) => {
          return (
            <Card
              className='Scrollable__aspectCardContent text-center m-2'
              key={`elem+${elem.homepage_section_file_id}`}
              style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)' }}
            >
              <img
                src={elem.file_link}
                alt='student'
                height='113px'
                width='200px'
                style={{ borderRadius: '5px' }}
              />
            </Card>
          );
        })}
      <Card
        className='Scrollable__aspectCardContent text-center m-2 justify-content-center align-items-center'
        style={{
          boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)',
          fontSize: '17px',
          lineHeight: '20px',
          fontFamily: 'Montserrat-Medium',
          color: 'var(--primary-blue)',
        }}
      >
        <span className='my-auto'>
          <AddIcon /> ADD
        </span>
      </Card>
    </section>
  );
};

AspectCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
};
