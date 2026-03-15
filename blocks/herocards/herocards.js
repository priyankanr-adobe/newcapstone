export default function decorate(block) {
  // Find the image and the text content
  const image = block.querySelector('picture');
  const content = block.querySelectorAll('div > p, div > h2, div > h3, div > a');

  // Clear the block
  block.innerHTML = '';

  // Rebuild structure
  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'hero-card-inner';

  // Add Image
  if (image) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'hero-image';
    imgWrapper.appendChild(image);
    heroWrapper.appendChild(imgWrapper);
  }

  // Add Content
  const bodyWrapper = document.createElement('div');
  bodyWrapper.className = 'hero-body';
  content.forEach((el) => {
    bodyWrapper.appendChild(el);
  });

  heroWrapper.appendChild(bodyWrapper);
  block.appendChild(heroWrapper);
}
