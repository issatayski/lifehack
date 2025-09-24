// AOS init
AOS.init({ duration: 650, easing: 'ease-out-quart', once: true });

// Burger & overlay (robust)
const burger = document.getElementById('burger');
const overlay = document.getElementById('overlay');
const overlayClose = document.getElementById('overlayClose');
const overlayLinks = document.querySelectorAll('.overlay__link');

function lockScroll(lock){
  if(lock){
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
}

function openMenu(){
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden','false');
  burger.setAttribute('aria-expanded','true');
  lockScroll(true);
}
function closeMenu(){
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden','true');
  burger.setAttribute('aria-expanded','false');
  lockScroll(false);
}

burger.addEventListener('click', openMenu);
overlayClose.addEventListener('click', closeMenu);
overlayLinks.forEach(l => l.addEventListener('click', closeMenu));

// Close on Escape and outside click
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && overlay.classList.contains('active')) closeMenu();
});
overlay.addEventListener('click', (e)=>{
  if(e.target === overlay) closeMenu();
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const id = this.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Slider
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
setInterval(()=> showSlide(index+1), 7000);

// Form faux submit
document.querySelector('.form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
});
