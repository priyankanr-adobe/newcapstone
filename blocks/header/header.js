import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
 
const isDesktop = window.matchMedia('(min-width: 900px)');
 
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections
    .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}
 
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
 
  const button = nav.querySelector('.nav-hamburger button');
 
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
 
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
 
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? 'false' : 'true',
  );
 
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
}
 
export default async function decorate(block) {
  /* =====================
     LOAD NAV FRAGMENT
  ====================== */
 
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
 
  block.textContent = '';
 
  const nav = document.createElement('nav');
  nav.id = 'nav';
 
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }
 
  /* =====================
     ADD SECTION CLASSES
  ====================== */
 
  const classes = ['brand', 'sections', 'tools'];
 
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });
 
  /* =====================
     NAV SECTIONS
  ====================== */
 
  const navSections = nav.querySelector('.nav-sections');
 
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')) {
          navSection.classList.add('nav-drop');
        }
 
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
 
            toggleAllNavSections(navSections);
 
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });
  }
 
  /* =====================
     HAMBURGER
  ====================== */
 
  const hamburger = document.createElement('div');
 
  hamburger.classList.add('nav-hamburger');
 
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;
 
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
 
  nav.prepend(hamburger);
 
  nav.setAttribute('aria-expanded', 'false');
 
  toggleMenu(nav, navSections, isDesktop.matches);
 
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
 
  /* =====================
     NAV WRAPPER
  ====================== */
 
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
 
  navWrapper.append(nav);
 
  block.append(navWrapper);
  /* SIGN IN MODAL */
 
  /* =====================
   SIGN IN MODAL
===================== */
 
  const signInLink = nav.querySelector('.nav-brand a');
 
  if (signInLink) {
    signInLink.addEventListener('click', (e) => {
      e.preventDefault();
 
      let modal = document.querySelector('.signin-modal');
 
      if (!modal) {
        modal = document.createElement('div');
        modal.className = 'signin-modal';
 
        modal.innerHTML = `
        <div class="signin-box">
          <h2>Sign In</h2>
          <p class="welcome">Welcome Back</p>
 
          <input type="text" placeholder="USERNAME">
          <input type="password" placeholder="PASSWORD">
 
          <p class="forgot">FORGOT YOUR PASSWORD?</p>
 
          <button class="signin-btn">SIGN IN</button>
        </div>
      `;
 
        document.body.append(modal);
 
        modal.addEventListener('click', (event) => {
          if (event.target === modal) {
            modal.remove();
          }
        });
      }
    });
  }
  const currentPath = window.location.pathname;
 
  nav.querySelectorAll('.nav-tools ul li a').forEach((link) => {
    const linkPath = new URL(link.href).pathname;
 
    if (currentPath.startsWith(linkPath)) {
      link.classList.add('active');
    }
  });
  /* =====================
     SCROLL SHRINK EFFECT
  ====================== */
 
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}
