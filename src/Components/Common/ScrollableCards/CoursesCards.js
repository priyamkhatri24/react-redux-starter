import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import './ScrollableCards.scss';
import Row from 'react-bootstrap/Row';
import StarIcon from '@material-ui/icons/Star';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ProgressBar from '../ProgressBar/ProgressBar';
import coursesBoy from '../../../assets/images/Courses/coursesBoy.svg';
import rupee from '../../../assets/images/Courses/rupee.svg';
import YCIcon from '../../../assets/images/ycIcon.png';

export const CoursesCards = (props) => {
  const {
    allCourses,
    myCourses,
    goToCourse,
    buyCourseId,
    myCourseId,
    clientLogo,
    featureName,
  } = props;

  return (
    <>
      {allCourses.length > 0 && (
        <section className='Scrollable__courseCard mt-3' style={{ marginLeft: 0, marginRight: 0 }}>
          <div className='Scrollable__subHeadTextUnderHeading'>
            <div className='d-flex justify-content-between w-100'>
              <h5 className='Scrollable__coursesInitialHeading mb-1'>{featureName} available</h5>
              {allCourses.length >= 4 ? (
                <button
                  className='Scrollable__viewAllButtonForCards mb-0'
                  type='button'
                  onClick={() => goToCourse('allCourses')}
                >
                  View All <ChevronRightIcon />
                </button>
              ) : null}
            </div>
            <p className='smallTextUnderHeading'>
              Top quality digital courses in your hands. Get them NOW!
            </p>
          </div>
          <div style={{ display: 'flex', marginTop: '100px' }} className='desktopDisplayforCards'>
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
                <div
                  className='course-card'
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                  key={`elem+${elem.course_id}`}
                >
                  <Card
                    className='Scrollable__courseCardContent text-center mt-8'
                    key={`elem+${elem.course_id}`}
                    onClick={() => buyCourseId(elem.course_id)}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={
                          elem.course_display_image
                            ? elem.course_display_image
                            : clientLogo || YCIcon
                        }
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
                          <span className='Scrollable__smallText my-auto'>
                            {elem.course_rating}
                          </span>
                          <span className='Scrollable__smallText my-auto'>
                            ({elem.total_votes})
                          </span>
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
                </div>
              );
            })}
            {/* <div className='col-sm-6 col-md-4 col-lg-2' style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Card
                className='Scrollable__courseCardContent text-center justify-content-center align-items-center'
                onClick={() => goToCourse('allCourses')}
                style={{ height: '246px' }}
              >
                <span className='Scrollable__viewAll'>View All</span>
              </Card>
            </div> */}
          </div>
        </section>
      )}
      {myCourses.length > 0 && (
        <>
          <div className='Scrollable__subHeadTextUnderHeading'>
            <div className='d-flex justify-content-between w-100'>
              <h5 className='mt-4 mb-0 Scrollable__coursesInitialHeading mx-0 row'>
                My {featureName}
              </h5>
              {myCourses.length >= 4 ? (
                <button
                  className='Scrollable__viewAllButtonForCards'
                  type='button'
                  onClick={() => goToCourse('myCourses')}
                >
                  View All <ChevronRightIcon />
                </button>
              ) : null}
            </div>
          </div>
          <div className='conatiner'>
            <section
              className='d-flex Scrollable__card my-3 desktopDisplayforCards'
              style={{ minWidth: '95%' }}
            >
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
                  <div
                    className='course-card'
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginTop: '45px',
                    }}
                  >
                    <Card
                      className='Scrollable__courseCardContent text-center'
                      key={`elem+${elem.course_id}`}
                      onClick={() => myCourseId(elem.course_id)}
                    >
                      <div style={{ position: 'relative' }}>
                        <img
                          src={
                            elem.course_display_image
                              ? elem.course_display_image
                              : clientLogo || YCIcon
                          }
                          alt='student'
                          className='mx-auto
                  Scrollable__courseImage'
                        />
                        {/* <div style={{ position: 'absolute', bottom: 0 }}>
                          <Row className='mx-2'>
                            {starArray.map((e) => {
                              return e;
                            })}
                            {whiteStarArray.map((e) => {
                              return e;
                            })}
                            <span className='Scrollable__smallText my-auto'>
                              {elem.course_rating}
                            </span>
                            <span className='Scrollable__smallText my-auto'>
                              ({elem.total_votes})
                            </span>
                          </Row>
                        </div> */}
                      </div>
                      <p className='Scrollable__courseCardHeading mt-3 mb-0 mx-2'>
                        {elem.course_title}
                      </p>
                      <div
                        style={{ width: '90%', position: 'absolute', bottom: '10px' }}
                        className='d-flex align-items-center'
                      >
                        <ProgressBar
                          width={`${elem.completed_percentage || 0}%`}
                          height='2px'
                          borderRadius='100px'
                          customStyle={{
                            backgroundColor: '#4154cf',
                            height: '2px',
                            borderRadius: '100px',
                          }}
                          myProgressCustomStyle={{
                            width: '85%',
                            height: '2px',
                            margin: '15px auto 5px auto',
                            backgroundColor: 'rgba(0,0,0,0.42)',
                          }}
                        />
                        <p
                          style={{
                            fontSize: '10px',
                            fontFamily: 'Montserrat-Regular',
                            marginBottom: '0px',
                            marginTop: '5px',
                          }}
                        >
                          {elem.completed_percentage ? elem.completed_percentage.toFixed(0) : 0}%
                        </p>
                      </div>
                      {/* <p className='Scrollable__courseCardSubHeading text-left mx-2'>
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
                      )} */}
                    </Card>
                  </div>
                );
              })}
              {/* {myCourses.length > 0 && (
                <div
                  className='col-sm-6 col-md-4 col-lg-2'
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <Card
                    className='Scrollable__courseCardContent text-center justify-content-center align-items-center'
                    onClick={() => goToCourse('myCourses')}
                    style={{ height: '246px' }}
                  >
                    <span className='Scrollable__viewAll'>View All</span>
                  </Card>
                </div>
              )} */}
            </section>
          </div>
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
  clientLogo: PropTypes.string,
  featureName: PropTypes.string,
};

CoursesCards.defaultProps = {
  clientLogo: '',
  featureName: 'Courses',
};

// col-sm-6 col-md-4 col-lg-2
