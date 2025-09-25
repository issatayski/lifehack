
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

// Mobile snap-per-step controller
(function(){
  const container = document.querySelector('.steps-mobile-vertical');
  const preview = document.querySelector('.mobile-first-visual');
  // Ensure we start from top to avoid landing on step 2
  if(container) { container.scrollTo({top:0, behavior:'auto'}); }
  if(!container) return;
  const screens = container.querySelectorAll('.step-screen');
  if(!screens.length) return;

  let lastIndex = 0;
  let lastScrollTop = container.scrollTop;

  function setState(currIdx, direction){
    screens.forEach(s => s.classList.remove('enter-left','enter-right','leave-left','leave-right'));
    const prev = screens[lastIndex];
    const curr = screens[currIdx];
    if(direction === 'down'){
      if(prev) prev.classList.add('leave-left');
      if(curr) curr.classList.add('enter-right');
    } else if(direction === 'up'){
      if(prev) prev.classList.add('leave-right');
      if(curr) curr.classList.add('enter-left');
    } else if(curr){
      curr.classList.add('enter-right');
    }
    lastIndex = currIdx;
  }
  setState(0, 'down');
  requestAnimationFrame(()=>{ container.scrollTo({top:0, behavior:'auto'}); });
  setTimeout(()=>{ if(typeof onScroll==='function') onScroll(); }, 60);

  function onScroll(){
    const st = container.scrollTop;
    const direction = st > lastScrollTop ? 'down' : (st < lastScrollTop ? 'up' : 'none');
    lastScrollTop = st;

    // find screen closest to container center
    const center = st + container.clientHeight/2;
    let active = lastIndex;
    let minDist = Infinity;
    screens.forEach((s, i)=>{
      const rectTop = s.offsetTop;
      const rectCenter = rectTop + s.offsetHeight/2;
      const dist = Math.abs(rectCenter - center);
      if(dist < minDist){
        minDist = dist;
        active = i;
      }
    });

    if(active !== lastIndex){
      setState(active, direction);
    }

    // When scrolling down and reaching the end of the last screen, jump to contact
    const contact = document.querySelector('#contact');
    const nearBottom = st + container.clientHeight >= container.scrollHeight - 8;
    if(direction === 'down' && nearBottom && lastIndex === screens.length-1 && contact && !container.dataset.done){
      container.dataset.done = '1';
      setTimeout(()=>{
        contact.scrollIntoView({behavior:'smooth', block:'start'});
        setTimeout(()=>{ container.dataset.done=''; }, 800);
      }, 120);
    }
  }

  container.addEventListener('scroll', (e)=>{ if(preview && container.scrollTop>0) preview.classList.add('hidden'); onScroll(e); }, {passive:true});
  window.addEventListener('resize', ()=>{ setTimeout(onScroll, 150); }, {passive:true});
  window.addEventListener('orientationchange', ()=>{ setTimeout(onScroll, 250); });
})();


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
