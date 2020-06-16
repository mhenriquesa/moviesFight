const requestApi = async (url, params) => {
  const response = await axios.get(url, {
    params: params,
  });
  return response.data;
};

module.exports = { requestApi };
