export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const list = document.createElement('div');
  list.className = 'tripdetails-list';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const labelText = cols[0].textContent.trim().toLowerCase();
    const valueHTML = cols[1].innerHTML;

    if (labelText === 'share this adventure') {
      const share = document.createElement('div');
      share.className = 'tripdetails-share';
      share.innerHTML = cols[0].innerHTML;
      list.append(share);
      return;
    }

    const item = document.createElement('div');
    item.className = 'tripdetails-item';

    const label = document.createElement('div');
    label.className = 'tripdetails-label';
    label.innerHTML = cols[0].innerHTML;

    const value = document.createElement('div');
    value.className = 'tripdetails-value';
    value.innerHTML = valueHTML;

    item.append(label, value);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
