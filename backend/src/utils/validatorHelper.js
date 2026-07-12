/**
 * Helper utility for common input validations.
 */

const isEmail = (val) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof val === 'string' && emailRegex.test(val);
};

const isString = (val) => {
  return typeof val === 'string';
};

const isNotEmptyString = (val) => {
  return isString(val) && val.trim().length > 0;
};

const isInteger = (val) => {
  return Number.isInteger(Number(val));
};

const isDecimal = (val) => {
  return !isNaN(parseFloat(val)) && isFinite(val);
};

const isEnum = (val, allowedValues) => {
  return allowedValues.includes(val);
};

const isBoolean = (val) => {
  return typeof val === 'boolean' || val === 'true' || val === 'false';
};

module.exports = {
  isEmail,
  isString,
  isNotEmptyString,
  isInteger,
  isDecimal,
  isEnum,
  isBoolean
};
