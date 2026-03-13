export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'authorbio-wrapper';

  const left = document.createElement('div');
  left.className = 'authorbio-left';

  const right = document.createElement('div');
  right.className = 'authorbio-right';

  // first row: image + name + role
  const firstRow = rows[0];
  const image = firstRow.querySelector('img, picture');

  const imageWrap = document.createElement('div');
  imageWrap.className = 'authorbio-image';

  if (image) {
    if (image.tagName.toLowerCase() === 'picture') {
      imageWrap.append(image);
    } else {
      imageWrap.append(image.cloneNode(true));
    }
  }

  const textWrap = document.createElement('div');
  textWrap.className = 'authorbio-text';

  const rowText = firstRow.textContent.trim();
  const lines = rowText.split('\n').map((t) => t.trim()).filter(Boolean);

  const name = document.createElement('div');
  name.className = 'authorbio-name';
  name.textContent = lines[0] || '';

  const role = document.createElement('div');
  role.className = 'authorbio-role';
  role.textContent = lines[1] || '';

  textWrap.append(name, role);
  left.append(imageWrap, textWrap);

  // remaining rows: social names
  const socialBox = document.createElement('div');
  socialBox.className = 'authorbio-social';

  rows.slice(1).forEach((row) => {
    const names = row.textContent
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    names.forEach((nameText) => {
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('aria-label', nameText);

      const icon = document.createElement('img');
      icon.src = `../../icons/${nameText}.svg`;
      icon.alt = nameText;

      link.append(icon);
      socialBox.append(link);
    });
  });

  right.append(socialBox);
  wrapper.append(left, right);

  block.textContent = '';
  block.append(wrapper);
}
