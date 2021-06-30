import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BatchesSelector } from './BatchesSelector';

export const StudentSelector = (props) => {
  const { students, selectedStudents, getSelectedStudents } = props;
  const [modStudents, setModStudents] = useState([]);
  useEffect(() => {
    const modifiedStudents = students.map((e) => {
      e.client_batch_id = e.user_id;
      e.batch_name = `${e.first_name} ${e.last_name}`;
      return e;
    });
    setModStudents(modifiedStudents);
  }, [students]);
  return (
    <BatchesSelector
      batches={modStudents}
      selectBatches={selectedStudents}
      getSelectedBatches={getSelectedStudents}
      title='Students'
      isStudentFee
      sendBoth
    />
  );
};

StudentSelector.propTypes = {
  students: PropTypes.instanceOf(Array).isRequired,
  selectedStudents: PropTypes.instanceOf(Array).isRequired,
  getSelectedStudents: PropTypes.func.isRequired,
};
