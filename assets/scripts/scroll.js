// Referencias al DOM
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const blurBackground = document.getElementById('blur-background');
const navContainer = document.querySelector('.nav-container');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

let lastScrollTop = 0;

// Función para leer la altura del header desde la variable CSS --header-height
function getHeaderHeight() {
  const rootStyles = getComputedStyle(document.documentElement);
  const value = rootStyles.getPropertyValue('--header-height') || '0px';
  return parseInt(value.trim(), 10);
}

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

// 4) Evento unificado de scroll
window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;

  // a) Ocultar el header hasta que vuelva al tope
  if (st > 0) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }

  lastScrollTop = st <= 0 ? 0 : st;

  // b) Scroll-spy activado
  sections.forEach(section => {
    const sectionTop = section.offsetTop - getHeaderHeight();
    const sectionHeight = section.offsetHeight;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (activeLink && !activeLink.classList.contains('active')) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
      }
    }
  });
});

// 5) Animación que sigue el mouse en el fondo difuminado
blurBackground.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const x = (clientX / window.innerWidth) * 100;
  const y = (clientY / window.innerHeight) * 100;
  blurBackground.style.backgroundPosition = `${x}% ${y}%`;
}
);
