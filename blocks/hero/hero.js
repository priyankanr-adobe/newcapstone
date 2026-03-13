export default function decorate(block) {

  const row = block.querySelector(':scope > div');
  const cols = [...row.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';

  cols.forEach((col) => {
    const div = document.createElement('div');
    div.className = 'hero-col';
    div.append(...col.children);
    wrapper.append(div);
  });

  block.textContent = '';
  block.append(wrapper);

}