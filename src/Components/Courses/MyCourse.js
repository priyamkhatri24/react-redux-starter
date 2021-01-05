import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { apiValidation, get } from '../../Utilities';

const Mycourse = (props) => {
  const { history } = props;
  const [course, setCourse] = useState({});

  useEffect(() => {
    const payload = {
      client_user_id: history.location.state.clientUserId,
      course_id: history.location.state.id,
    };

    get(payload, '/getCourseDetails').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCourse(result);
      console.log(result.section_array[0].content_array[3].file_link);
    });
  }, [history]);

  return (
    <div>
      {Object.keys(course).length > 0 && (
        <div className='Courses__playerWrapper'>
          <ReactPlayer
            // eslint-disable-next-line
            url='https://s3.amazonaws.com/jsasamazone-userfiles-mobilehub-1701912002/Development/3.01606.020201224_105059.mp4'
            className='Courses__reactPlayer'
            playing
            width='100%'
            height='100%'
          />
        </div>
      )}
    </div>
  );
};

export default Mycourse;

Mycourse.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
