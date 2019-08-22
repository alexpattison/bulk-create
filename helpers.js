export const tap = (data) => {
  console.log('data', data);
  return data;
};

export const variables = {
  projectId: process.env.PROJECT_ID,
  label:
    '{"Car":[{"geometry":[{"x":218,"y":241},{"x":472,"y":177},{"x":856,"y":171},{"x":1135,"y":256},{"x":1113,"y":318},{"x":1039,"y":537},{"x":582,"y":572},{"x":293,"y":597},{"x":176,"y":329}]}]}'
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const retryOnException = async (cb, args, ms = 61000) => {
  try {
    return cb(args);
  } catch (err) {
    console.log('Error', err);
    console.log(`Waiting ${ms / 1000} seconds`);
    await sleep(ms);
    return retryOnException(cb, args, ms);
  }
};

export const humanReadableDate = () => {
  const date = new Date();
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  const readable = date.toLocaleDateString('en-US', options);
  return readable;
};
