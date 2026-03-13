export default function decorate(block) {
  const rows = [...block.children]; 
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const item = document.createElement('div');
    item.className = 'faq-item';
    const question = document.createElement('button');
    question.className = 'faq-question';
    question.innerHTML = `
      <span class="faq-question-text">${cols[0].textContent}</span>
      <span class="faq-icon">+</span>
    `;
    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.innerHTML = cols[1].innerHTML;
    answer.style.display = 'none';
    question.addEventListener('click', () => {
      const isOpen = answer.style.display === 'block';
      answer.style.display = isOpen ? 'none' : 'block';
      question.querySelector('.faq-icon').textContent = isOpen ? '+' : '−';
    });
    item.append(question, answer);
    block.append(item);
    row.remove(); // Remove original table row
  });
}
