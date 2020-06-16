const { debounce } = require('./utils');

const createAutocomplete = ({
  root,
  renderOption,
  inputValue,
  whenSelectedOption,
  whenUserInput,
}) => {
  insertInitialHtml(root);
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const results = root.querySelector('.results');
  const summary = document.querySelector('.summary');

  lookForMoviesAfterTyped();
  closeDropdownIfClikedOutside();

  function lookForMoviesAfterTyped() {
    input.addEventListener('input', debounce(onInput, 1000));
  }
  function closeDropdownIfClikedOutside() {
    document.addEventListener('click', e => {
      if (!root.contains(e.target)) closeDropdown();
    });
  }
  async function onInput(e) {
    const dataFromApi = await whenUserInput(e);

    cleanSummaryUp();
    results.innerHTML = '';

    if (!dataFromApi) {
      closeDropdown();
      return;
    }
    openDropdown();
    showsOptions(dataFromApi);
  }
  function cleanSummaryUp() {
    summary.innerHTML = '';
  }
  function openDropdown() {
    return dropdown.classList.add('is-active');
  }
  function closeDropdown() {
    return dropdown.classList.remove('is-active');
  }
  function showsOptions(responseFromApi) {
    for (const item of responseFromApi) {
      const optionElement = document.createElement('a');

      optionElement.classList.add('dropdown-item');
      optionElement.innerHTML = renderOption(item);

      optionElement.addEventListener('click', async e => {
        closeDropdown();
        input.value = inputValue(item);

        await whenSelectedOption(item);
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
