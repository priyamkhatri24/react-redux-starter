import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';
import Row from 'react-bootstrap/Row';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import coursesBoy from '../../../assets/images/Courses/coursesBoy.svg';
import rupee from '../../../assets/images/Courses/rupee.svg';
import YCIcon from '../../../assets/images/ycIcon.png';

export const CoursesCards = (props) => {
  const { allCourses, myCourses, goToCourse, buyCourseId, myCourseId } = props;

  return (
    <>
      {allCourses.length > 0 && (
        <section className='Scrollable__card mt-3'>
          <div style={{ maxWidth: '120px', position: 'relative' }} className=' d-flex'>
            <img
              src={coursesBoy}
              alt='placeholderImage'
              className='justify-content-center align-items-center Scrollable__blurCourseImage'
            />
            <h5 className='Scrollable__coursesInitialHeading'>Courses</h5>
          </div>
          {allCourses.map((elem) => {
            const numberOfStars = Math.round(parseInt(elem.course_rating, 10));
            const starArray = [...Array(numberOfStars)].map((e, i) => (
              /* eslint-disable-next-line */
              <span role='img' aria-label='emoji' key={i}>
                <StarIcon className='Scrollable__emoji' />
              </span>
            ));

            const normalStars = 5 - numberOfStars;

            const whiteStarArray = [...Array(normalStars)].map((e, i) => (
              /* eslint-disable-next-line */
              <span role='img' aria-label='emoji' key={i}>
                <StarBorderIcon className='Scrollable__emoji' />
              </span>
            ));

            return (
              <Card
                className='Scrollable__courseCardContent text-center'
                key={`elem+${elem.course_id}`}
                onClick={() => buyCourseId(elem.course_id)}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={elem.course_display_image ? elem.course_display_image : YCIcon}
                    alt='student'
                    className='mx-auto
              Scrollable__courseImage'
                  />
                  <div style={{ position: 'absolute', bottom: 0 }}>
                    <Row className='mx-2'>
                      {starArray.map((e) => {
                        return e;
                      })}
                      {whiteStarArray.map((e) => {
                        return e;
                      })}
                      <span className='Scrollable__smallText my-auto'>{elem.course_rating}</span>
                      <span className='Scrollable__smallText my-auto'>({elem.total_votes})</span>
                    </Row>
                  </div>
                </div>
                <p className='Scrollable__courseCardHeading mt-3 mb-0 mx-2'>{elem.course_title}</p>
                <p className='Scrollable__courseCardSubHeading text-left mx-2'>
                  <img src={rupee} alt='rupee' height='10' width='10' />
                  <span className='mx-1 Scrollable__courseCardHeading'>{elem.discount_price}</span>
                  <span>
                    <del>{elem.course_price}</del>
                  </span>
                </p>
                {elem.bestseller_tag && (
                  <div className='Scrollable__bestSeller m-2 p-1'>Bestseller</div>
                )}
              </Card>
            );
          })}

          <Card
            className='Scrollable__courseCardContent text-center justify-content-center align-items-center'
            onClick={() => goToCourse('allCourses')}
          >
            <span className='Scrollable__viewAll'>View All</span>
          </Card>
        </section>
      )}
      {myCourses.length > 0 && (
        <>
          <p className='my-3 Scrollable__courseCardHeading mx-4' style={{ fontSize: '14px' }}>
            My Courses
          </p>
          <section className='Scrollable__card my-3'>
            {myCourses.map((elem) => {
              const numberOfStars = Math.round(parseInt(elem.course_rating, 10));
              const starArray = [...Array(numberOfStars)].map((e, i) => (
                /* eslint-disable-next-line */
                <span role='img' aria-label='emoji' key={i}>
                  <StarIcon className='Scrollable__emoji' />
                </span>
              ));

              const normalStars = 5 - numberOfStars;

              const whiteStarArray = [...Array(normalStars)].map((e, i) => (
                /* eslint-disable-next-line */
                <span role='img' aria-label='emoji' key={i}>
                  <StarBorderIcon className='Scrollable__emoji' />
                </span>
              ));

              return (
                <Card
                  className='Scrollable__courseCardContent text-center'
                  key={`elem+${elem.course_id}`}
                  onClick={() => myCourseId(elem.course_id)}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={elem.course_display_image ? elem.course_display_image : YCIcon}
                      alt='student'
                      className='mx-auto
              Scrollable__courseImage'
                    />
                    <div style={{ position: 'absolute', bottom: 0 }}>
                      <Row className='mx-2'>
                        {starArray.map((e) => {
                          return e;
                        })}
                        {whiteStarArray.map((e) => {
                          return e;
                        })}
                        <span className='Scrollable__smallText my-auto'>{elem.course_rating}</span>
                        <span className='Scrollable__smallText my-auto'>({elem.total_votes})</span>
                      </Row>
                    </div>
                  </div>
                  <p className='Scrollable__courseCardHeading mt-3 mb-0 mx-2'>
                    {elem.course_title}
                  </p>
                  <p className='Scrollable__courseCardSubHeading text-left mx-2'>
                    <img src={rupee} alt='rupee' height='10' width='10' />
                    <span className='mx-1 Scrollable__courseCardHeading'>
                      {elem.discount_price}
                    </span>
                    <span>
                      <del>{elem.course_price}</del>
                    </span>
                  </p>
                  {elem.bestseller_tag && (
                    <div className='Scrollable__bestSeller m-2 p-1'>Bestseller</div>
                  )}
                </Card>
              );
            })}
            {myCourses.length > 0 && (
              <Card
                className='Scrollable__courseCardContent text-center justify-content-center align-items-center'
                onClick={() => goToCourse('myCourses')}
              >
                <span className='Scrollable__viewAll'>View All</span>
              </Card>
            )}
          </section>
        </>
      )}
    </>
  );
};

CoursesCards.propTypes = {
  allCourses: PropTypes.instanceOf(Array).isRequired,
  myCourses: PropTypes.instanceOf(Array).isRequired,
  goToCourse: PropTypes.func.isRequired,
  buyCourseId: PropTypes.func.isRequired,
  myCourseId: PropTypes.func.isRequired,
};
