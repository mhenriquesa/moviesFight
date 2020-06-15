const { fetchData, debounce } = require('./scripts/modules/utils');

const root = document.querySelector('.autocomplete');
insertInitialHtml();

const summary = document.querySelector('.summary');
const results = document.querySelector('.results');
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');

lookForMoviesWhenInput();

closeDropdownIfClicksOutside();

function insertInitialHtml() {
  root.innerHTML = `
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

async function requestApi(e) {
  const movies = await fetchData(e.target.value);

  if (!movies) return closeDropdown();
  openDropdown();

  if (movies === 'Movie not found') return showsMovieNotFound();

  cleanDropdownUp();
  showsMoviesOptions(movies);
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
function showsMovieNotFound() {
  results.innerHTML = 'Movie not found :( ';
}

function showsMoviesOptions(responseFromApi) {
  for (const movie of responseFromApi) {
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.classList.add('dropdown-item');
    option.innerHTML = `
    <img src="${imgSrc}"/>
    ${movie.Title}
    `;

    option.addEventListener('click', async e => {
      closeDropdown();
      input.value = movie.Title;

      summary.innerHTML = '';
      summary.innerHTML = movieTemplate(await requestApiForTitle(movie));
    });

    results.appendChild(option);
  }
}

function lookForMoviesWhenInput() {
  input.addEventListener('input', debounce(requestApi, 1000));
}

function closeDropdownIfClicksOutside() {
  document.addEventListener('click', e => {
    if (!root.contains(e.target)) closeDropdown();
  });
}

async function requestApiForTitle(title) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '3b88c541',
      i: title.imdbID,
    },
  });
  return response.data;
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
  `;
};
