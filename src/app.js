import { createAutocomplete } from './scripts/modules/autocomplete';
let leftSide = null;
let rightSide = null;

const autoCompleteConfig = {
  rootElement: document.querySelector('#left-autocomplete'),

  inputValue(item) {
    return item.Title;
  },

  renderOption(item) {
    const imgSrc = item.Poster === 'N/A' ? '' : item.Poster;
    return `<img src="${imgSrc}"/> ${item.Title} (${item.Year})`;
  },

  async actionAfterInput(e) {
    const responseFromApi = await requestApi('http://www.omdbapi.com/', {
      apikey: '3b88c541',
      s: e.target.value,
    });
    if (responseFromApi.Error) return '';
    return responseFromApi.Search;
  },

  async actionAfterClickOption(item) {
    const summary = document.querySelector('.left-summary');
    onClickOption(summary, 'left', item);
  },
};

const autoCompleteConfig2 = Object.assign({}, autoCompleteConfig, {
  rootElement: document.querySelector('#right-autocomplete'),

  async actionAfterClickOption(item) {
    const summary = document.querySelector('.right-summary');
    onClickOption(summary, 'right', item);
  },
});

const onClickOption = async (summary, side, item) => {
  const notification = document.querySelector('.tutorial');
  const dataFromApi = await requestApi(
    'http://www.omdbapi.com/',
    {
      apikey: '3b88c541',
      i: item.imdbID,
    },
    side
  );

  notification.classList.add('is-hidden');
  summary.innerHTML = htmlSummary(dataFromApi);
  if (leftSide && rightSide) runComparison(leftSide, rightSide);
};

const runComparison = (left, right) => {
  const htmlImdbRatingLeft = document
    .querySelector('.left-summary')
    .querySelector('.imdb-rating');

  const htmlImdbRatingRight = document
    .querySelector('.right-summary')
    .querySelector('.imdb-rating');

  const imdbRatingRight = parseFloat(right.imdbRating);
  const imdbRatingLeft = parseFloat(left.imdbRating);

  htmlImdbRatingLeft.classList.remove('winner');
  htmlImdbRatingRight.classList.remove('winner');
  if (imdbRatingLeft > imdbRatingRight) htmlImdbRatingLeft.classList.add('winner');
  else htmlImdbRatingRight.classList.add('winner');
};
const htmlSummary = movieDetail => {
  return `
<article class="media">
  <figure class="media-left">
    <p class="image"><img src="${movieDetail.Poster}" /></p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movieDetail.Title}</h1>
      <h4>${movieDetail.Genre}</h4>
      <p>${movieDetail.Plot}</p>
    </div>
  </div>
</article>
<article class="notification is-primary awards">
<p class="title">${movieDetail.Awards}</p>
<p class="subtitle">Awards</p>
</article>
<article class="notification is-primary imdb-rating">
<p class="title">${movieDetail.imdbRating}</p>
<p class="subtitle">imdb Rating</p>
</article>
<article class="notification is-primary metascore">
<p class="title">${movieDetail.Metascore}</p>
<p class="subtitle">Metascore</p>
</article>
<article class="notification is-primary imdb-votes">
<p class="title">${movieDetail.imdbVotes}</p>
<p class="subtitle">imdb Votes</p>
</article>

`;
};

const requestApi = async (url, params, side) => {
  const response = await axios.get(url, {
    params: params,
  });
  if (side) side === 'left' ? (leftSide = response.data) : (rightSide = response.data);

  return response.data;
};

createAutocomplete(autoCompleteConfig);
createAutocomplete(autoCompleteConfig2);
