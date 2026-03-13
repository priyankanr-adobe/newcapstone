export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const main = document.createElement('div');
  main.className = 'articlepage-main';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols[0]) {
      main.innerHTML += cols[0].innerHTML;
    }
  });

  const paragraphs = [...main.querySelectorAll('p')];
  const firstBy = paragraphs.find((p) => p.textContent.trim().toUpperCase().startsWith('BY '));
  if (firstBy) {
    firstBy.classList.add('articlepage-author');
  }

  block.textContent = '';
  block.appendChild(main);
}
