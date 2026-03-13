export default function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('div');
  nav.className = 'tabscontent-nav';
  const panels = document.createElement('div');
  panels.className = 'tabscontent-panels';
  rows.forEach((row, index) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const label = cols[0].textContent.trim();
    const contentHTML = cols[1].innerHTML;
    const tab = document.createElement('button');
    tab.className = 'tabscontent-tab';
    tab.type = 'button';
    tab.textContent = label;
    if (index === 0) {
      tab.classList.add('active');
    }
    const panel = document.createElement('div');
    panel.className = 'tabscontent-panel';
    if (index !== 0) {
      panel.hidden = true;
    }
    const content = document.createElement('div');
    content.className = 'tabscontent-body';
    content.innerHTML = contentHTML;
    panel.append(content);
    tab.addEventListener('click', () => {
      block.querySelectorAll('.tabscontent-tab').forEach((item) => {
        item.classList.remove('active');
      });
      block.querySelectorAll('.tabscontent-panel').forEach((item) => {
        item.hidden = true;
      });
      tab.classList.add('active');
      panel.hidden = false;
    });
    nav.append(tab);
    panels.append(panel);
  });
  block.textContent = '';
  block.append(nav, panels);
}
