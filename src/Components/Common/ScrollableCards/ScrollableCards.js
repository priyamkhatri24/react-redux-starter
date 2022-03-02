import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';

export const ScrollableCards = (props) => {
  const { data } = props;
  return (
    <section className='Scrollable__card'>
      {data[0].student_result_information_id &&
        data.map((elem) => {
          return (
            <Card
              className='Scrollable__cardContent text-center'
              key={`elem+${elem.student_result_information_id}`}
            >
              <img src={elem.image} alt='student' className='Scrollable__image mx-auto mt-3' />
              <p className='Scrollable__cardHeading mt-3'>{elem.name}</p>
              <p className='Scrollable__cardSubHeading m-0'>{elem.category_name}</p>
              <p className='Scrollable__cardSubHeading'>{elem.rank}</p>
            </Card>
          );
        })}

      {data[0].client_team_id &&
        data.map((elem) => {
          return (
            <Card
              className='Scrollable__cardContent text-center'
              key={`elem+${elem.client_team_id}`}
            >
              <img src={elem.image} alt='student' className='Scrollable__image mx-auto mt-3' />
              <p className='Scrollable__cardHeading mt-3'>{elem.name}</p>
              <p className='Scrollable__cardSubHeading m-0'>{elem.qualification}</p>
              <p className='Scrollable__cardSubHeading'>{elem.experience}</p>
            </Card>
          );
        })}
    </section>
  );
};

ScrollableCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
};
