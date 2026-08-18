/* ── IMAGE VIEWER ── */
function openImageView(src){
  const viewer = document.getElementById('imageViewer');
  const img = document.getElementById('imageViewerImg');
  img.src = src;
  viewer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeImageView(){
  const viewer = document.getElementById('imageViewer');
  viewer.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeImageView();
});

/* ── MOBILE MENU ── */
function toggleMenu(){
  const menu = document.getElementById('mobileMenu');
  const btn  = document.querySelector('.hamburger');
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
document.getElementById('mobileMenu').addEventListener('click', function(e){
  if(e.target === this) toggleMenu();
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
},{threshold:0.08});
revealEls.forEach(el => revealObs.observe(el));

/* ── NAV ACTIVE STATE ── */
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');
function updateNav(){
  let current='';
  allSections.forEach(sec=>{
    if(window.scrollY >= sec.offsetTop - 220) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(link=>{
    link.classList.toggle('active', link.getAttribute('href')==='#'+current);
  });
}
window.addEventListener('scroll', updateNav, {passive:true});
updateNav();

/* ── FORM SUBMIT ── */
function handleSubmit(e){
  e.preventDefault();

  const honeypot = document.getElementById('fwebsite');
  if(honeypot.value.trim() !== ''){
    return; // silent — bot detected, no send, no error shown
  }

  const name    = document.getElementById('fname');
  const email   = document.getElementById('femail');
  const subject = document.getElementById('fsubject');
  const message = document.getElementById('fmessage');
  const msg     = document.getElementById('formMsg');
  const btn     = document.getElementById('formBtn');

  [name,email,subject,message].forEach(el=>el.classList.remove('form-error'));
  msg.className='form-msg';

  let valid=true;
  if(!name.value.trim()){name.classList.add('form-error');valid=false;}
  if(!email.value.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
    email.classList.add('form-error');valid=false;
  }
  if(!subject.value.trim()){subject.classList.add('form-error');valid=false;}
  if(!message.value.trim()){message.classList.add('form-error');valid=false;}

  if(!valid){
    msg.textContent='Please fill in all fields correctly.';
    msg.className='form-msg error show';
    return;
  }

  btn.textContent='Sending…';
  btn.disabled=true;

  emailjs.send("service_x6c1am9", "template_mqdgjho", {
    from_name:  name.value.trim(),
    from_email: email.value.trim(),
    subject:    subject.value.trim(),
    message:    message.value.trim()
  })
  .then(()=>{
    btn.textContent='Message Sent ✓';
    btn.style.background='var(--accent3)';
    msg.textContent="Thanks! I'll get back to you soon.";
    msg.className='form-msg show';
    [name,email,subject,message].forEach(el=>el.value='');
    setTimeout(()=>{
      btn.textContent='Send Message →';
      btn.style.background='';
      btn.disabled=false;
      msg.className='form-msg';
    },4000);
  })
  .catch((err)=>{
    btn.textContent='Send Message →';
    btn.disabled=false;
    msg.textContent='Something went wrong. Please try again.';
    msg.className='form-msg error show';
    console.error('EmailJS error:', err);
  });
}

/* ── IMAGE LOADING SKELETON ── */
document.querySelectorAll('.project-img').forEach(img => {
  const wrap = img.closest('.project-img-wrap');
  function markLoaded(){
    img.classList.add('loaded');
    wrap.classList.add('loaded');
  }
  if(img.complete){
    markLoaded();
  } else {
    img.addEventListener('load', markLoaded);
  }
});