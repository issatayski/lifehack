
// Helper to set up observers for desktop and mobile
function setupObserver(stepSelector, imgSelector, options){
  const stepItems = document.querySelectorAll(stepSelector);
  const images = document.querySelectorAll(imgSelector);
  if(!stepItems.length || !images.length) return;

  function setActive(index){
    stepItems.forEach((el,i)=>el.classList.toggle('is-active', i===index));
    images.forEach((img,i)=>{
      if(i===index){ img.classList.add('active'); }
      else{ img.classList.remove('active'); }
    });
  }
  setActive(0);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = Number(entry.target.getAttribute('data-step-index')) || 0;
        setActive(idx);
      }
    });
  }, { root:null, rootMargin:'-40% 0px -40% 0px', threshold:0 });
  stepItems.forEach(el=>io.observe(el));
}

// Desktop sticky visual switching
setupObserver(
  '.steps-grid .step-item',
  '.steps-visual .image-stack img',
  { mode: 'desktop' }
);




// Form (mock submit)
const form = document.querySelector('#lead-form');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const status = form.querySelector('#form-status');
    submitBtn.disabled = true;
    const old = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем…';
    setTimeout(()=>{
      submitBtn.disabled = false;
      submitBtn.textContent = old;
      status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
      form.reset();
      setTimeout(()=>{ status.textContent=''; }, 5000);
    }, 1000);
  });
}


// Mobile: smooth handoff from hero to first step
(function(){
  const mql = window.matchMedia('(max-width: 767px)');
  const header = document.querySelector('header');
  const stepsSection = document.getElementById('steps');
  const mobileContainer = document.querySelector('.steps-mobile-vertical');
  const hero = document.querySelector('.hero');
  if(!mql.matches || !stepsSection || !mobileContainer) return;

  function setHeaderVar(){
    const hh = header ? Math.round(header.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--header-h', hh + 'px');
  }
  setHeaderVar();
  window.addEventListener('resize', setHeaderVar);
  window.addEventListener('orientationchange', ()=>setTimeout(setHeaderVar, 200));

  let handed = false;
  function onWindowScroll(){
    if(handed) return;
    const hh = header ? header.getBoundingClientRect().height : 0;
    const rect = stepsSection.getBoundingClientRect();
    if(rect.top <= hh + 2){
      handed = true;
      const y = window.scrollY + rect.top - hh - 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // ensure first step inside the inner container
      mobileContainer.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
  window.addEventListener('scroll', onWindowScroll, {passive:true});

  // Reset handoff when hero returns into view (user scrolls back above)
  if(hero){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          handed = false;
        }
      });
    }, { threshold: 0.6 });
    io.observe(hero);
  }
})();

(function(){ const cont=document.querySelector('.steps-mobile-vertical'); const preview=document.querySelector('.mobile-first-visual'); if(cont && preview){ cont.addEventListener('touchstart', ()=>preview.classList.add('hidden'), {passive:true}); }})();


// Mobile simple list in-view animation
(function(){
  const steps = document.querySelectorAll('.steps-mobile-simple .mstep');
  if(!steps.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
      } else {
        // Remove to allow re-animate when scrolling back up
        e.target.classList.remove('in-view');
      }
    });
  }, { root: null, threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
  steps.forEach(s=>io.observe(s));
})();
