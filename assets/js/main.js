/* Junior Ludima — portfolio interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Toast ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2400);
  }

  /* ---------- Theme ---------- */
  var themeBtn = $('#themeToggle');
  var mqLight = window.matchMedia('(prefers-color-scheme: light)');
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return mqLight.matches ? 'light' : 'dark';
  }
  function syncTheme() {
    var t = currentTheme();
    if (themeBtn) {
      themeBtn.dataset.mode = t;
      themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#0b1316' : '#eef3f4');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('lo-theme', next);
      syncTheme();
    });
  }
  if (mqLight.addEventListener) mqLight.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- Header, progress bar, back-to-top ---------- */
  var header = $('.site-header');
  var hero = $('#home');
  var bar = $('#progressBar');
  var toTop = $('#toTop');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 8);
    if (hero) header.classList.toggle('on-stage', hero.getBoundingClientRect().bottom > header.offsetHeight);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuToggle');
  function setMenu(open) {
    if (!menuBtn) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.classList.toggle('menu-open', open);
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Scroll spy ---------- */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) spy.observe(s);
    });
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }

  /* ---------- Typing roles ---------- */
  var typeEl = $('#typeTarget');
  var roles = ['Software engineer', 'Network engineer', 'Database developer', 'DevOps and IT infrastructure'];
  if (typeEl && !reduceMotion) {
    var r = 0, c = roles[0].length, deleting = false;
    var loop = function () {
      var word = roles[r];
      if (!deleting && c === word.length) {
        deleting = true;
        return setTimeout(loop, 2200);
      }
      if (deleting && c === 0) {
        deleting = false;
        r = (r + 1) % roles.length;
        return setTimeout(loop, 280);
      }
      c += deleting ? -1 : 1;
      typeEl.textContent = roles[r].slice(0, c);
      setTimeout(loop, deleting ? 38 : 72);
    };
    setTimeout(loop, 1400);
  }

  /* ---------- Nairobi clock ---------- */
  var clock = $('#nbiClock');
  if (clock) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
    } catch (e) { fmt = null; }
    var tick = function () {
      var now = new Date();
      if (fmt) { clock.textContent = fmt.format(now); }
      else {
        var t = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000);
        clock.textContent = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
      }
      clock.setAttribute('datetime', now.toISOString());
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Skills filter ---------- */
  var chips = $$('.chip');
  var skills = $$('.skill');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (x) {
        var on = x === chip;
        x.classList.toggle('is-active', on);
        x.setAttribute('aria-pressed', String(on));
      });
      var k = 0;
      skills.forEach(function (s) {
        var show = f === 'all' || s.dataset.cat === f;
        s.hidden = !show;
        if (show && !reduceMotion) {
          s.classList.remove('pop');
          void s.offsetWidth;
          s.style.animationDelay = (k * 45) + 'ms';
          s.classList.add('pop');
          k += 1;
        }
      });
    });
  });

  /* ---------- Traceroute draw ---------- */
  var route = $('#route');
  if (route) {
    var startBelowFold = route.getBoundingClientRect().top > window.innerHeight;
    if ('IntersectionObserver' in window && !reduceMotion && startBelowFold) {
      route.classList.add('is-waiting');
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            route.classList.remove('is-waiting');
            route.classList.add('is-drawn');
            ro.disconnect();
          }
        });
      }, { threshold: 0.3 });
      ro.observe(route);
    } else {
      route.classList.add('is-drawn');
    }
  }

  /* ---------- Copy buttons ---------- */
  function selectText(el) {
    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) { /* ignore */ }
  }
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.copy;
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('is-done');
        toast('Copied ' + value);
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1800);
      };
      var fallback = function () {
        var target = btn.parentElement && btn.parentElement.querySelector('.c-value');
        if (target) selectText(target);
        toast('Selected. Press Ctrl+C or Cmd+C to copy.');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---------- Contact form: compose an email ---------- */
  var form = $('#contactForm');
  if (form) {
    var fields = {
      name: { el: $('#cf-name'), err: $('#cf-name-err'), ok: function (v) { return v.trim().length > 1; } },
      email: { el: $('#cf-email'), err: $('#cf-email-err'), ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      message: { el: $('#cf-msg'), err: $('#cf-msg-err'), ok: function (v) { return v.trim().length > 4; } }
    };
    var check = function (key) {
      var f = fields[key];
      var valid = f.ok(f.el.value);
      f.err.hidden = valid;
      f.el.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid) f.el.setAttribute('aria-describedby', f.err.id); else f.el.removeAttribute('aria-describedby');
      return valid;
    };
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', function () { if (fields[key].el.value) check(key); });
      fields[key].el.addEventListener('input', function () { if (fields[key].el.getAttribute('aria-invalid') === 'true') check(key); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var results = Object.keys(fields).map(check);
      var firstBad = Object.keys(fields).filter(function (k, i) { return !results[i]; })[0];
      if (firstBad) { fields[firstBad].el.focus(); return; }
      var name = fields.name.el.value.trim();
      var email = fields.email.el.value.trim();
      var msg = fields.message.el.value.trim();
      var subject = 'Portfolio enquiry from ' + name;
      var body = msg + '\n\n' + name + '\n' + email;
      var href = 'mailto:ludimajunior@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = href;
      var note = $('#formNote');
      if (note) note.textContent = 'Your email app should open with the message ready to send. If nothing opens, write directly to ludimajunior@gmail.com.';
    });
  }

  /* ---------- Hero network canvas ---------- */
  var canvas = $('#heroNet');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, nodes = [], packets = [], running = false, lastSpawn = 0, rafId = 0;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 150;
    var EDGE = '122,140,255';      /* ultramarine, matches --stage-accent */
    var NODE = 'rgba(176,192,255,0.75)';
    var PACKET = '#f0cf45';         /* hood yellow, matches --stage-signal */

    var resize = function () {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.max(26, Math.min(72, (W * H) / 15000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.4 + 0.9
        });
      }
      packets = [];
      if (!running) draw(0);
    };

    var spawnPacket = function () {
      for (var tries = 0; tries < 12; tries++) {
        var a = Math.floor(Math.random() * nodes.length);
        var b = Math.floor(Math.random() * nodes.length);
        if (a === b) continue;
        var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        if (dx * dx + dy * dy < LINK * LINK * 0.8) {
          packets.push({ a: a, b: b, t: 0, s: 0.006 + Math.random() * 0.008 });
          return;
        }
      }
    };

    var draw = function (time) {
      ctx.clearRect(0, 0, W, H);
      var i, j, n, m, dx, dy, d2, d;
      var L2 = LINK * LINK;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          m = nodes[j];
          dx = n.x - m.x; dy = n.y - m.y; d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            d = Math.sqrt(d2);
            ctx.strokeStyle = 'rgba(' + EDGE + ',' + ((1 - d / LINK) * 0.32).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        dx = n.x - mouse.x; dy = n.y - mouse.y; d2 = dx * dx + dy * dy;
        if (d2 < 180 * 180) {
          d = Math.sqrt(d2);
          ctx.strokeStyle = 'rgba(' + EDGE + ',' + ((1 - d / 180) * 0.6).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.fillStyle = NODE;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = PACKET;
      ctx.shadowColor = PACKET;
      ctx.shadowBlur = 10;
      for (i = packets.length - 1; i >= 0; i--) {
        var p = packets[i];
        var A = nodes[p.a], B = nodes[p.b];
        var x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
        ctx.beginPath(); ctx.arc(x, y, 2.1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    var step = function (time) {
      if (!running) return;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      }
      for (var k = packets.length - 1; k >= 0; k--) {
        var p = packets[k];
        p.t += p.s;
        var A = nodes[p.a], B = nodes[p.b];
        var dx = A.x - B.x, dy = A.y - B.y;
        if (p.t >= 1 || dx * dx + dy * dy > LINK * LINK * 1.3) packets.splice(k, 1);
      }
      if (time - lastSpawn > 520 && packets.length < 9) { spawnPacket(); lastSpawn = time; }
      draw(time);
      rafId = window.requestAnimationFrame(step);
    };

    var start = function () {
      if (running || reduceMotion) return;
      running = true;
      rafId = window.requestAnimationFrame(step);
    };
    var stop = function () {
      running = false;
      window.cancelAnimationFrame(rafId);
    };

    resize();
    window.addEventListener('resize', function () {
      clearTimeout(canvas._rt);
      canvas._rt = setTimeout(resize, 150);
    });
    if (hero) {
      hero.addEventListener('pointermove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
        if (!running) draw(0);
      });
      hero.addEventListener('pointerleave', function () {
        mouse.x = -9999; mouse.y = -9999;
        if (!running) draw(0);
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !document.hidden) start(); else stop();
      }).observe(canvas);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (hero && hero.getBoundingClientRect().bottom > 0) start();
    });
  }
})();
