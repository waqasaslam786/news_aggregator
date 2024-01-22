const validator = (body, schema) => {
  let errors = {};

  const result = schema.validate(body, {
    errors: { wrap: { label: false } },
    abortEarly: false,
    allowUnknown: true,
  });

  result?.error?.details?.forEach((item) => {
    if (item.path.length === 1) {
      errors[item.path[0]] = item.message;
    } else if (item.path.length === 2) {
      errors[`${item.path[0]}.${item.path[1]}`] = item.message;
    } else if (item.path.length === 3) {
      errors[`${item.path[0]}[${item.path[1]}].${item.path[2]}`] = item.message;
    }
  });

  return errors;
};

export default validator;
