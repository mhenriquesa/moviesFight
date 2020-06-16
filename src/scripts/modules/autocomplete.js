const { debounce } = require('./utils');

const createAutocomplete = ({ root, renderOption, inputValue, whenSelectedOption }) => {
  insertInitialHtml(root);
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
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

      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);

      option.addEventListener('click', async e => {
        closeDropdown();
        input.value = inputValue(item);

        whenSelectedOption(item);
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
