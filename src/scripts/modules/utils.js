// Fetching data after user input: 1sec
const debounce = (callback, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};

module.exports = {
  debounce,
};
