export const phoneRegExp = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[789]\d{9}$/;
export const EmailRegExp = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*\.[a-z]{2,4}$/; // eslint-disable-line max-len
export const onlyNumRegExp = /^[0-9\b]+$/; // only numbers accepted
export const onlyAlphaRegExp = /^[a-zA-Z ]{0,50}$/; // All english characters accepted, from 2 to 30 length. United-States is valid.
