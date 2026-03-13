export default function decorate(block) {
  const text = block.textContent.trim();
  block.textContent = '';

  const heading = document.createElement('h2');
  heading.className = 'sectiontitle-heading';
  heading.textContent = text;

  block.appendChild(heading);
}
