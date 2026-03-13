import { createOptimizedPicture } from '../../scripts/aem.js';
export default function decorate(block) {
  const isMagazine = block.classList.contains('magazine');
  const isTabs = block.classList.contains('tabs');
  const ul = document.createElement('ul');
  const items = [...block.children];
  items.forEach((row) => {
    const li = document.createElement('li');
    // for cards (tabs), read category from 3rd column before moving children
    let category = '';
    if (isTabs && row.children[2]) {
      category = row.children[2].textContent.trim().toLowerCase();
      li.dataset.category = category;
    }
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, index) => {
      // hide 3rd column from display for cards (tabs)
      if (isTabs && index === 2) {
        div.remove();
        return;
      }
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        const title = div.querySelector('h1, h2, h3, h4, h5, h6, a');
        if (title && title.tagName !== 'H3') {
          const h3 = document.createElement('h3');
          h3.innerHTML = title.innerHTML;
          title.replaceWith(h3);
        }
      }
    });
    // Magazine variant
    if (isMagazine) {
      const body = li.querySelector('.cards-card-body');
      const image = li.querySelector('.cards-card-image');
      if (body) {
        const badge = document.createElement('div');
        badge.className = 'magazine-badge';
        badge.innerHTML = '<span>🔒</span>';
        body.prepend(badge);
        if (image) li.appendChild(image);
      }
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) =>
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    )
  );
  block.replaceChildren(ul);
}
