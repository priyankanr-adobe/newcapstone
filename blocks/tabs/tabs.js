export default function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('ul');
 
  const cardsBlock = document.querySelector('.cards.tabs');
 
  rows.forEach((row) => {
    const cols = [...row.children];
    if (!cols.length) return;
 
    const title = cols[0].textContent.trim();
    const filter = title.toLowerCase();
 
    const li = document.createElement('li');
    const a = document.createElement('a');
 
    a.href = '#';
    a.textContent = title;
 
    a.addEventListener('click', (e) => {
      e.preventDefault();
 
      block.querySelectorAll('a').forEach((tab) => tab.classList.remove('active'));
      a.classList.add('active');
 
      if (!cardsBlock) return;
 
      const cards = cardsBlock.querySelectorAll('ul > li');
 
      cards.forEach((card) => {
        const category = (card.dataset.category || '').toLowerCase();
 
        if (filter === 'all' || category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
 
    li.append(a);
    nav.append(li);
  });
 
  block.textContent = '';
  block.append(nav);
}
