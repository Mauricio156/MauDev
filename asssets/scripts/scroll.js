// Referencias al DOM
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const blurBackground = document.getElementById('blur-background');
const navContainer = document.querySelector('.nav-container');
const header = document.querySelector('header'); // Agregado para ocultar el header
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

let lastScrollTop = 0;

// 1) Toggle menú hamburguesa, blur y bloqueo de scroll
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  blurBackground.classList.toggle('active');
  document.body.classList.toggle('nav-open');
});

// 2) Cerrar menú si se hace click en fondo difuminado
blurBackground.addEventListener('click', () => {
  navToggle.classList.remove('active');
  navMenu.classList.remove('active');
  blurBackground.classList.remove('active');
  document.body.classList.remove('nav-open');
});

// 3) Scroll suave para enlaces de anclaje y cerrar menú en móvil
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (navMenu.classList.contains('active')) {
        navToggle.click();
      }
    }
  });
});

// Función para leer la altura del header desde la variable CSS --header-height
function getHeaderHeight() {
  const rootStyles = getComputedStyle(document.documentElement);
  const value = rootStyles.getPropertyValue('--header-height') || '0px';
  return parseInt(value.trim(), 10);
}

// 4) Evento unificado de scroll:
//    a) Ocultar/mostrar navbar y header según dirección de scroll
//    b) Scroll‑spy para activar el enlace correspondiente
window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop) {
    // Scrolling Down
    header.classList.add('header-hidden');
  } else {
    // Scrolling Up
    header.classList.remove('header-hidden');
  }
  lastScrollTop = st <= 0 ? 0 : st; // Para no pasar de la parte superior

  // Scroll‑spy: Activar enlace correspondiente en el menú
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      navLinks.forEach(link => link.classList.remove('active'));
      if (activeLink) activeLink.classList.add('active');
    }
  });
});
