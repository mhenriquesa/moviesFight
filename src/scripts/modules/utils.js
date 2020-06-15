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

const fetchData = async userInput => {
  if (userInput === '') return '';
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      s: userInput,
    },
  });
  if (response.data.Error) return 'Movie not found';
  return response.data.Search;
};
module.exports = {
  debounce,
  fetchData,
};
