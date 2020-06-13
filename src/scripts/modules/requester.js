exports.fetchData = async () => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      i: 'tt0848228',
    },
  });
  console.log(response.data);
};
