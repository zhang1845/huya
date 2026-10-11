(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var huyaShowcaseImages = [
    'assets/showcase/huya-showcase-01.jpg',
    'assets/showcase/huya-showcase-02.jpg',
    'assets/showcase/huya-showcase-03.jpg',
    'assets/showcase/huya-showcase-04.jpg',
    'assets/showcase/huya-showcase-05.jpg',
    'assets/showcase/huya-showcase-06.jpg',
    'assets/showcase/huya-showcase-07.jpg',
    'assets/showcase/huya-showcase-08.jpg',
    'assets/showcase/huya-showcase-09.jpg',
    'assets/showcase/huya-showcase-10.jpg',
    'assets/showcase/huya-showcase-11.jpg',
    'assets/showcase/huya-showcase-12.jpg',
    'assets/showcase/huya-showcase-13.jpg',
    'assets/showcase/huya-showcase-14.jpg',
    'assets/showcase/huya-showcase-15.jpg',
    'assets/showcase/huya-showcase-16.jpg',
    'assets/showcase/huya-showcase-17.jpg',
    'assets/showcase/huya-showcase-18.jpg',
    'assets/showcase/huya-showcase-19.jpg',
    'assets/showcase/huya-showcase-20.jpg',
    'assets/showcase/huya-showcase-21.jpg'
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
  buildMarquee(firstTrack, huyaShowcaseImages.slice(0, 11));
  buildMarquee(secondTrack, huyaShowcaseImages.slice(11));

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
  var marqueeScrollOffset = 0;
  var marqueeAutoOffset = 0;
  var marqueeLastFrame = 0;
  var marqueeSpeed = 24;

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
      marqueeScrollOffset = (scrollY - marqueeSection.offsetTop + viewportHeight) * 0.3 - 200;
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

  function wrapMarqueeOffset(value, width) {
    return ((value % width) + width) % width - width;
  }

  function animateMarquee(timestamp) {
    if (!reduceMotion && firstTrack && secondTrack) {
      if (!marqueeLastFrame) marqueeLastFrame = timestamp;
      var elapsed = Math.min(timestamp - marqueeLastFrame, 64);
      marqueeLastFrame = timestamp;
      marqueeAutoOffset += elapsed * marqueeSpeed / 1000;

      var firstCycleWidth = firstTrack.scrollWidth / 3;
      var secondCycleWidth = secondTrack.scrollWidth / 3;
      var firstX = wrapMarqueeOffset(marqueeAutoOffset + marqueeScrollOffset, firstCycleWidth);
      var secondX = wrapMarqueeOffset(-marqueeAutoOffset - marqueeScrollOffset, secondCycleWidth);

      firstTrack.style.transform = 'translate3d(' + firstX.toFixed(1) + 'px, 0, 0)';
      secondTrack.style.transform = 'translate3d(' + secondX.toFixed(1) + 'px, 0, 0)';
    }
    requestAnimationFrame(animateMarquee);
  }

  requestAnimationFrame(animateMarquee);

  var hostCarousel = document.getElementById('hostCarousel');
  var hostTrack = document.getElementById('hostTrack');
  var hostCards = hostTrack ? Array.prototype.slice.call(hostTrack.querySelectorAll('.host-card')) : [];
  var hostIndex = 0;
  var hostTimer;
  var hostPointerStart = 0;
  var hostDidSwipe = false;

  function paintHostCarousel() {
    var total = hostCards.length;
    hostCards.forEach(function (card, index) {
      var distance = (index - hostIndex + total) % total;
      if (distance > total / 2) distance -= total;
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-prev-2', 'is-next-2');
      if (distance === 0) card.classList.add('is-active');
      if (distance === -1) card.classList.add('is-prev');
      if (distance === 1) card.classList.add('is-next');
      if (distance === -2) card.classList.add('is-prev-2');
      if (distance === 2) card.classList.add('is-next-2');
      card.setAttribute('aria-hidden', distance === 0 ? 'false' : 'true');
    });
  }

  function moveHosts(direction) {
    if (!hostCards.length) return;
    hostIndex = (hostIndex + direction + hostCards.length) % hostCards.length;
    paintHostCarousel();
  }

  function stopHostAutoplay() {
    clearInterval(hostTimer);
  }

  function startHostAutoplay() {
    stopHostAutoplay();
    if (!reduceMotion && hostCards.length) hostTimer = setInterval(function () {
      moveHosts(1);
    }, 1500);
  }

  if (hostCarousel && hostTrack) {
    paintHostCarousel();
    hostCarousel.addEventListener('focusin', stopHostAutoplay);
    hostCarousel.addEventListener('focusout', startHostAutoplay);
    hostCarousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') moveHosts(-1);
      if (event.key === 'ArrowRight') moveHosts(1);
    });
    hostCarousel.addEventListener('pointerdown', function (event) {
      hostPointerStart = event.clientX;
      hostDidSwipe = false;
    });
    hostCarousel.addEventListener('pointerup', function (event) {
      var distance = event.clientX - hostPointerStart;
      if (Math.abs(distance) < 45) return;
      hostDidSwipe = true;
      moveHosts(distance < 0 ? 1 : -1);
      startHostAutoplay();
    });
    hostTrack.addEventListener('click', function (event) {
      if (hostDidSwipe) {
        hostDidSwipe = false;
        return;
      }
      var clickedCard = event.target.closest('.host-card');
      if (!clickedCard) return;
      var direction = 0;
      if (clickedCard.classList.contains('is-prev') || clickedCard.classList.contains('is-prev-2')) {
        direction = -1;
      } else if (clickedCard.classList.contains('is-next') || clickedCard.classList.contains('is-next-2')) {
        direction = 1;
      } else if (clickedCard.classList.contains('is-active')) {
        var cardRect = clickedCard.getBoundingClientRect();
        direction = event.clientX < cardRect.left + cardRect.width / 2 ? -1 : 1;
      }
      if (!direction) return;
      moveHosts(direction);
      startHostAutoplay();
    });
    startHostAutoplay();
  }

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
