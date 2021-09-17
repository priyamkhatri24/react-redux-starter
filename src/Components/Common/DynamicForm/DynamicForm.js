import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from './FormTemplate';

export const DynamicForm = (props) => {
  const { getData, fields, validation } = props;

  const getDynamicData = (e) => {
    for (const key of Object.keys(e)) {
      if (e[key] && typeof e[key] !== 'string') {
        e[key] = e[key].value;
      }
    }
    console.log(e);
    getData(e);
  };

  // const filterFields = () => {
  //   console.log()
  // }

  return <FormTemplate fields={fields} validation={validation} getData={getDynamicData} />;
};

DynamicForm.propTypes = {
  getData: PropTypes.func.isRequired,
  fields: PropTypes.instanceOf(Array).isRequired,
  validation: PropTypes.instanceOf(Object).isRequired,
};
