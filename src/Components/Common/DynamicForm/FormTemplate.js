/* eslint-disable react/jsx-props-no-spreading */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, ErrorMessage } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 'react-datepicker/dist/react-datepicker.css';
import './FormTemplate.scss';

const CustomInput = ({ value, onClick }) => (
  <Row className='m-2 justify-content-center'>
    <label htmlFor='Select Date' className='w-100 has-float-label my-auto'>
      <input
        className='form-control'
        name='Select Date'
        type='text'
        placeholder='Select Date'
        onClick={onClick}
        readOnly
        value={value}
      />
      <span>Select Date</span>
      <i className='LiveClasses__show'>
        <ExpandMoreIcon />
      </i>
    </label>
  </Row>
);

const FormTemplate = (props) => {
  const { fields, validation, getData } = props;

  const isRequired = (message) => (value) => (value ? undefined : message);

  const renderSelect = (input) => {
    return (
      <Fragment key={input.name}>
        <Field name={input.name}>
          {/* validate={isRequired('This field is required')} */}
          {(property) => {
            const { field } = property;

            const options = input.data.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ));
            const selectOptions = [<option value=''>{input.label}</option>, ...options];
            return (
              <select
                value={field.value}
                {...field}
                className={input.message ? `form-control my-2` : 'form-control my-4'}
              >
                {selectOptions}
              </select>
            );
          }}
        </Field>
        {input.message && (
          <span
            style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.54)',
              lineHeight: '18px',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'left',
            }}
          >
            {input.message}
          </span>
        )}
        <ErrorMessage name={input.name}>
          {(msg) => (
            <small
              className='text-danger d-block mt-3'
              style={{ fontFamily: 'Montserrat-Medium', textTransform: 'capitalize' }}
            >
              {msg}
            </small>
          )}
        </ErrorMessage>
      </Fragment>
    );
  };

  // style checkbox and textArea

  // const renderCheckBox = (input) => {
  //   return (
  //     <Fragment key={input.name}>
  //       <label htmlFor={input.name}>{input.label}</label>
  //       <Field name={input.name}>
  //         {(prop) => {
  //           const { field } = prop;
  //           return (
  //             <input
  //               id={input.name}
  //               name={input.name}
  //               type='checkbox'
  //               checked={field.value}
  //               onChange={field.onChange}
  //             />
  //           );
  //         }}
  //       </Field>
  //     </Fragment>
  //   );
  // };

  // const renderDate = (input) => {
  //   return (
  //     <Fragment key={input.name}>
  //       <div className='my-4 FormTemplate__input mx-auto'>
  //         <Field name={input.name}>
  //           {(property) => {
  //             const { field } = property;
  //             const { errors, touched } = property.form;
  //             const hasError = errors[input.name] && touched[input.name] ? 'hasError' : '';

  //             return (
  //               <label htmlFor={field.name} className='has-float-label my-auto'>
  //                 <input
  //                   className={`form-control ${hasError}`}
  //                   {...field}
  //                   type='date'
  //                   placeholder={input.label}
  //                   id={field.name}
  //                 />
  //                 <span>{input.label}</span>
  //               </label>
  //               // <div>
  //               //   <textarea {...field} id={hasError} />
  //               // </div>
  //             );
  //           }}
  //         </Field>
  //       </div>
  //     </Fragment>
  //   );
  // };

  const getInitialValues = (inputs) => {
    // declare an empty initialValues object
    const initialValues = {};
    // loop loop over fields array
    // if prop does not exit in the initialValues object,
    // pluck off the name and value props and add it to the initialValues object;
    inputs.forEach((field) => {
      if (!initialValues[field.name]) {
        initialValues[field.name] = field.value;
      }
    });

    // return initialValues object
    return initialValues;
  };

  const initialValues = getInitialValues(fields);

  const renderInputField = (input) => {
    return (
      <Fragment key={input.name}>
        <label htmlFor={input.name} className='has-float-label my-auto'>
          <Field
            name={input.name}
            type='text'
            placeholder={input.label}
            className={input.message ? `form-control my-2` : 'form-control my-4'}
            as={input.type}
          />
          <span>{input.label}</span>
        </label>
        {input.message && (
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.54)',
              lineHeight: '18px',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'left',
              marginBottom: '20px',
            }}
          >
            {input.message}
          </div>
        )}
        <ErrorMessage name={input.name}>
          {(msg) => (
            <small className='text-danger d-block mt-3' style={{ fontFamily: 'Montserrat-Medium' }}>
              {msg}
            </small>
          )}
        </ErrorMessage>
      </Fragment>
    );
  };

  return (
    <Formik
      validationSchema={validation}
      initialValues={initialValues}
      onSubmit={(values) => {
        getData(values);
      }}
      render={({
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        validateField,
        validateForm,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} className='mx-4 mb-4 '>
          {fields.map((input) => {
            return input.type === 'select' ? renderSelect(input) : renderInputField(input);
          })}
          {Object.keys(errors).length > 0 && (
            <small className='text-danger d-block my-3' style={{ fontFamily: 'Montserrat-Medium' }}>
              Please fill the required fields correctly.
            </small>
          )}
          <Button variant='customPrimarySmol' type='submit' className='mx-auto d-block'>
            Save and Update
          </Button>
        </form>
      )}
    />
  );
};

export default FormTemplate;

FormTemplate.propTypes = {
  validation: PropTypes.instanceOf(Object),
  fields: PropTypes.instanceOf(Array).isRequired,
  getData: PropTypes.func.isRequired,
};

FormTemplate.defaultProps = {
  validation: undefined,
};

CustomInput.propTypes = {
  value: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
