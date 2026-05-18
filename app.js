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
    home:     document.getElementById('home'),
    story:    document.getElementById('story'),
    profile:  document.getElementById('profile'),
    checkout: document.getElementById('checkout'),
    success:  document.getElementById('success'),
  };
  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    const scroller = screens[name].querySelector('.profile, .checkout, .content');
    if (scroller) scroller.scrollTop = 0;
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

  /* ============ STORY AUDIO + MUTE ============ */
  const audio = document.getElementById('storyAudio');
  const muteBtn = document.getElementById('muteStory');
  let isMuted = false;

  function playStoryAudio() {
    if (!audio) return;
    audio.muted = isMuted;
    audio.currentTime = 0;
    // Play must be triggered from a user gesture (the Wrapped card click)
    // for iOS Safari; .catch() swallows the silent autoplay-blocked rejection.
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
  }
  function stopStoryAudio() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }
  function toggleMute() {
    isMuted = !isMuted;
    if (audio) audio.muted = isMuted;
    muteBtn.classList.toggle('muted', isMuted);
    muteBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
  }
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMute();
  });

  function openStory() {
    idx = 0;
    renderSlide();
    show('story');
    playStoryAudio();
  }
  function closeStory() {
    stopStoryAudio();
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

  /* ============ SUPERFAN CTA → ARTIST PROFILE ============ */
  document.getElementById('becomeSuperfan').addEventListener('click', (e) => {
    e.stopPropagation();
    stopStoryAudio();
    show('profile');
  });

  /* Stop tap zones from swallowing CTAs on story slides */
  document.querySelectorAll('.cta-superfan, .share-btn, .story-chrome').forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });

  /* ============ SHARE BUTTON (native share sheet) ============ */
  const shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const data = {
        title: 'My 2026 Wrapped',
        text: "I'm in the top 1% of Playboi Carti's fans this year. Check out my Spotify Wrapped 2026.",
        url: window.location.href
      };
      try {
        if (navigator.share) {
          // Native sheet: TikTok, Instagram, WhatsApp, Messages, etc.
          await navigator.share(data);
        } else if (navigator.clipboard) {
          // Desktop fallback: copy link
          await navigator.clipboard.writeText(data.url);
          shareBtn.textContent = 'Link copied!';
          setTimeout(() => { shareBtn.textContent = 'Share this story'; }, 1800);
        }
      } catch (_) { /* user cancelled the share sheet */ }
    });
  }

  /* ============ PROFILE FEED → CHECKOUT ============ */
  document.querySelectorAll('.post-locked__cta, .post-locked').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      show('checkout');
    });
  });

  /* ============ CHECKOUT → SUCCESS ============ */
  document.getElementById('goSuccess').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.style.opacity = '.7';
    const html = btn.innerHTML;
    btn.textContent = 'Processing payment…';
    setTimeout(() => {
      btn.style.opacity = '';
      btn.innerHTML = html;
      show('success');
    }, 800);
  });

  /* ============ BACK BUTTONS ============ */
  document.getElementById('backFromProfile').addEventListener('click', () => show('home'));
  document.getElementById('backFromCheckout').addEventListener('click', () => show('profile'));
  document.getElementById('backHome').addEventListener('click', () => show('home'));

})();
