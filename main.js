/* ============================================================
   虎牙直播落地页 - 模块1：导航交互
   - 滚动毛玻璃（ScrollTrigger 统一调度，不直接绑 scroll）
   - 当前区块导航高亮
   - 移动端抽屉菜单
   - data-toast 轻提示
   ============================================================ */
(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  var nav = document.getElementById('hyNav');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 滚动超过 50px 加毛玻璃 ---------- */
  ScrollTrigger.create({
    start: 50,
    end: 'max',
    onToggle: function (self) {
      nav.classList.toggle('is-scrolled', self.isActive);
    }
  });

  /* ---------- 2. 当前区块导航高亮 ---------- */
  var spyLinks = {};
  document.querySelectorAll('.hy-nav-link').forEach(function (link) {
    var key = link.getAttribute('data-spy');
    if (key) spyLinks[key] = link;
  });

  function setActive(key) {
    Object.keys(spyLinks).forEach(function (k) {
      spyLinks[k].classList.toggle('is-active', k === key);
    });
  }

  document.querySelectorAll('[data-spy-target]').forEach(function (section) {
    var key = section.getAttribute('data-spy-target');
    if (!spyLinks[key]) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: function (self) {
        if (self.isActive) setActive(key);
      }
    });
  });

  /* ---------- 3. 移动端抽屉菜单 ---------- */
  var burger = document.getElementById('hyBurger');
  var mobileMenu = document.getElementById('hyMobileMenu');
  var mask = document.getElementById('hyMask');
  var closeBtn = document.getElementById('hyMobileClose');
  var body = document.body;

  function lockScroll(on) {
    body.style.overflow = on ? 'hidden' : '';
  }

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mask.hidden = false;
    // 触发过渡
    requestAnimationFrame(function () {
      mask.classList.add('is-show');
    });
    lockScroll(true);
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mask.classList.remove('is-show');
    lockScroll(false);
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      mask.hidden = true;
    }, 320);
  }

  burger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  mask.addEventListener('click', closeMenu);

  // 移动端点锚点后自动关闭
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Esc 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ---------- 4. data-toast 轻提示（占位交互） ---------- */
  var toast = document.getElementById('hyToast');
  var toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-show');
    }, 2000);
  }

  document.querySelectorAll('[data-toast]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showToast(el.getAttribute('data-toast'));
    });
  });

  /* ---------- 5. Hero 入场动画 + 滚动视差 ---------- */
  var heroInner = document.querySelector('.hy-hero-inner');
  if (heroInner && !reduceMotion) {
    // 入场：标题 → 副标题 → 按钮，依次从下方淡入上移，间隔 0.2s
    var heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    heroTl
      .from('.hy-hero-title',   { y: 44, opacity: 0, duration: 0.9 })
      .from('.hy-hero-sub',     { y: 34, opacity: 0, duration: 0.8 }, '-=0.7')
      .from('.hy-hero-actions', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6');

    // 滚出：内容轻微上移（保留可见性，返回首页时状态更稳定）
    gsap.to('.hy-hero-inner', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ---------- 6. 热门分类入场动画 ---------- */
  var catCards = document.querySelectorAll('.hy-cat-card');
  if (catCards.length && !reduceMotion) {
    gsap.from(catCards, {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '#category',
        start: 'top 78%'
      }
    });
  }

  /* ---------- 7. 人气主播 Swiper 轮播 ---------- */
  if (typeof Swiper !== 'undefined' && document.querySelector('.hy-hosts-swiper')) {
    new Swiper('.hy-hosts-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: { delay: 4000, disableOnInteraction: false },
      navigation: {
        nextEl: '.hy-hosts-swiper .swiper-button-next',
        prevEl: '.hy-hosts-swiper .swiper-button-prev'
      },
      pagination: {
        el: '.hy-hosts-swiper .swiper-pagination',
        clickable: true
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        900: { slidesPerView: 2 },
        1280: { slidesPerView: 3 }
      }
    });
  }

  /* ---------- 8. 赛事中心 ---------- */
  // 正在直播 Swiper
  if (typeof Swiper !== 'undefined' && document.querySelector('.hy-esport-swiper')) {
    new Swiper('.hy-esport-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: {
        el: '.hy-esport-swiper .swiper-pagination',
        clickable: true
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        900: { slidesPerView: 2 },
        1280: { slidesPerView: 2 }
      }
    });
  }

  // "提醒我" 按钮切换为 "已设置"
  document.querySelectorAll('.hy-remind-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-set')) return;
      btn.classList.add('is-set');
      btn.textContent = '已设置 ✓';
    });
  });

  // 子区块依次 fade-up
  if (!reduceMotion) {
    gsap.from('.hy-esports-live, .hy-esports-upcoming, .hy-league-wall, .hy-highlights', {
      y: 44,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#esports',
        start: 'top 75%'
      }
    });
  }

  /* ---------- 9. 主播入驻：步骤从左到右滑入 ---------- */
  if (!reduceMotion) {
    gsap.from('.hy-step', {
      x: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.15,
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '#join',
        start: 'top 78%'
      }
    });

    gsap.from('.hy-benefit-card', {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.hy-benefit-grid',
        start: 'top 85%'
      }
    });

    gsap.from('.hy-success-card', {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.hy-success-grid',
        start: 'top 85%'
      }
    });

    gsap.from('.hy-join-cta', {
      y: 28,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.hy-join-cta',
        start: 'top 90%'
      }
    });
  }

  /* ---------- 10. 平台数据：数字从 0 滚动到目标值 ---------- */
  var statEls = document.querySelectorAll('.hy-stat-value');
  if (statEls.length) {
    if (reduceMotion) {
      // 减弱动效：直接显示终值
      statEls.forEach(function (el) {
        el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
      });
    } else {
      statEls.forEach(function (el, i) {
        var target = parseFloat(el.getAttribute('data-target')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: '.hy-stats',
            start: 'top 75%'
          },
          onUpdate: function () {
            el.textContent = Math.floor(counter.val) + suffix;
          }
        });
      });
    }
  }

  /* ---------- 11. 关于我们：时间轴从左滑入 + 子区块 fade-up ---------- */
  if (!reduceMotion) {
    gsap.from('.hy-timeline-item', {
      x: -40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.hy-timeline',
        start: 'top 80%'
      }
    });

    gsap.from('.hy-about-intro, .hy-press-card, .hy-contact-item', {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%'
      }
    });
  }

  /* ---------- 12. 下载桌面：核心内容依次进入 ---------- */
  if (!reduceMotion) {
    gsap.from('.hy-download-intro, .hy-download-showcase, .hy-download-perks', {
      y: 44,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '#download',
        start: 'top 75%'
      }
    });
  }

  /* ---------- reduced-motion 提示（模块2起入场动画据此关闭） ---------- */
  window.__HY_REDUCED_MOTION__ = reduceMotion;
})();

