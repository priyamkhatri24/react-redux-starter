import React from 'react';
import { validation } from './Validation';
import FormTemplate from './FormTemplate';

export const DynamicForm = (props) => {
  const getData = (e) => {
    props.getData(e);
  };

  return <FormTemplate fields={props.fields} validation={validation} getData={getData} />;
};
