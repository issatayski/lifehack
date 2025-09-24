// AOS init
AOS.init({
  duration: 700,
  easing: 'ease-out-quart',
  once: true
});

// Burger & overlay
const burger = document.getElementById('burger');
const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlayClose');
const overlayLinks = document.querySelectorAll('.overlay__link');

function openMenu(){
  overlay.classList.add('active');
  burger.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeMenu(){
  overlay.classList.remove('active');
  burger.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

burger.addEventListener('click', openMenu);
overlayClose.addEventListener('click', closeMenu);
overlayLinks.forEach(l => l.addEventListener('click', closeMenu));

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth anchor scroll (native behavior supported by CSS in modern browsers; fallback here)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const id = this.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Simple slider
const slides = document.getElementById('slides');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let index = 0;

function showSlide(i){
  const total = slides.children.length;
  index = (i + total) % total;
  slides.style.transform = `translateX(-${index * 100}%)`;
}

prev.addEventListener('click', ()=> showSlide(index-1));
next.addEventListener('click', ()=> showSlide(index+1));

// Auto-rotate slides
setInterval(()=> showSlide(index+1), 6000);

// Fake form submit
document.querySelector('.form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
});
