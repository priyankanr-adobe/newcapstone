import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
 
/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
 
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);
 
  const root = block.querySelector(':scope > div > div') || block.querySelector(':scope > div');
  if (!root) return;
 
  const columnBlock = root.querySelector('.column');
  if (!columnBlock) return;
 
  const row = columnBlock.querySelector(':scope > div');
  if (!row) return;
 
  const cols = [...row.children];
  if (cols.length >= 3) {
    const socialCol = cols[2];
    const socialItems = [...socialCol.children];
 
    if (socialItems.length > 1) {
      const title = socialItems[0];
      const iconWrap = document.createElement('div');
      iconWrap.className = 'footer-social-icons';
 
      socialItems.slice(1).forEach((item) => iconWrap.appendChild(item));
 
      socialCol.innerHTML = '';
      socialCol.append(title, iconWrap);
    }
  }
 
  const copyItems = [];
  let next = columnBlock.nextElementSibling;
  while (next) {
    const current = next;
    next = next.nextElementSibling;
    copyItems.push(current);
  }
 
  if (copyItems.length) {
    const copyWrap = document.createElement('div');
    copyWrap.className = 'footer-copy';
    copyItems.forEach((item) => copyWrap.appendChild(item));
    root.append(copyWrap);
  }
}
