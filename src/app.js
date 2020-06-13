import { fetchData } from './scripts/modules/requester';

const input = document.querySelector('#input-left');

// Fetching data after user input: 1sec
let timeoutId;
const onInput = e => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    fetchData(e.target.value);
  }, 1000);
};

input.addEventListener('input', onInput);
