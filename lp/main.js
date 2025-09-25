
// Generic observer to sync image + (optional) copy stack with direction
function setupObserver(stepSelector, imgSelector, options){
  const stepItems = document.querySelectorAll(stepSelector);
  const images = document.querySelectorAll(imgSelector);
  const copies = options?.copySelector ? document.querySelectorAll(options.copySelector) : null;
  if(!stepItems.length || !images.length) return;

  let lastIndex = 0;
  function toggleActive(list, index, dir, role){
    if(!list) return;
    const prev = list[lastIndex];
    const curr = list[index];
    list.forEach(el=>el.classList.remove('active','prep-left','prep-right','leaving-left','leaving-right'));
    if(dir === 'forward'){
      const prepClass = role === 'copy' ? 'prep-left' : 'prep-right';
      const leaveClass = role === 'copy' ? 'leaving-right' : 'leaving-left';
      curr.classList.add(prepClass);
      if(prev) prev.classList.add(leaveClass);
      requestAnimationFrame(()=>{ curr.classList.remove(prepClass); curr.classList.add('active'); });
    } else if(dir === 'back'){
      const prepClass = role === 'copy' ? 'prep-right' : 'prep-left';
      const leaveClass = role === 'copy' ? 'leaving-left' : 'leaving-right';
      curr.classList.add(prepClass);
      if(prev) prev.classList.add(leaveClass);
      requestAnimationFrame(()=>{ curr.classList.remove(prepClass); curr.classList.add('active'); });
    } else {
      curr.classList.add('active');
    }
  }
  function activate(index){
    stepItems.forEach((el,i)=>el.classList.toggle('is-active', i===index));
    const dir = index > lastIndex ? 'forward' : (index < lastIndex ? 'back' : 'none');
    toggleActive(images, index, dir, 'image');
    toggleActive(copies, index, dir, 'copy');
    lastIndex = index;
  }
  activate(0);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = Number(entry.target.getAttribute('data-step-index')) || 0;
        activate(idx);
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

// Desktop
setupObserver(
  '.steps-grid .step-item',
  '.steps-visual .image-stack img',
  { mode: 'desktop', rootMargin: '-40% 0px -40% 0px' }
);
// Mobile (vertical scroll; horizontal transitions for image+copy)
setupObserver(
  '.steps-mobile-vertical .step-item',
  '.steps-mobile-vertical .image-stack img',
  { mode: 'mobile', rootMargin: '-35% 0px -45% 0px', contact: document.querySelector('#contact'),
    copySelector: '.steps-copy-mobile .copy-stack .copy-item'
  }
);

// Form mock submit
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
