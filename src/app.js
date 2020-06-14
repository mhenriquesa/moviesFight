const { fetchData, debounce } = require('./scripts/modules/utils');

const requestApi = async e => {
  const movies = await fetchData(e.target.value);
  console.log(movies);
};

//Event listener
const input = document.querySelector('#input-left');
input.addEventListener('input', debounce(requestApi, 1000));
