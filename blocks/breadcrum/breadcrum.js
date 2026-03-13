export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const items = rows.map((row) => row.textContent.trim()).filter(Boolean);
  const links = rows.map((row) => row.querySelector('a'));

  const wrapper = document.createElement('nav');
  wrapper.className = 'breadcrumb-list';
  wrapper.setAttribute('aria-label', 'Breadcrumb');

  rows.forEach((row, index) => {
    const item = document.createElement('span');
    item.className = 'breadcrumb-item';

    const link = links[index];

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      item.appendChild(a);
    } else {
      item.textContent = items[index];
    }

    wrapper.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(wrapper);
}