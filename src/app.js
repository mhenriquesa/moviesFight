import { createAutocomplete } from './scripts/modules/autocomplete';

const root = document.querySelector('.autocomplete');

createAutocomplete({
  root: root,
  renderOption(item) {
    const imgSrc = item.Poster === 'N/A' ? '' : item.Poster;
    return `<img src="${imgSrc}"/>${item.Title}`;
  },
});
