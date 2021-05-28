import * as Yup from 'yup';

const alpha = /^[a-zA-Z_]+( [a-zA-Z_]+)*$/;

export const validation = Yup.object().shape({
  Tagline: Yup.string()
    .matches(alpha, { message: 'Enter Valid tagline', excludeEmptyString: true })
    .required()
    .max(36, 'Cannot exceed 36 characters'),
  'About Us': Yup.string()
    .required('Please enter the About field')
    .max(360, 'Cannot exceed 36 characters'),
  email: Yup.string().email().required(),
  Phone: Yup.number().typeError('Must be a Number').required(),
  Address: Yup.string().required(),
  State: Yup.string().required(),
  City: Yup.string()
    .matches(alpha, { message: 'Enter Valid City Name', excludeEmptyString: true })
    .required(),
});
