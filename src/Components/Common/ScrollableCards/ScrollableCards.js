import React from 'react';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';

export const ScrollableCards = (props) => {
  return (
    <section className='Scrollable__card'>
      {props.data[0].student_result_information_id &&
        props.data.map((elem) => {
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

      {props.data[0].client_team_id &&
        props.data.map((elem) => {
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
