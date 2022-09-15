import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';

export const FeeScrollableCards = (props) => {
  const { data, planType, getPlanValue, currencySymbol } = props;

  return (
    <Card
      style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      className='m-2 p-2'
    >
      <p className='Scrollable__recentlyUsed m-2'>
        Recently used {planType === 'onetimecharge' ? 'one time charges' : 'plans'}
      </p>
      <section className='Scrollable__card' style={{ minHeight: '70px' }}>
        {data.map((elem, i) => {
          return (
            <Card
              className='Scrollable__feeCardContent pl-2'
              // eslint-disable-next-line
              key={`elem+${i}`}
              onClick={() =>
                planType === 'onetimecharge'
                  ? getPlanValue(elem.plan_array[0].name, elem.plan_array[0].amount)
                  : getPlanValue(elem)
              } // eslint-disable-line
            >
              <p className='Scrollable__feecardHeading mx-2 mt-2 mb-0'>
                {planType === 'onetimecharge'
                  ? elem.plan_array[0].name
                  : elem.plan_type === 'custom'
                  ? `${elem.plan_array.length} Installments`
                  : 'Monthly'}
              </p>
              <p
                className='Scrollable__feecardHeading m-2'
                style={{ color: 'var(--primary-blue)' }}
              >
                {`${currencySymbol} ${elem.plan_array.reduce((sum, acc) => +sum + +acc.amount, 0)}`}
              </p>
            </Card>
          );
        })}
      </section>
    </Card>
  );
};

FeeScrollableCards.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  planType: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  getPlanValue: PropTypes.func.isRequired,
};
