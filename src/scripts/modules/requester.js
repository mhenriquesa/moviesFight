async function requestApiForTitle(title) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      i: title.imdbID,
    },
  });
  return response.data;
}
const requestApi = async (url, params) => {
  const response = await axios.get(url, {
    params: params,
  });
  if (response.data.Error) return '';
  return response.data.Search;
};

module.exports = { requestApi, requestApiForTitle };
