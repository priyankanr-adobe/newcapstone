export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const textRow = rows[1];

  const wrapper = document.createElement('div');
  wrapper.className = 'imagecopy-wrapper';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'imagecopy-image';
  imageWrap.append(...imageRow.children);

  const textWrap = document.createElement('div');
  textWrap.className = 'imagecopy-text';
  textWrap.append(...textRow.children);

  wrapper.append(imageWrap, textWrap);
  block.textContent = '';
  block.appendChild(wrapper);
}
