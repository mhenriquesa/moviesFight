import { createAutocomplete } from './scripts/modules/autocomplete';

createAutocomplete({
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
    summary.innerHTML = '';
    summary.innerHTML = htmlSummary(await requestApiForTitle(item));
  },
});

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
async function requestApiForTitle(title) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      i: title.imdbID,
    },
  });
  return response.data;
}
