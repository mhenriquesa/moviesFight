import { createAutocomplete } from './scripts/modules/autocomplete';
const { requestApi } = require('./scripts/modules/requester');

const autoCompleteConfig = {
  root: document.querySelector('.autocomplete'),
  renderOption(item) {
    const imgSrc = item.Poster === 'N/A' ? '' : item.Poster;
    return `<img src="${imgSrc}"/> ${item.Title} (${item.Year})`;
  },
  inputValue(item) {
    return item.Title;
  },
  async whenSelectedOption(item) {
    const summary = document.querySelector('.summary');
    const dataFromApi = await requestApi('http://www.omdbapi.com/', {
      apikey: '3b88c541',
      i: item.imdbID,
    });

    summary.innerHTML = htmlSummary(dataFromApi);
  },
  async whenUserInput(e) {
    const responseFromApi = await requestApi('http://www.omdbapi.com/', {
      apikey: '3b88c541',
      s: e.target.value,
    });
    if (responseFromApi.Error) return '';
    return responseFromApi.Search;
  },
};

createAutocomplete(autoCompleteConfig);

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
<article class="notification is-primary">
<p class="title">${movieDetail.Awards}</p>
<p class="subtitle">Awards</p>
</article>
<article class="notification is-primary">
<p class="title">${movieDetail.BoxOffice}</p>
<p class="subtitle">Box Office</p>
</article>
<article class="notification is-primary">
<p class="title">${movieDetail.Metascore}</p>
<p class="subtitle">Metascore</p>
</article>
<article class="notification is-primary">
<p class="title">${movieDetail.imdbVotes}</p>
<p class="subtitle">imdb Votes</p>
</article>

`;
};
