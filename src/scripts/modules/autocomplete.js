const { debounce } = require('./utils');
const { requestApi } = require('./requester');

const createAutocomplete = ({ root, renderOption, inputValue, whenSelectedOption }) => {
  insertInitialHtml(root);
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const results = root.querySelector('.results');

  input.addEventListener('input', debounce(onInput, 1000));

  document.addEventListener('click', e => {
    if (!root.contains(e.target)) closeDropdown();
  });

  async function onInput(e) {
    const responseFromApi = await requestApi('http://www.omdbapi.com/', {
      apikey: '3b88c541',
      s: e.target.value,
    });
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
      const optionElement = document.createElement('a');

      optionElement.classList.add('dropdown-item');
      optionElement.innerHTML = renderOption(item);

      optionElement.addEventListener('click', async e => {
        closeDropdown();
        input.value = inputValue(item);

        whenSelectedOption(item);
      });
      results.appendChild(optionElement);
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
module.exports = { createAutocomplete };
