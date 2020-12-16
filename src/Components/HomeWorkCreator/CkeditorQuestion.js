import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { get, apiValidation } from '../../Utilities';

const CkeditorQuestion = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentClassId, setCurrentClassId] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [type, setType] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const aquaticCreatures = [
    { label: 'Shark', value: 'Shark' },
    { label: 'Dolphin', value: 'Dolphin' },
    { label: 'Whale', value: 'Whale' },
    { label: 'Octopus', value: 'Octopus' },
    { label: 'Crab', value: 'Crab' },
    { label: 'Lobster', value: 'Lobster' },
  ];

  const typeOfQuestion = [
    { label: 'MCQ - Single Choice', value: 'MCQ' },
    { label: 'MCQ - Multiple Choice', value: 'multiple' },
    { label: 'Subjective', value: 'subjective' },
  ];

  useEffect(() => {
    get('', '/getClassesForHomeworkCreator').then((res) => {
      const result = apiValidation(res);
      const selectClasses = result.map((e) => {
        e.label = e.class_name;
        e.value = e.class_id;
        return e;
      });
      console.log(selectClasses);
      setClasses(selectClasses);
      console.log(result);
    });
  }, []);

  const setCurrentSubjects = (opt) => {
    setSubjects({ label: null, value: null });
    const selectSubject = opt.subject_array.map((e) => {
      e.label = e.subject_name;
      e.value = e.subject_id;
      return e;
    });

    setCurrentClassId(opt.class_id);
    setSubjects(selectSubject);
  };

  const setCurrentChapters = (opt) => {
    const subjectArray = [];
    subjectArray.push(opt.value);
    const payload = {
      class_id: currentClassId,
      subject_array: JSON.stringify(subjectArray),
    };

    get(payload, '/getChaptersOfClassSubject').then((res) => {
      const result = apiValidation(res);
      const modifiedChapters = result.map((e) => {
        e.value = e.chapter_id;
        e.label = e.chapter_name;
        return e;
      });
      setChapters(modifiedChapters);
    });
  };

  return (
    <Card className='Homework__selectCard mb-3 mx-2'>
      <Row className='m-0 justify-content-center'>
        <Col xs={5} lg={3} className='my-3 mx-auto p-0'>
          <Select
            options={classes}
            placeholder='Course'
            onChange={(opt) => setCurrentSubjects(opt)}
          />
        </Col>
        <Col xs={5} lg={3} className='my-3 mx-auto p-0'>
          <Select
            options={subjects}
            placeholder='Subject'
            onChange={(opt) => setCurrentChapters(opt)}
          />
        </Col>
        <Col xs={5} lg={3} className='my-3 mx-auto p-0'>
          <Select
            options={chapters}
            placeholder='Chapter'
            onChange={(opt) => setSelectedChapter(opt.value)}
          />
        </Col>
        <Col xs={5} lg={3} className='my-3 mx-auto p-0'>
          <Select
            options={typeOfQuestion}
            placeholder='Type'
            onChange={(opt) => setType(opt.value)}
          />
        </Col>
      </Row>
      {aquaticCreatures.map((e) => (
        <p style={{ marginTop: '6rem' }}>{e.label}</p>
      ))}
    </Card>
  );
};

export default CkeditorQuestion;
