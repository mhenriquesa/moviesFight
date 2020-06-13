exports.fetchData = async userInput => {
  if (userInput === '') return;
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      t: userInput,
    },
  });
  console.log(response.data);
};
