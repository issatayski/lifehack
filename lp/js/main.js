
// Helper
function setupObserver(stepSelector, imgSelector, options){
  const stepItems = document.querySelectorAll(stepSelector);
  const images = document.querySelectorAll(imgSelector);
  if(!stepItems.length || !images.length) return;

  let lastIndex = 0;
  function activate(index){
    // toggle item state
    stepItems.forEach((el,i)=>el.classList.toggle('is-active', i===index));

    // direction
    const dir = index > lastIndex ? 'forward' : (index < lastIndex ? 'back' : 'none');
    const prev = images[lastIndex];
    const curr = images[index];

    images.forEach(img=>img.classList.remove('active','prep-left','prep-right','leaving-left','leaving-right'));

    if(dir === 'forward'){
      // prepare current to enter from right
      curr.classList.add('prep-right');
      // previous leaves to left
      if(prev) prev.classList.add('leaving-left');
      // next frame -> activate current (will slide to center)
      requestAnimationFrame(()=>{
        curr.classList.remove('prep-right');
        curr.classList.add('active');
      });
    } else if(dir === 'back'){
      // prepare current to enter from left
      curr.classList.add('prep-left');
      // previous leaves to right
      if(prev) prev.classList.add('leaving-right');
      requestAnimationFrame(()=>{
        curr.classList.remove('prep-left');
        curr.classList.add('active');
      });
    } else {
      curr.classList.add('active');
    }

    lastIndex = index;
  }
  activate(0);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = Number(entry.target.getAttribute('data-step-index')) || 0;
        activate(idx);
        // Auto-scroll to contact after last step (mobile)
        const isMobile = /mobile/i.test(options?.mode || '');
        if(isMobile && idx === stepItems.length-1 && options?.contact){
          const centerLine = window.innerHeight * 0.55;
          const rect = entry.target.getBoundingClientRect();
          if(rect.top < centerLine && rect.bottom > centerLine){
            if(!options._done){
              options._done = true;
              setTimeout(()=> options.contact.scrollIntoView({behavior:'smooth'}), 300);
            }
          }
        }
      }
    });
  }, { root:null, rootMargin: options?.rootMargin || '-40% 0px -40% 0px', threshold:0 });

  stepItems.forEach(el=>io.observe(el));
}

// Desktop sticky visual switching
setupObserver(
  '.steps-grid .step-item',
  '.steps-visual .image-stack img',
  { mode: 'desktop', rootMargin: '-40% 0px -40% 0px' }
);

// Mobile vertical auto-switching
setupObserver(
  '.steps-mobile-vertical .step-item',
  '.steps-mobile-vertical .image-stack img',
  { mode: 'mobile', rootMargin: '-35% 0px -45% 0px', contact: document.querySelector('#contact') }
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
