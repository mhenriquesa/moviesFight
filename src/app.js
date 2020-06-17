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
  const elementsLeftSide = document.querySelectorAll('.left-summary .notification');
  const elementsRightSide = document.querySelectorAll('.right-summary .notification');

  elementsLeftSide.forEach((itemLeft, index) => {
    const itemRight = elementsRightSide[index];

    const leftStatValue = Number(itemLeft.dataset.value);
    const rightStatValue = Number(itemRight.dataset.value);

    itemLeft.classList.remove('winner');
    itemRight.classList.remove('winner');
    if (leftStatValue > rightStatValue) itemLeft.classList.add('winner');
    else itemRight.classList.add('winner');
  });
};

const htmlSummary = movieDetail => {
  const metascore = parseInt(movieDetail.Metascore);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const imdbRating = parseFloat(movieDetail.imdbRating);
  let oscar = movieDetail.Awards.match(/Won (\d+) Oscar/);
  if (oscar === null) oscar = 0;
  if (typeof oscar[1] === 'string') oscar = parseInt(oscar[1]);

  console.log(metascore, imdbVotes, imdbRating, oscar);

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
<article data-value=${oscar} class="notification is-primary awards">
<p class="title">${movieDetail.Awards}</p>
<p class="subtitle">Awards</p>
</article>
<article data-value=${imdbRating} class="notification is-primary imdb-rating">
<p class="title">${movieDetail.imdbRating}</p>
<p class="subtitle">imdb Rating</p>
</article>
<article data-value=${metascore} class="notification is-primary metascore">
<p class="title">${movieDetail.Metascore}</p>
<p class="subtitle">Metascore</p>
</article>
<article data-value=${imdbVotes} class="notification is-primary imdb-votes">
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
