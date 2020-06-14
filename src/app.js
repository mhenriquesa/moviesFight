const { fetchData, debounce } = require('./scripts/modules/utils');

insertInitialHtml();

const resultsWrapper = document.getElementsByClassName('results');
const input = document.querySelector('input');

input.addEventListener('input', debounce(requestApi, 1000));

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
  console.log(movies);
}
