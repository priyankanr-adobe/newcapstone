import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
 
// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}
 
function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}
 
/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean|string} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      const button = nav.querySelector('button');
      if (button) button.focus();
    }
  }
}
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}
 
/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
 
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }
 
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}
 
/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
 
  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      const buttonContainer = brandLink.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    }
  }
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
 
  // highlight current nav item like WKND
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  if (navSections) {
    navSections.querySelectorAll('a').forEach((link) => {
      const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
      if (
        currentPath === linkPath
        || (linkPath !== '/' && currentPath.startsWith(linkPath))
      ) {
        link.classList.add('active');
        const parentLi = link.closest('li');
        if (parentLi) parentLi.classList.add('active');
      }
    });
  }
 
  // shrink header on scroll like WKND
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
 
  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
 
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
 
  // inject styles once for top bar and sign in modal
  if (!document.getElementById('wknd-header-dialog-styles')) {
    const style = document.createElement('style');
    style.id = 'wknd-header-dialog-styles';
    style.textContent = `
      .wknd-topbar-real {
        height: 38px;
        background: linear-gradient(90deg, #111, #222);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 90px;
        box-sizing: border-box;
        gap: 12px;
        color: #fff;
        font-family: Arial, sans-serif;
      }
 
      .wknd-topbar-real a,
      .wknd-topbar-real button {
        text-decoration: none;
        border: 0;
        cursor: pointer;
        margin: 0;
        line-height: 1;
      }
 
      .wknd-white-btn {
        background: #fff;
        color: #000 !important;
        padding: 6px 14px;
        border-radius: 2px;
        font-size: 13px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 28px;
        box-sizing: border-box;
      }
 
      .wknd-topbar-real button.wknd-white-btn {
        appearance: none;
      }
 
      .wknd-white-btn:hover {
        background: #f2f2f2;
      }
 
      .wknd-signin-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.28);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 24px;
        box-sizing: border-box;
      }
 
      .wknd-signin-overlay.open {
        display: flex;
      }
 
      .wknd-signin-modal {
        width: 100%;
        max-width: 420px;
        background: linear-gradient(180deg, #1c1c1f, #202022);
        color: #fff;
        box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
        padding: 28px 24px 24px;
        box-sizing: border-box;
        position: relative;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.25s ease;
      }
 
      .wknd-signin-overlay.open .wknd-signin-modal {
        transform: translateY(0);
        opacity: 1;
      }
 
      .wknd-signin-close {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 30px;
        height: 30px;
        border: 0;
        background: transparent;
        color: #fff;
        cursor: pointer;
        font-size: 24px;
        line-height: 1;
      }
 
      .wknd-signin-title {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 34px;
        font-weight: 400;
        line-height: 1.1;
      }
 
      .wknd-signin-line {
        width: 85px;
        height: 4px;
        background: #f5df00;
        margin: 14px 0 24px;
      }
 
      .wknd-signin-subtitle {
        margin: 0 0 18px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 22px;
        font-weight: 400;
        line-height: 1.2;
      }
 
      .wknd-signin-field {
        width: 100%;
        height: 56px;
        border: 1px solid rgba(255, 255, 255, 0.55);
        background: transparent;
        color: #fff;
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 15px;
        margin-bottom: 12px;
        outline: none;
      }
 
      .wknd-signin-field::placeholder {
        color: rgba(255, 255, 255, 0.45);
        text-transform: uppercase;
      }
 
      .wknd-forgot-link {
        display: inline-block;
        margin: 4px 0 18px;
        color: #fff;
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
      }
 
      .wknd-signin-submit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 180px;
        height: 48px;
        background: #f5df00;
        color: #111;
        border: 0;
        cursor: pointer;
        font-size: 16px;
        font-weight: 700;
        text-transform: uppercase;
      }
 
      .wknd-signin-bottom-line {
        margin-top: 18px;
        height: 1px;
        background: rgba(255, 255, 255, 0.22);
      }
 
      @media (max-width: 899px) {
        .wknd-topbar-real {
          padding: 0 20px;
          gap: 10px;
        }
 
        .wknd-white-btn {
          padding: 6px 10px;
          font-size: 12px;
        }
 
        .wknd-signin-modal {
          max-width: 100%;
          padding: 24px 18px 20px;
        }
 
        .wknd-signin-title {
          font-size: 30px;
        }
 
        .wknd-signin-subtitle {
          font-size: 20px;
        }
 
        .wknd-signin-field {
          height: 50px;
        }
 
        .wknd-signin-submit {
          width: 100%;
          min-width: 0;
        }
      }
    `;
    document.head.append(style);
  }
 
  // create real top bar
  const topBar = document.createElement('div');
  topBar.className = 'wknd-topbar-real';
  topBar.innerHTML = `
    <button type="button" class="wknd-signin-trigger wknd-white-btn">SIGN IN</button>
    <a href="/home" class="wknd-lang-link wknd-white-btn">HOME</a>
  `;
 
  // create sign in modal
  const signInOverlay = document.createElement('div');
  signInOverlay.className = 'wknd-signin-overlay';
  signInOverlay.innerHTML = `
    <div class="wknd-signin-modal" role="dialog" aria-modal="true" aria-labelledby="wknd-signin-heading">
      <button type="button" class="wknd-signin-close" aria-label="Close sign in dialog">&times;</button>
      <h2 class="wknd-signin-title" id="wknd-signin-heading">Sign In</h2>
      <div class="wknd-signin-line"></div>
      <p class="wknd-signin-subtitle">Welcome Back</p>
      <form class="wknd-signin-form">
        <input class="wknd-signin-field" type="text" placeholder="USERNAME" aria-label="Username">
        <input class="wknd-signin-field" type="password" placeholder="PASSWORD" aria-label="Password">
        <a href="#" class="wknd-forgot-link">FORGOT YOUR PASSWORD?</a>
        <button type="submit" class="wknd-signin-submit">SIGN IN</button>
      </form>
      <div class="wknd-signin-bottom-line"></div>
    </div>
  `;
  navWrapper.prepend(topBar);
  document.body.append(signInOverlay);
  const signInTrigger = topBar.querySelector('.wknd-signin-trigger');
  const closeBtn = signInOverlay.querySelector('.wknd-signin-close');
  const modal = signInOverlay.querySelector('.wknd-signin-modal');
  const form = signInOverlay.querySelector('.wknd-signin-form');
  const openSignIn = () => {
    signInOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstField = signInOverlay.querySelector('.wknd-signin-field');
    if (firstField) firstField.focus();
  };
  const closeSignIn = () => {
    signInOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (signInTrigger) {
    signInTrigger.addEventListener('click', openSignIn);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSignIn);
  }
  signInOverlay.addEventListener('click', (e) => {
    if (e.target === signInOverlay) closeSignIn();
  });
  if (modal) {
    modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && signInOverlay.classList.contains('open')) {
      closeSignIn();
    }
  });
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeSignIn();
    });
  }
  block.append(navWrapper);
}
 