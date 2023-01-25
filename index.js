const { openApiSpecFactory } = require('./lib/openapi-validator');
const satisfyApiSpec = require('./lib/satisfyApiSpec');

const isObject = arg => typeof arg === 'object' && arg !== null && !Array.isArray(arg);

module.exports = function (filepathOrObject) {
  
  const openApiSpecs = conformArgument(filepathOrObject);
  
  return function (chai) {
    satisfyApiSpec(chai, openApiSpecs);
  };
};

function conformArgument(arg) {
  try {
    if (typeof arg === 'string') {
      return { default: openApiSpecFactory.makeApiSpec(arg) }
    }
    if (isObject(arg)) {
      const specs = {};
      for (const [key, value] of Object.entries(arg)) {
        specs[key] = openApiSpecFactory.makeApiSpec(value);
        if (specs.default === undefined) { specs.default = specs[key] }
      }
      return specs;
    }
    throw new Error(`Received type '${typeOf(arg)}'`);
  } catch (error) {
    throw new Error(
      `The provided argument must be either an absolute filepath or an object where each value is representing an OpenAPI specification.\nError details: ${
        error.message
      }`,
    );
  }
}
