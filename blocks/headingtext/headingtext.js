export default function decorate(block) {
  const rows = [...block.children];
  if (rows[0]) {
    const title = document.createElement('h2');
    title.textContent = rows[0].textContent;
    rows[0].replaceWith(title);
  }
  if (rows[1]) {
    const text = document.createElement('p');
    text.textContent = rows[1].textContent;
    rows[1].replaceWith(text);
  }
}