/* ============================================================
   新首页首屏：星空、响应式设计画布与 37 张卡片的 3D 圆柱环
   ============================================================ */
(function () {
  'use strict';

  var stage = document.querySelector('.hy-vision-stage');
  var canvas = document.getElementById('hyVisionCanvas');
  var ring = document.getElementById('hyVisionRing');
  if (!stage || !canvas || !ring) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isPhone = function () { return window.innerWidth <= 700; };

  /* 可复现的星点分布，避免刷新时整个背景闪动。 */
  function seededRandom(seed) {
    var value = seed >>> 0;
    return function () {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function paintStars(id, count, blur, minAlpha, maxAlpha, seed) {
    var el = document.getElementById(id);
    if (!el) return;
    var random = seededRandom(seed);
    var shadows = [];
    for (var i = 0; i < count; i += 1) {
      var x = (random() * 100).toFixed(2);
      var y = (random() * 100).toFixed(2);
      var alpha = (minAlpha + random() * (maxAlpha - minAlpha)).toFixed(2);
      shadows.push(x + 'vw ' + y + 'vh ' + blur + 'px 0 rgba(255,255,255,' + alpha + ')');
    }
    el.style.boxShadow = shadows.join(',');
  }

  paintStars('hyVisionStarsA', 150, 0, 0.05, 0.3, 1845);
  paintStars('hyVisionStarsB', 18, 1.2, 0.35, 0.7, 2026);

  var base = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
  var shots = [
    ['hf_20260912_110422_0fc34393-7417-41b0-a200-43fd2b08a37f.png', '英雄集结', 'MOBA · 86万在线'],
    ['hf_20260912_110423_ba46182e-43bc-43a8-9007-a8234acf442d.png', '巅峰王者', '手游 · 102万在线'],
    ['hf_20260912_110423_06cfbb84-6f96-48f6-be45-e03516510e48.png', '和平战场', '竞技 · 78万在线'],
    ['hf_20260912_110422_634bf390-f171-4f5d-9151-0d2c86c26e7b.png', '星海远征', '开放世界 · 54万在线'],
    ['hf_20260912_110423_0cfe058d-db0e-4ee6-9708-7a297cc11a7a.png', '高能时刻', '赛事精选'],
    ['hf_20260912_110422_a90a35d7-ae20-4ce3-86d7-e3f6f658a6bc.png', '一起开黑', '好友组队'],
    ['hf_20260912_110422_de267714-7647-4d9a-a0a9-55325683b2a2.png', '人气主播', '正在直播'],
    ['hf_20260912_110504_80eda275-e380-4ccb-b51f-332f25337079.png', '赛场直击', '官方赛事'],
    ['hf_20260912_110422_d6ba08f5-4ff8-4f09-8abe-93ee6bb0e34e.png', '娱乐现场', '音乐 · 户外'],
    ['hf_20260912_110423_87ec2115-3157-47ef-ac98-973f8ad6532d.png', '热爱不止', 'HUYA LIVE']
  ];

  var cardCount = 37;
  var radius = 891;
  var step = 360 / cardCount;
  var cullAngle = 42;
  var cards = [];

  for (var index = 0; index < cardCount; index += 1) {
    var data = shots[index % shots.length];
    var card = document.createElement('div');
    card.className = 'hy-vision-card';
    card.innerHTML = '<img alt="" src="' + base + data[0] + '">' +
      '<b>' + data[1] + '</b><small>' + data[2] + '</small>';
    var image = card.querySelector('img');
    image.addEventListener('error', (function (currentCard) {
      return function () { currentCard.classList.add('is-broken'); };
    })(card));
    ring.appendChild(card);
    cards.push(card);
  }

  var phase = -2;
  var last = performance.now();
  var stageVisible = true;

  function placeCards() {
    cards.forEach(function (card, index) {
      /* R=891、步长=360/37，视角外超过 42° 的卡片直接裁掉。 */
      var angle = ((index * step + phase) % 360 + 540) % 360 - 180;
      if (Math.abs(angle) > cullAngle) {
        card.style.visibility = 'hidden';
        return;
      }
      card.style.visibility = 'visible';
      var radians = angle * Math.PI / 180;
      var cosine = Math.cos(radians);
      card.style.transform = 'translate3d(' + (radius * Math.sin(radians)).toFixed(2) + 'px,0,' +
        (radius * (1 - cosine)).toFixed(2) + 'px) rotateY(' + (-angle).toFixed(2) + 'deg)';
      card.style.filter = 'brightness(' + (0.84 + 0.5 * (1 / cosine - 1)).toFixed(3) + ')';
    });
  }

  function tick(now) {
    var delta = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!reduceMotion && stageVisible) phase -= 1.9 * delta;
    placeCards();
    requestAnimationFrame(tick);
  }

  function resizeVision() {
    if (isPhone()) {
      canvas.style.removeProperty('--vision-k');
      stage.style.removeProperty('height');
      return;
    }
    /* 桌面画布固定为 1172px，并按当前视口缩放；首屏高度同步容纳下移后的完整预览。 */
    var scale = Math.min(window.innerWidth / 1172, window.innerHeight / 700);
    scale = Math.max(0.72, Math.min(1.28, scale));
    canvas.style.setProperty('--vision-k', scale.toFixed(4));
    stage.style.height = Math.max(window.innerHeight, Math.ceil(18 + 1098 * scale)) + 'px';
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      stageVisible = entries[0] ? entries[0].isIntersecting : true;
      last = performance.now();
    }, { threshold: 0.01 }).observe(stage);
  }

  document.addEventListener('visibilitychange', function () { last = performance.now(); });
  window.addEventListener('resize', resizeVision);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resizeVision);
  resizeVision();
  placeCards();
  requestAnimationFrame(tick);

  if (!reduceMotion && Element.prototype.animate) {
    var items = [
      ['.hy-vision-badge', 120, 0, 11],
      ['.hy-vision-copy h1', 180, 0, 18],
      ['.hy-vision-copy p:nth-of-type(1)', 300, 0, 10],
      ['.hy-vision-copy p:nth-of-type(2)', 360, 0, 10],
      ['.hy-vision-main-cta', 460, 0, 13],
      ['.hy-vision-ring', 420, 0, 20],
      ['.hy-vision-browser', 650, 0, 28]
    ];
    items.forEach(function (item) {
      var el = document.querySelector(item[0]);
      if (!el) return;
      el.animate([
        { opacity: 0, translate: '0 ' + item[3] + 'px' },
        { opacity: 1, translate: '0 0' }
      ], {
        duration: item[0].indexOf('browser') > -1 ? 900 : 680,
        delay: item[1],
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'both'
      });
    });
  }
})();
