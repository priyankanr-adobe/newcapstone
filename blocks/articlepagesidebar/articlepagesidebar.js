export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'articlepagesidebar-wrapper';

  const titleRow = rows.shift();
  const title = document.createElement('div');
  title.className = 'articlepagesidebar-title';
  title.innerHTML = titleRow.innerHTML;
  wrapper.appendChild(title);

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'articlepagesidebar-card';

    const paragraphs = [...row.querySelectorAll('p')];
    const textParts = paragraphs.length
      ? paragraphs.map((p) => p.innerHTML.trim()).filter(Boolean)
      : row.innerHTML.split(/<br\s*\/?>/i).map((part) => part.trim()).filter(Boolean);

    const cardTitle = document.createElement('div');
    cardTitle.className = 'articlepagesidebar-card-title';
    cardTitle.innerHTML = textParts[0] || '';
    card.appendChild(cardTitle);

    if (textParts[1]) {
      const cardDate = document.createElement('div');
      cardDate.className = 'articlepagesidebar-card-date';
      cardDate.innerHTML = textParts[1];
      card.appendChild(cardDate);
    }

    const link = row.querySelector('a');
    if (link) {
      const overlay = document.createElement('a');
      overlay.className = 'articlepagesidebar-card-link';
      overlay.href = link.href;
      overlay.setAttribute('aria-label', link.textContent.trim());
      card.appendChild(overlay);

      const currentPath = window.location.pathname.replace(/\/$/, '');
      const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');

      if (currentPath === linkPath) {
        card.classList.add('active');
      }
    }

    wrapper.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(wrapper);
}
