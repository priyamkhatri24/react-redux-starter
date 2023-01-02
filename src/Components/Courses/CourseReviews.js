import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { format } from 'date-fns';
import ProgressBar from '../Common/ProgressBar/ProgressBar';
import './Courses.scss';

const Reviews = (props) => {
  const { isFilterVisible, reviews, displayTwo, editClicked, allowReviews } = props;
  const [ratingArray, setRatingArray] = useState([0, 0, 0, 0, 0]);
  const [finalReviews, setFinalReviews] = useState([]);
  const [isNewestActive, setIsNewestActive] = useState(true);
  const [isHighestActive, setIsHighestActive] = useState(false);
  const [isLowestActive, setIsLowestActive] = useState(false);
  const [is5StarActive, setIs5StarActive] = useState(false);
  const [is4StarActive, setIs4StarActive] = useState(false);

  const findActualRating = () => {
    let rating = 0;
    reviews.forEach((ele) => {
      rating += +ele.rating;
    });
    return rating / reviews.length;
  };

  const generateStars = (rating) => {
    const starArr = new Array(rating).fill(Math.random());
    const starBorderArr = new Array(5 - rating).fill(Math.random());
    return (
      <div style={{ jystifyContent: 'space-between' }} className='d-flex align-items-center my-1'>
        {starArr.map((q) => {
          return (
            <StarIcon style={{ color: '#fbe244', fontSize: '16px' }} key={q * Math.random()} />
          );
        })}
        {starBorderArr.map((q) => {
          return (
            <StarBorderIcon
              style={{ color: '#fbe244', fontSize: '16px' }}
              key={q * Math.random()}
            />
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    setRatingArray([]);
    console.log(finalReviews, 'reeeeee');
    if (reviews.length) {
      const rateArray = [0, 0, 0, 0, 0];
      reviews.forEach((ele) => {
        rateArray[5 - ele.rating] += 1;
      });
      const rtngArray = rateArray.map((elem) => (elem * 100) / reviews.length);
      setRatingArray(rtngArray);
      console.log(rtngArray);
      setFinalReviews(reviews);
    } else {
      setRatingArray([0, 0, 0, 0, 0]);
    }
  }, [reviews]);

  const filterNewest = () => {
    const newReviews = [...reviews];
    const userComment = newReviews.filter((elem) => elem.isUserComment);
    const indexOfUserComment = newReviews.findIndex((ele) => ele.isUserComment);
    newReviews.splice(indexOfUserComment, 1);
    newReviews.sort((a, b) => b.created_at - a.created_at);
    setFinalReviews([...userComment, ...newReviews]);
    setIsHighestActive(false);
    setIsLowestActive(false);
    setIs5StarActive(false);
    setIs4StarActive(false);
    setIsNewestActive(true);
  };
  const filterHighest = () => {
    const newReviews = [...reviews];
    newReviews.sort((a, b) => b.rating - a.rating);
    setFinalReviews(newReviews);
    setIsHighestActive(true);
    setIsLowestActive(false);
    setIs5StarActive(false);
    setIs4StarActive(false);
    setIsNewestActive(false);
  };
  const filterLowest = () => {
    const newReviews = [...reviews];

    newReviews.sort((a, b) => a.rating - b.rating);
    setFinalReviews(newReviews);
    setIsHighestActive(false);
    setIsLowestActive(true);
    setIs5StarActive(false);
    setIs4StarActive(false);
    setIsNewestActive(false);
  };
  const filter5Star = () => {
    const newReviews = reviews.filter((ele) => ele.rating === '5');
    setFinalReviews(newReviews);
    setIsHighestActive(false);
    setIsLowestActive(false);
    setIs5StarActive(true);
    setIs4StarActive(false);
    setIsNewestActive(false);
  };

  const filter4Star = () => {
    const newReviews = reviews.filter((ele) => ele.rating === '4');
    setFinalReviews(newReviews);
    setIsHighestActive(false);
    setIsLowestActive(false);
    setIs5StarActive(false);
    setIs4StarActive(true);
    setIsNewestActive(false);
  };

  // const ratingArray = ['80', '70', '22', '38', '28'];
  return allowReviews == 'true' ? (
    <>
      <div className='d-flex align-items-end mb-1'>
        <h2 style={{ fontSize: '28px', fontFamily: 'Montserrat-Bold' }} className='mb-0'>
          {/* {Number(course.course_rating).toFixed(1)} */}
          {!isNaN(findActualRating().toFixed(1)) ? findActualRating().toFixed(1) : ''}
        </h2>
        {reviews.length ? (
          <p style={{ fontSize: '14px', fontFamily: 'Montserrat-Medium' }} className='mb-0 ml-2'>
            Course rating{' '}
            {finalReviews.length > 0 ? (
              <span style={{ fontSize: '14px', fontFamily: 'Montserrat-Regular' }}>
                (based on {finalReviews.length} {finalReviews.length > 1 ? 'Reviews' : 'Review'})
              </span>
            ) : null}
          </p>
        ) : (
          <p style={{ fontSize: '16px', fontFamily: 'Montserrat-Bold' }} className='mb-0 ml-0'>
            No reviews yet
          </p>
        )}
      </div>
      <div>
        {ratingArray.length
          ? ratingArray.map((ele, index) => {
              console.log(ele, 'elemennt');

              return (
                <div
                  style={{ jystifyContent: 'space-between' }}
                  /* eslint-disable */
                  key={index}
                  className='d-flex align-items-center'
                >
                  <ProgressBar
                    width={`${ele}%`}
                    height='20px'
                    borderRadius='5px'
                    customStyle={{
                      backgroundColor: '#fbe244',
                      borderRadius: '5px',
                    }}
                    myProgressCustomStyle={{
                      width: '80%',
                      margin: '5px auto',
                      marginRight: '15px',
                      marginLeft: '0px',
                      backgroundColor: 'rgba(0,0,0,0.12)',
                    }}
                  />
                  <div className='leftAlignText'>
                    {generateStars(5 - index)}
                    <p style={{ minWidth: '25px' }} className='percentageValues'>
                      {ele.toFixed(0)}%
                    </p>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      {isFilterVisible && (
        <div className='scrollableContentOfCourses mt-4'>
          <button
            onClick={filterNewest}
            type='button'
            className={`ratingFilterButton ${isNewestActive ? 'activeRatingFilter' : null}`}
          >
            Newest
          </button>
          <button
            onClick={filterHighest}
            type='button'
            className={`ratingFilterButton ${isHighestActive ? 'activeRatingFilter' : null}`}
          >
            Highest
          </button>
          <button
            onClick={filterLowest}
            type='button'
            className={`ratingFilterButton ${isLowestActive ? 'activeRatingFilter' : null}`}
          >
            Lowest
          </button>
          <button
            onClick={filter5Star}
            type='button'
            className={`ratingFilterButton ${
              is5StarActive ? 'activeRatingFilter' : null
            } d-flex align-items-center`}
          >
            5 <StarIcon style={{ color: '#fbe244', fontSize: '16px' }} />
          </button>
          <button
            onClick={filter4Star}
            type='button'
            className={`ratingFilterButton ${
              is4StarActive ? 'activeRatingFilter' : null
            } d-flex align-items-center`}
          >
            4 <StarIcon style={{ color: '#fbe244', fontSize: '16px' }} />
          </button>
        </div>
      )}
      <div className='mt-4'>
        {finalReviews.slice(0, displayTwo ? 2 : reviews.length).map((elem) => {
          return (
            <>
              <div className='d-flex w-100 justify-content-between align-items-center'>
                <h6 className='mb-0' style={{ fontFamily: 'Montserrat-Bold', marginRight: '0px' }}>
                  {elem.first_name} {elem.last_name}
                </h6>
                {/* eslint-disable */}
                {elem.isUserComment && (
                  <p
                    onClick={editClicked}
                    style={{ cursor: 'pointer' }}
                    className='verySmallText mb-0'
                  >
                    <EditIcon className='verySmallIcon' />
                    Edit
                  </p>
                )}
              </div>

              <div className='d-flex align-items-center'>
                {generateStars(+elem.rating)}
                <span className='ml-2 verySmallText'>
                  {format(+elem.created_at * 1000, 'dd/MM/yyyy')
                    .split('/')
                    .join('-')}
                </span>
              </div>
              <p style={{ fontFamily: 'Montserrat-Medium' }}>{elem.review_text}</p>
            </>
          );
        })}
      </div>
    </>
  ) : (
    <p style={{ textAlign: 'center', fontFamily: 'Montserrat-Medium' }}>
      Reviews have been disabled by the admin for this course.
    </p>
  );
};

export default React.memo(Reviews);

Reviews.propTypes = {
  isFilterVisible: PropTypes.bool.isRequired,
  reviews: PropTypes.instanceOf(Array).isRequired,
  displayTwo: PropTypes.bool.isRequired,
  editClicked: PropTypes.func.isRequired,
  allowReviews: PropTypes.string.isRequired,
};
