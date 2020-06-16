const { debounce } = require('./utils');

const createAutocomplete = ({
  rootElement,
  renderOption,
  inputValue,
  actionAfterClickOption,
  actionAfterInput,
}) => {
  insertInitialHtml(rootElement);
  const input = rootElement.querySelector('input');
  const dropdown = rootElement.querySelector('.dropdown');
  const results = rootElement.querySelector('.results');
  const summary = rootElement.querySelector('.summary');

  startSearchAfterType();
  closeDropdownIfClikedOutside();

  function startSearchAfterType() {
    input.addEventListener('input', debounce(onInput, 1000));
  }
  function closeDropdownIfClikedOutside() {
    document.addEventListener('click', e => {
      if (!rootElement.contains(e.target)) closeDropdown();
    });
  }
  async function onInput(e) {
    const response = await actionAfterInput(e);

    cleanSummaryUp();
    cleanDropdownUp();

    if (!response) return closeDropdown();

    openDropdown();
    showsOptions(response);
  }
  function cleanDropdownUp() {
    results.innerHTML = '';
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
  function showsOptions(response) {
    for (const item of response) {
      const optionElement = document.createElement('a');

      optionElement.classList.add('dropdown-item');
      optionElement.innerHTML = renderOption(item);

      optionElement.addEventListener('click', async e => {
        closeDropdown();
        input.value = inputValue(item);

        await actionAfterClickOption(item);
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
