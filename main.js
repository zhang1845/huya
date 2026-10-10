(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var motionGifs = [
    'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
    'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
    'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
    'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
    'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
    'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
    'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
    'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
    'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
    'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
  ];

  function buildMarquee(track, images) {
    if (!track) return;
    var repeated = images.concat(images, images);
    repeated.forEach(function (src, index) {
      var tile = document.createElement('figure');
      tile.className = 'marquee-tile';
      var image = document.createElement('img');
      image.src = src;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      tile.appendChild(image);
      track.appendChild(tile);
    });
  }

  var firstTrack = document.getElementById('marqueeTrackOne');
  var secondTrack = document.getElementById('marqueeTrackTwo');
  buildMarquee(firstTrack, motionGifs.slice(0, 11));
  buildMarquee(secondTrack, motionGifs.slice(11));

  /* 动态内容改变页面高度后，重新校准带锚点打开的位置。 */
  if (window.location.hash) {
    requestAnimationFrame(function () {
      var anchorTarget = document.querySelector(window.location.hash);
      if (anchorTarget) anchorTarget.scrollIntoView({ behavior: 'auto' });
    });
  }

  document.querySelectorAll('.fade-in').forEach(function (element) {
    var delay = Number(element.getAttribute('data-delay') || 0);
    element.style.setProperty('--fade-delay', delay + 'ms');
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '50px 0px' });

    document.querySelectorAll('.fade-in').forEach(function (element) {
      observer.observe(element);
    });
  } else {
    document.querySelectorAll('.fade-in').forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  var aboutText = document.getElementById('animatedAbout');
  if (aboutText) {
    var content = aboutText.textContent.trim();
    aboutText.textContent = '';
    Array.from(content).forEach(function (character) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = character === ' ' ? '\u00a0' : character;
      aboutText.appendChild(span);
    });
  }

  var magnet = document.querySelector('.magnet');
  var magnetX = 0;
  var magnetY = 0;
  var magnetTargetX = 0;
  var magnetTargetY = 0;
  var magnetActive = false;
  var lookX = 0;
  var lookY = 0;
  var lookTargetX = 0;
  var lookTargetY = 0;

  function updateMagnet() {
    if (!magnet || reduceMotion) return;
    magnetX += (magnetTargetX - magnetX) * (magnetActive ? 0.18 : 0.09);
    magnetY += (magnetTargetY - magnetY) * (magnetActive ? 0.18 : 0.09);
    lookX += (lookTargetX - lookX) * (magnetActive ? 0.12 : 0.07);
    lookY += (lookTargetY - lookY) * (magnetActive ? 0.12 : 0.07);
    magnet.style.setProperty('--magnet-x', magnetX.toFixed(2) + 'px');
    magnet.style.setProperty('--magnet-y', magnetY.toFixed(2) + 'px');
    magnet.style.setProperty('--look-x', lookX.toFixed(2) + 'deg');
    magnet.style.setProperty('--look-y', lookY.toFixed(2) + 'deg');
    requestAnimationFrame(updateMagnet);
  }

  if (magnet && !reduceMotion) {
    document.addEventListener('mousemove', function (event) {
      var rect = magnet.getBoundingClientRect();
      var padding = Number(magnet.getAttribute('data-magnet-padding') || 150);
      var strength = Number(magnet.getAttribute('data-magnet-strength') || 3);
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var withinX = event.clientX >= rect.left - padding && event.clientX <= rect.right + padding;
      var withinY = event.clientY >= rect.top - padding && event.clientY <= rect.bottom + padding;
      magnetActive = withinX && withinY;
      magnetTargetX = magnetActive ? (event.clientX - centerX) / strength : 0;
      magnetTargetY = magnetActive ? (event.clientY - centerY) / strength : 0;
      lookTargetX = magnetActive ? Math.max(-4, Math.min(4, -(event.clientY - centerY) / rect.height * 8)) : 0;
      lookTargetY = magnetActive ? Math.max(-7, Math.min(7, (event.clientX - centerX) / rect.width * 14)) : 0;
    }, { passive: true });
    document.addEventListener('mouseleave', function () {
      magnetActive = false;
      magnetTargetX = 0;
      magnetTargetY = 0;
      lookTargetX = 0;
      lookTargetY = 0;
    });
    requestAnimationFrame(updateMagnet);
  }

  var marqueeSection = document.getElementById('showcase');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  var chars = aboutText ? Array.prototype.slice.call(aboutText.querySelectorAll('.char')) : [];
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function paintScrollEffects() {
    var scrollY = window.scrollY;
    var viewportHeight = window.innerHeight;

    if (reduceMotion) {
      chars.forEach(function (character) { character.style.opacity = '1'; });
      ticking = false;
      return;
    }

    if (marqueeSection && firstTrack && secondTrack) {
      var offset = (scrollY - marqueeSection.offsetTop + viewportHeight) * 0.3;
      firstTrack.style.transform = 'translate3d(' + (offset - 200).toFixed(1) + 'px, 0, 0)';
      secondTrack.style.transform = 'translate3d(' + (-(offset - 200)).toFixed(1) + 'px, 0, 0)';
    }

    if (aboutText && chars.length) {
      var rect = aboutText.getBoundingClientRect();
      var progress = clamp((viewportHeight * 0.8 - rect.top) / (viewportHeight * 0.6 + rect.height), 0, 1);
      chars.forEach(function (character, index) {
        var start = index / chars.length * 0.82;
        var local = clamp((progress - start) / 0.16, 0, 1);
        character.style.opacity = String(0.18 + local * 0.82);
      });
    }

    cards.forEach(function (card, index) {
      var rect = card.getBoundingClientRect();
      var progress = clamp((134 - rect.top) / Math.max(1, rect.height), 0, 1);
      var targetScale = 1 - (cards.length - 1 - index) * 0.03;
      var scale = 1 - (1 - targetScale) * progress;
      card.style.transform = 'scale(' + scale.toFixed(4) + ')';
    });

    ticking = false;
  }

  function requestPaint() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paintScrollEffects);
  }

  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint);
  requestPaint();

  var toast = document.getElementById('toast');
  var toastTimer;
  document.querySelectorAll('[data-toast]').forEach(function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault();
      if (!toast) return;
      toast.textContent = element.getAttribute('data-toast');
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove('is-visible');
      }, 1900);
    });
  });
})();
