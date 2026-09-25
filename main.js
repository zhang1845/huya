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
