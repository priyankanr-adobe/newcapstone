export default function decorate(block) {
  const slides = [...block.children];
  let currentSlide = 0;
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-slides';

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    const img = slide.querySelector('picture');
    const text = slide.querySelectorAll('p, h1, h2, h3, a');
    const content = document.createElement('div');
    content.className = 'carousel-content';
    text.forEach((el) => content.appendChild(el));
    slide.append(img, content);
    wrapper.appendChild(slide);
  });

  block.textContent = '';
  block.append(wrapper);

  /* Navigation arrows */
  const nav = document.createElement('div');
  nav.className = 'carousel-navigation';
  const prev = document.createElement('button');
  prev.innerHTML = '&#10094;';
  const next = document.createElement('button');
  next.innerHTML = '&#10095;';
  nav.append(prev, next);
  block.append(nav);

  /* Dots */
  const pagination = document.createElement('div');
  pagination.className = 'carousel-pagination';

  function updateCarousel() {
    slides.forEach((slide, i) => {
      slide.style.display = i === currentSlide ? 'block' : 'none';
    });
    [...pagination.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateCarousel();
    });
    pagination.append(dot);
  });

  block.append(pagination);

  prev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  next.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  });

  updateCarousel();
}
