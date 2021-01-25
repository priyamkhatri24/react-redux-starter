import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import {
  getCourseObject,
  getCourseCurrentSlide,
  getCourseId,
} from '../../redux/reducers/course.reducer';
import { apiValidation, get, post } from '../../Utilities';
import { courseActions } from '../../redux/actions/course.action';
import { PageHeader } from '../Common';
import Basic from './Basic.course';
import Content from './Content.course';
import Display from './Display.course';
import Price from './Price.course';
import Privacy from './Privacy.course';

const CreateCourse = (props) => {
  const {
    clientId,
    clientUserId,
    courseId,
    history,
    setCourseCurrentSlideToStore,
    setCourseObjectToStore,
    courseObject,
    courseCurrentSlide,
  } = props;

  const [course, setCourse] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    // if (!courseId) {
    //   history.push('/');
    // } else {
    get({ client_id: clientId, course_id: courseId }, '/getCouponsOfCourse').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCoupons(result);
    });
    // }
  }, [courseId, clientId, history]);

  useEffect(() => {
    setCourse(courseObject);
    setCurrentSlide(courseCurrentSlide);
  }, [courseObject, courseCurrentSlide]);

  const getTagsOfBasic = (courseTagArray, deletedArray) => {
    const payload = {
      course_id: courseId,
      client_user_id: clientUserId,
      course_tag_array: JSON.stringify(courseTagArray),
      delete_array: JSON.stringify(deletedArray),
    };

    post(payload, '/addCourseTagsAndPreRequisites').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCourseObjectToStore({ ...course, tag_array: result.tag_array });
      setCourseCurrentSlideToStore(2);
    });
  };

  const getUpdatedSectionArray = (sectionArray) => {
    setCourseObjectToStore({ ...course, section_array: sectionArray });
  };

  const updateSectionInDb = (sectionName, sectionId, sectionArray) => {
    const payload = {
      section_name: sectionName,
      section_id: sectionId,
      course_id: courseId,
      client_user_id: clientUserId,
    };
    post(payload, '/addSectionToCourse').then((res) => {
      console.log(res);
      setCourseObjectToStore({ ...course, section_array: res.result.section_array });
    });
  };

  const updateDisplayDetails = (courseName, courseDesc, previewImage, previewVideo) => {
    const payload = {
      course_id: courseId,
      course_name: courseName,
      course_description: courseDesc,
      image_url: previewImage,
      preview_video_url: previewVideo,
    };

    post(payload, '/changeCourseDisplayPicture').then((res) => {
      console.log(res);
      if (res.success) {
        setCourseObjectToStore({
          ...course,
          course_description: courseDesc,
          course_title: courseName,
          course_display_image: previewImage,
          course_preview_video: previewVideo,
        });
        setCourseCurrentSlideToStore(4);
      }
    });
  };

  return (
    <div>
      {Object.keys(course).length > 0 && (
        <>
          <PageHeader title={course.course_title} />
          <div style={{ marginTop: '5rem' }}>
            {currentSlide === 1 && (
              <Basic tagArray={course.tag_array} getTagArrays={getTagsOfBasic} />
            )}
            {currentSlide === 2 && (
              <Content
                sectionArray={course.section_array}
                getUpdatedSectionArray={getUpdatedSectionArray}
                getSectiontoUpdateInDB={updateSectionInDb}
                history={history}
              />
            )}
            {currentSlide === 3 && (
              <Display
                courseTitle={course.course_title}
                courseDesc={course.course_description}
                updateDisplayDetails={updateDisplayDetails}
                courseDisplayImage={course.course_display_image}
              />
            )}
            {currentSlide === 4 && (
              <Price
                coursePrice={course.course_price}
                discountPrice={course.discount_price}
                coupons={coupons}
                clientId={clientId}
                courseId={courseId}
                clientUserId={clientUserId}
              />
            )}
            {currentSlide === 5 && (
              <Privacy
                clientId={clientId}
                courseId={courseId}
                history={history}
                clientUserId={clientUserId}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  courseId: getCourseId(state),
  courseObject: getCourseObject(state),
  courseCurrentSlide: getCourseCurrentSlide(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseObjectToStore: (payload) => {
      dispatch(courseActions.setCourseObjectToStore(payload));
    },

    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCourse);

CreateCourse.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setCourseObjectToStore: PropTypes.func.isRequired,
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  courseObject: PropTypes.instanceOf(Object).isRequired,
  courseCurrentSlide: PropTypes.number.isRequired,
};
