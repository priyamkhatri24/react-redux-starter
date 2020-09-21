import React, { Component, Fragment } from 'react';
import { Formik, Field } from 'formik';
import Button from 'react-bootstrap/button';
import './FormTemplate.scss';

export default class FormTemplate extends Component {
  renderFields(inputs) {
    return inputs.map((input) => {
      if (input.type === 'select') {
        return this.renderSelect(input);
      }

      return (
        <div key={input.name}>
          <div className='my-4 FormTemplate__input mx-auto'>
            <Field name={input.name} validate={this.validateDynamic}>
              {(props) => {
                const { field } = props;
                const { errors, touched } = props.form;
                const hasError =
                  errors[input.name] && touched[input.name] ? 'FormTemplate__hasError' : '';
                return (
                  <label className='has-float-label my-auto'>
                    <input
                      className={`form-control ${hasError}`}
                      {...field}
                      type='text'
                      placeholder={field.name}
                    />
                    <span>{field.name}</span>
                  </label>
                );
              }}
            </Field>
          </div>
        </div>
      );
    });
  }

  renderSelect(input) {
    return (
      <Fragment key={input.name}>
        <div>
          <Field name={input.name} validate={this.validateDynamic}>
            {(props) => {
              const { field } = props;
              const { errors, touched } = props.form;
              const hasError =
                errors[input.name] && touched[input.name] ? 'FormTemplate__hasError' : '';

              const defaultOption = (
                <option key='default' value={field.value}>
                  {field.value}
                </option>
              );
              const options = input.data.map((i) => (
                <option key={i} value={i}>
                  {' '}
                  {i}{' '}
                </option>
              ));
              const selectOptions = [defaultOption, ...options];
              return (
                <div className='dropdown'>
                  <select
                    value={field.value}
                    {...field}
                    className={`FormTemplate__select ${hasError}`}
                  >
                    {selectOptions}
                  </select>
                </div>
              );
            }}
          </Field>
        </div>
      </Fragment>
    );
  }

  // style checkbox and textArea

  renderCheckBox(input) {
    return (
      <Fragment key={input.name}>
        <label>{input.label}</label>
        <Field name={input.name}>
          {(prop) => {
            const { field } = prop;
            return (
              <input
                name={input.name}
                type='checkbox'
                checked={field.value}
                onChange={field.onChange}
              />
            );
          }}
        </Field>
      </Fragment>
    );
  }

  renderTextArea(input) {
    return (
      <Fragment key={input.name}>
        <label>{input.label}</label>
        <div>
          <Field name={input.name}>
            {(props) => {
              const { field } = props;
              const { errors, touched } = props.form;
              const hasError = errors[input.name] && touched[input.name] ? 'hasError' : '';
              return (
                <div>
                  <textarea {...field} id={hasError} />
                </div>
              );
            }}
          </Field>
        </div>
      </Fragment>
    );
  }

  getInitialValues(inputs) {
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
  }

  validateDynamic(value) {
    let error;
    if (!value) {
      error = 'Required';
    }

    return error;
  }

  render() {
    const initialValues = this.getInitialValues(this.props.fields);

    return (
      <Formik
        onSubmit={(values) => {
          this.props.getData(values);
        }}
        validationSchema={this.props.validation}
        initialValues={initialValues}
      >
        {(form) => {
          const errorMessageShow = Object.keys(form.errors).length > 0;

          return (
            <div>
              <form onSubmit={form.handleSubmit} className='mx-auto text-center mb-4'>
                {this.renderFields(this.props.fields)}
                <Button type='submit' variant='customPrimary'>
                  Submit
                </Button>

                {errorMessageShow && (
                  <small className='text-danger d-block text-center mt-3'>
                    Please fill the required fields
                  </small>
                )}
              </form>
            </div>
          );
        }}
      </Formik>
    );
  }
}
