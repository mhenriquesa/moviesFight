import { fetchData } from './scripts/modules/requester';

const input = document.querySelector('#input-left');

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

const onInput = debounce(e => fetchData(e.target.value), 2000);

input.addEventListener('input', onInput);
