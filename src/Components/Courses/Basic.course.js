import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import CloseIcon from '@material-ui/icons/Close';

const Basic = (props) => {
  const { tagArray, getTagArrays } = props;

  const [learningtags, setLearningTags] = useState([]);
  const [prerequisiteTags, setprerequisiteTags] = useState([]);
  const [deleteLearningArray, setDeleteLearningArray] = useState([]);
  const [deletePrerequisiteArray, setDeletePrerequisiteArray] = useState([]);
  const [currentLearning, setCurrentLearning] = useState('');
  const [currentPrerequisite, setCurrentRequisite] = useState('');
  const [isLearningValid, setIsLearningValid] = useState(false);
  const [isPrequisiteValid, setIsPrequisiteValid] = useState(false);

  useEffect(() => {
    const learn = tagArray
      .filter((e) => e.tag_type === 'learning')
      .map((e, i) => {
        e.meriId = i + 1;
        return e;
      });
    setLearningTags(learn);
    const prerequisite = tagArray
      .filter((e) => e.tag_type === 'prereqisite')
      .map((e, i) => {
        e.meriId = i + 1;
        return e;
      });
    setprerequisiteTags(prerequisite);
    console.log(prerequisite);
  }, [tagArray]);

  const deleteObject = (id, type) => {
    const deleteElement =
      type === 'learning'
        ? learningtags.filter((e) => e.meriId === id && e.course_tag_id)
        : prerequisiteTags.filter((e) => e.meriId === id && e.course_tag_id);
    type === 'learning'
      ? setDeleteLearningArray((prev) => [...prev, ...deleteElement])
      : setDeletePrerequisiteArray((prev) => [...prev, ...deleteElement]);

    const newArray =
      type === 'learning'
        ? learningtags.filter((e) => e.meriId !== id)
        : prerequisiteTags.filter((e) => e.meriId !== id);
    type === 'learning' ? setLearningTags(newArray) : setprerequisiteTags(newArray);
  };

  const modify = (value, id, type) => {
    const modfied =
      type === 'learning'
        ? learningtags.map((e) => {
            if (e.meriId === id) e.tag_name = value;
            return e;
          })
        : prerequisiteTags.map((e) => {
            if (e.meriId === id) e.tag_name = value;
            return e;
          });
    type === 'learning' ? setLearningTags(modfied) : setprerequisiteTags(modfied);
  };

  const add = (type) => {
    if (type === 'learning' && !currentLearning) setIsLearningValid(true);
    else if (type === 'prerequisite' && !currentPrerequisite) setIsPrequisiteValid(true);
    else {
      type === 'learning' ? setIsLearningValid(false) : setIsPrequisiteValid(false);
      const newObject = {
        course_tag_id: '',
        tag_name: type === 'learning' ? currentLearning : currentPrerequisite,
        tag_type: type === 'learning' ? 'learning' : 'prereqisite',
        meriId: type === 'learning' ? learningtags.length + 1 : prerequisiteTags.length + 1,
      };
      type === 'learning'
        ? setLearningTags((prev) => [...prev, newObject])
        : setprerequisiteTags((prev) => [...prev, newObject]);
      type === 'learning' ? setCurrentLearning('') : setCurrentRequisite('');
    }
  };
  const goToNext = () => {
    add('learning');
    add('prerequisite');
    const allTags = [...prerequisiteTags, ...learningtags];
    const prunedTags = allTags.map((e) => {
      delete e.meriId;
      return e;
    });

    const deletedArray = [...deleteLearningArray, ...deletePrerequisiteArray];
    getTagArrays(prunedTags, deletedArray);
  };

  return (
    <div>
      <Card
        className='m-2 p-2'
        style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      >
        <Row className='my-auto Courses__createCourse mx-2'>
          <span className='Courses__coloredNumber mr-2'>1</span>{' '}
          <span className='my-auto ml-3'>Basic Information</span>
        </Row>
        <p className='mt-2 mx-2 Courses__chotiDetail'>
          The answers you write here will help students decide if your course is the one for them.
        </p>
        <p className='mt-2 mx-2 Courses__motiDetail'>
          What will the students learn from your course?
        </p>
        {learningtags.map((e) => {
          return (
            <Row className='m-2' key={e.meriId}>
              {e.tag_name && (
                <>
                  <label className='has-float-label my-auto'>
                    <input
                      className='form-control'
                      name='Example: Concave lens'
                      type='text'
                      value={e.tag_name}
                      placeholder='Example: Concave lens'
                      onChange={(elem) => modify(elem.target.value, e.meriId, 'learning')}
                    />
                    <span>Example: Concave lens</span>
                  </label>
                  <span
                    className='ml-auto'
                    onClick={() => deleteObject(e.meriId, 'learning')}
                    onKeyDown={() => deleteObject(e.meriId, 'learning')}
                    role='button'
                    tabIndex='-1'
                  >
                    <CloseIcon />
                  </span>
                </>
              )}
            </Row>
          );
        })}
        <Row className='m-2'>
          <label className='has-float-label my-auto'>
            <input
              required
              className='form-control'
              name='Example: Concave lens'
              type='text'
              value={currentLearning}
              placeholder='Example: Concave lens'
              onChange={(elem) => setCurrentLearning(elem.target.value)}
            />
            <span>Example: Concave lens</span>
          </label>
        </Row>

        {isLearningValid && (
          <small className='text-danger d-block m-2'>This field is required</small>
        )}

        <Row className='w-50 m-2'>
          <Button variant='dashboardBlueOnWhite' onClick={() => add('learning')}>
            +Add More
          </Button>
        </Row>
        <p className='mt-2 mx-2 Courses__motiDetail'>
          Are there any course requirements or prerequisites?{' '}
        </p>
        {prerequisiteTags.map((e) => {
          return (
            <Row key={e.meriId} className='m-2'>
              {e.tag_name && (
                <>
                  <label className='has-float-label my-auto'>
                    <input
                      className='form-control'
                      name='Enter your answer'
                      type='text'
                      value={e.tag_name}
                      placeholder='Enter your answer'
                      onChange={(elem) => modify(elem.target.value, e.meriId, 'prerequisite')}
                    />
                    <span>Enter your answer</span>
                  </label>
                  <span
                    className='ml-auto'
                    onClick={() => deleteObject(e.meriId, 'prerequisite')}
                    onKeyDown={() => deleteObject(e.meriId, 'prerequisite')}
                    role='button'
                    tabIndex='-1'
                  >
                    <CloseIcon />
                  </span>
                </>
              )}
            </Row>
          );
        })}

        <Row className='m-2'>
          <label className='has-float-label my-auto'>
            <input
              className='form-control'
              name='Enter your answer'
              type='text'
              value={currentPrerequisite}
              placeholder='Enter your answer'
              onChange={(elem) => setCurrentRequisite(elem.target.value)}
            />
            <span>Enter your answer</span>
          </label>
        </Row>
        {isPrequisiteValid && <small className='text-danger d-block'>This field is required</small>}

        <Row className='w-50 m-2'>
          <Button variant='dashboardBlueOnWhite' onClick={() => add('prerequisite')}>
            +Add More
          </Button>
        </Row>

        <Row className='w-25 justify-content-end ml-auto m-2'>
          <Button variant='customPrimarySmol' onClick={() => goToNext()}>
            Continue
          </Button>
        </Row>
      </Card>
      {[
        'Create your Content',
        'Course display page',
        'Pricing and promotion',
        'Privacy and publish',
      ].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            key={e}
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 2}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default Basic;

Basic.propTypes = {
  tagArray: PropTypes.instanceOf(Array).isRequired,
  getTagArrays: PropTypes.func.isRequired,
};
