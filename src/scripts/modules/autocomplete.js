const { debounce } = require('./utils');

const createAutocomplete = ({ root }) => {
  insertInitialHtml(root);
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const summary = root.querySelector('.summary');
  const results = root.querySelector('.results');

  input.addEventListener('input', debounce(requestApi, 1000));

  document.addEventListener('click', e => {
    if (!root.contains(e.target)) closeDropdown();
  });

  async function requestApi(e) {
    const responseFromApi = await fetchData(e.target.value);
    if (!responseFromApi) return closeDropdown();
    openDropdown();
    cleanDropdownUp();
    showsOptions(responseFromApi);
  }

  function openDropdown() {
    return dropdown.classList.add('is-active');
  }
  function closeDropdown() {
    return dropdown.classList.remove('is-active');
  }
  function cleanDropdownUp() {
    results.innerHTML = '';
  }
  function showsOptions(responseFromApi) {
    for (const item of responseFromApi) {
      const option = document.createElement('a');
      const imgSrc = item.Poster === 'N/A' ? '' : item.Poster;

      option.classList.add('dropdown-item');
      option.innerHTML = `<img src="${imgSrc}"/>${item.Title}`;

      option.addEventListener('click', async e => {
        closeDropdown();
        input.value = item.Title;

        summary.innerHTML = '';
        summary.innerHTML = movieTemplate(await requestApiForTitle(item));
      });

      results.appendChild(option);
    }
  }
};

function insertInitialHtml(rootElement) {
  rootElement.innerHTML = `
  <label><b>Search for a movie</b></label>
  <input type="text" class="input">
  <div class="dropdown">
  <div class="dropdown-menu">
  <div class="dropdown-content results"></div>
  </div>
  </div>
  <div class="summary"></div>
  `;
}
const movieTemplate = movieDetail => {
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
const fetchData = async userInput => {
  if (userInput === '') return '';
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      s: userInput,
    },
  });
  if (response.data.Error) return '';
  return response.data.Search;
};
module.exports = { createAutocomplete };
