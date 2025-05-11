// Referencias al DOM
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const blurBackground = document.getElementById('blur-background');
const navContainer = document.querySelector('.nav-container');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

let lastScrollTop = 0;

function getHeaderHeight() {
  const rootStyles = getComputedStyle(document.documentElement);
  const value = rootStyles.getPropertyValue('--header-height') || '0px';
  return parseInt(value.trim(), 10);
}

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  blurBackground.classList.toggle('active');
  document.body.classList.toggle('nav-open');
});

blurBackground.addEventListener('click', () => {
  navToggle.classList.remove('active');
  navMenu.classList.remove('active');
  blurBackground.classList.remove('active');
  document.body.classList.remove('nav-open');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const offset = getHeaderHeight();

    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      if (navMenu.classList.contains('active')) {
        navToggle.click();
      }
    }
  });
});

window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;

  if (st > 0) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }

  lastScrollTop = st <= 0 ? 0 : st;
});
