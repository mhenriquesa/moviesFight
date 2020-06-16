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

    cleanDropdownUp();

    if (!response) return closeDropdown();

    openDropdown();
    showsOptions(response);
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

  function cleanDropdownUp() {
    results.innerHTML = '';
  }

  function openDropdown() {
    return dropdown.classList.add('is-active');
  }

  function closeDropdown() {
    return dropdown.classList.remove('is-active');
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
  `;
}
module.exports = { createAutocomplete };
