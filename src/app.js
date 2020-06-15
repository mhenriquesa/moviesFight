const { fetchData, debounce } = require('./scripts/modules/utils');

insertInitialHtml();

const results = document.querySelector('.results');
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');

const test = input.addEventListener('input', debounce(requestApi, 1000));

function insertInitialHtml() {
  const root = document.querySelector('.autocomplete');
  root.innerHTML = `
  <label><b>Search for a movie</b></label>
  <input type="text" class="input">
  <div class="dropdown">
  <div class="dropdown-menu">
  <div class="dropdown-content results"></div>
  </div>
  </div>
  `;
}

async function requestApi(e) {
  const movies = await fetchData(e.target.value);
  dropdown.classList.add('is-active');

  if (!movies) {
    dropdown.classList.remove('is-active');
    return;
  }
  if (movies === 'Movie not found') {
    results.innerHTML = 'Movie not found :( ';
    return;
  }

  results.innerHTML = '';

  for (const movie of movies) {
    const option = document.createElement('a');

    option.classList.add('dropdown-item');
    option.innerHTML = `
    <img src="${movie.Poster}"/>
    ${movie.Title}
    `;

    results.appendChild(option);
  }
}
