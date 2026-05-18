(function () {
  'use strict';

  /* ============ DYNAMIC VIEWPORT HEIGHT ============ */
  function setAppHeight() {
    const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    document.documentElement.style.setProperty('--app-h', h + 'px');
  }
  setAppHeight();
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', setAppHeight);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setAppHeight);
  }

  /* ============ SCREENS ============ */
  const screens = {
    home:    document.getElementById('home'),
    story:   document.getElementById('story'),
    success: document.getElementById('success'),
  };
  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  /* ============ STORY NAVIGATION ============ */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const bars   = Array.from(document.querySelectorAll('.story-progress .bar'));
  let idx = 0;

  function renderSlide() {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    bars.forEach((b, i) => {
      b.classList.remove('active', 'done');
      if (i < idx) b.classList.add('done');
      else if (i === idx) b.classList.add('active');
    });
  }

  function nextSlide() {
    if (idx < slides.length - 1) { idx++; renderSlide(); }
  }
  function prevSlide() {
    if (idx > 0) { idx--; renderSlide(); }
  }

  function openStory() {
    idx = 0;
    renderSlide();
    show('story');
  }
  function closeStory() {
    show('home');
  }

  document.getElementById('openWrapped').addEventListener('click', openStory);
  document.getElementById('closeStory').addEventListener('click', closeStory);
  document.getElementById('tapNext').addEventListener('click', nextSlide);
  document.getElementById('tapPrev').addEventListener('click', prevSlide);

  /* Keyboard nav for desktop preview */
  window.addEventListener('keydown', (e) => {
    if (!screens.story.classList.contains('active')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'Escape') closeStory();
  });

  /* ============ SUPERFAN CTA ============ */
  document.getElementById('becomeSuperfan').addEventListener('click', (e) => {
    e.stopPropagation();
    show('success');
  });

  /* Stop tap zones from swallowing the SuperFan CTA click */
  document.querySelectorAll('.cta-superfan, .share-btn, .story-chrome').forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });

  document.getElementById('backHome').addEventListener('click', () => show('home'));

})();
