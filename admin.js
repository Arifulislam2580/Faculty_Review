const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard');
const showsSection = document.getElementById('shows');
const sponsorsSection = document.getElementById('sponsors');
const inquiriesSection = document.getElementById('inquiries');

function showSection(sectionId) {
  document.querySelectorAll('.admin-section, .admin-dashboard').forEach((section) => {
    section.classList.add('hidden');
  });

  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  if (username === 'admin' && password === 'password') {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    showsSection.classList.remove('hidden');
    sponsorsSection.classList.remove('hidden');
    inquiriesSection.classList.remove('hidden');
  } else {
    alert('Invalid credentials. Use admin / password for this demo.');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.admin-nav a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement && target.hash) {
        event.preventDefault();
        const sectionId = target.hash.replace('#', '');
        showSection(sectionId);
      }
    });
  });
});
