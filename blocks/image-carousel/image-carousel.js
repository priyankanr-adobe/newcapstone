export default function decorate(block) {
  const rows = [...block.children];
  const slides = rows.map((row) => row.querySelector('picture')).filter(Boolean);
  block.textContent = '';
  const slider = document.createElement('div');
  slider.className = 'image-carousel-slider';
  slides.forEach((pic, i) => {
    const slide = document.createElement('div');
    slide.className = 'image-carousel-slide';
    if (i === 0) slide.classList.add('active');
    slide.append(pic);
    slider.append(slide);
  });
  const controls = document.createElement('div');
  controls.className = 'image-carousel-controls';
  const dots = document.createElement('div');
  dots.className = 'image-carousel-dots';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'image-carousel-dot';
    if (i === 0) dot.classList.add('active');
    dots.append(dot);
  });
  const arrows = document.createElement('div');
  arrows.className = 'image-carousel-arrows';
  const prev = document.createElement('button');
  prev.innerHTML = '←';
  const next = document.createElement('button');
  next.innerHTML = '→';
  arrows.append(prev, next);
  controls.append(dots, arrows);
  block.append(slider, controls);
  const slideEls = [...block.querySelectorAll('.image-carousel-slide')];
  const dotEls = [...block.querySelectorAll('.image-carousel-dot')];
  let index = 0;
  function showSlide(i) {
    slideEls.forEach((s, n) => s.classList.toggle('active', n === i));
    dotEls.forEach((d, n) => d.classList.toggle('active', n === i));
    index = i;
  }
  prev.onclick = () => showSlide(index === 0 ? slideEls.length - 1 : index - 1);
  next.onclick = () => showSlide(index === slideEls.length - 1 ? 0 : index + 1);
  dotEls.forEach((dot, i) => {
    dot.onclick = () => showSlide(i);
  });
}
