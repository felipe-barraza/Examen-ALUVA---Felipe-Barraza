const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const revealItems = document.querySelectorAll('.reveal');
const backToTop = document.querySelector('.back-to-top');
const progressBar = document.querySelector('.scroll-progress span');
const toast = document.querySelector('.toast');
const quoteButtons = document.querySelectorAll('.product-card button');
const contactEmailLink = document.querySelector('.contact-card a[href^="mailto:"]');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }));
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealItems.forEach(item => {
    if (!item.classList.contains('is-visible')) revealObserver.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window && navLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const updateScrollUI = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 700);
};
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

let toastTimer;
const showToast = message => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
};

quoteButtons.forEach(button => {
  button.addEventListener('click', () => {
    const product = button.dataset.product || 'este producto';
    const subject = encodeURIComponent(`Cotización ALUVA - ${product}`);
    const body = encodeURIComponent(`Hola ALUVA,\n\nMe gustaría solicitar una cotización por: ${product}.\n\nGracias.`);

    if (contactEmailLink) {
      contactEmailLink.href = `mailto:aluva.seguridad@gmail.com?subject=${subject}&body=${body}`;
    }

    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Producto seleccionado: ${product}. El correo quedó preparado para solicitar la cotización.`);
  });
});
