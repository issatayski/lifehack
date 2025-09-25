
// Generic setup with direction-aware animations
function setupObserver(stepSelector, imgSelector, options){
  const stepItems = document.querySelectorAll(stepSelector);
  const images = document.querySelectorAll(imgSelector);
  if(!stepItems.length || !images.length) return;

  let lastIndex = 0;
  function activate(index){
    const isMobile = /mobile/i.test(options?.mode || '');

    // Toggle active state
    stepItems.forEach((el,i)=>el.classList.toggle('is-active', i===index));

    // Direction
    const dir = index > lastIndex ? 'forward' : (index < lastIndex ? 'back' : 'none');
    const prevImg = images[lastIndex];
    const currImg = images[index];

    // Reset image classes
    images.forEach(img=>img.classList.remove('active','prep-left','prep-right','leaving-left','leaving-right'));

    // Animate images (top sticky)
    if(dir === 'forward'){
      currImg.classList.add('prep-right');
      if(prevImg) prevImg.classList.add('leaving-left');
      requestAnimationFrame(()=>{
        currImg.classList.remove('prep-right');
        currImg.classList.add('active');
      });
    } else if(dir === 'back'){
      currImg.classList.add('prep-left');
      if(prevImg) prevImg.classList.add('leaving-right');
      requestAnimationFrame(()=>{
        currImg.classList.remove('prep-left');
        currImg.classList.add('active');
      });
    } else {
      currImg.classList.add('active');
    }

    // Animate text (bottom list) inverse to image direction on mobile
    if(isMobile){
      const prevText = stepItems[lastIndex];
      const currText = stepItems[index];
      stepItems.forEach(el=>el.classList.remove('text-active','text-prep-left','text-prep-right','text-leaving-left','text-leaving-right'));

      if(dir === 'forward'){        // image from right -> text from left
        currText.classList.add('text-prep-left');
        if(prevText) prevText.classList.add('text-leaving-right');
        requestAnimationFrame(()=>{
          currText.classList.remove('text-prep-left');
          currText.classList.add('text-active');
        });
      } else if(dir === 'back'){    // image from left -> text from right
        currText.classList.add('text-prep-right');
        if(prevText) prevText.classList.add('text-leaving-left');
        requestAnimationFrame(()=>{
          currText.classList.remove('text-prep-right');
          currText.classList.add('text-active');
        });
      } else {
        currText.classList.add('text-active');
      }
    }

    lastIndex = index;
  }
  activate(0);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = Number(entry.target.getAttribute('data-step-index')) || 0;
        activate(idx);

        // Auto-scroll to contact after last step (mobile only)
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
