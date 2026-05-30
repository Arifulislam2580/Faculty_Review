const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
      }
    });
  });
}
