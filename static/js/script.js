/**
 * MarketPulse — Premium JavaScript Engine
 * Author: Akshat Yadav | akshattcore@gmail.com
 */

'use strict';

// ═══════════════════════════════════════════════════
//  PARTICLE SYSTEM
// ═══════════════════════════════════════════════════
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  const COLORS = [
    'rgba(255,122,24,',
    'rgba(255,61,84,',
    'rgba(255,184,0,',
    'rgba(253,186,116,',
    'rgba(249,115,22,',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * W;
      this.y = H + Math.random() * 80;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 150;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.life++;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.3;
      this.y += this.speedY;

      const progress = this.life / this.maxLife;
      // Fade in then out
      if (progress < 0.2) {
        this.currentOpacity = this.opacity * (progress / 0.2);
      } else if (progress > 0.8) {
        this.currentOpacity = this.opacity * ((1 - progress) / 0.2);
      } else {
        this.currentOpacity = this.opacity;
      }

      if (this.life >= this.maxLife || this.y < -20) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentOpacity + ')';
      ctx.fill();

      // Glow
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      grd.addColorStop(0, this.color + (this.currentOpacity * 0.4) + ')');
      grd.addColorStop(1, this.color + '0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(W / 10), 100);
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      // Spread them across the screen initially
      p.y = Math.random() * H;
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  loop();
})();


// ═══════════════════════════════════════════════════
//  NAVBAR SCROLL BEHAVIOR
// ═══════════════════════════════════════════════════
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (y > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }
})();


// ═══════════════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════════════
(function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


// ═══════════════════════════════════════════════════
//  SPARKLINE CHARTS
// ═══════════════════════════════════════════════════
(function initSparklines() {
  const sparklines = document.querySelectorAll('.sparkline');

  const trendData = {
    'up': [42, 45, 43, 47, 44, 49, 48, 53, 51, 56, 54, 59, 58, 63, 61, 66],
    'down': [66, 63, 65, 61, 64, 59, 61, 56, 58, 53, 55, 50, 52, 47, 49, 44],
    'up-strong': [38, 41, 39, 45, 43, 51, 49, 58, 55, 64, 61, 70, 67, 76, 73, 82],
    'volatile-up': [50, 57, 46, 63, 52, 70, 58, 75, 62, 78, 65, 80, 68, 83, 71, 86],
  };

  const trendColors = {
    'up': { line: '#22c55e', fill: 'rgba(34,197,94,' },
    'down': { line: '#f87171', fill: 'rgba(248,113,113,' },
    'up-strong': { line: '#22c55e', fill: 'rgba(34,197,94,' },
    'volatile-up': { line: '#22c55e', fill: 'rgba(34,197,94,' },
  };

  sparklines.forEach(canvas => {
    const trend = canvas.dataset.trend || 'up';
    const data = trendData[trend] || trendData['up'];
    const colors = trendColors[trend] || trendColors['up'];
    drawSparkline(canvas, data, colors);
  });

  function drawSparkline(canvas, data, colors) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const pad = 4;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    function px(i) { return pad + (i / (data.length - 1)) * (W - pad * 2); }
    function py(v) { return H - pad - ((v - min) / range) * (H - pad * 2); }

    ctx.clearRect(0, 0, W, H);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, colors.fill + '0.3)');
    grad.addColorStop(1, colors.fill + '0)');

    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cpX = (px(i - 1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.lineTo(px(data.length - 1), H);
    ctx.lineTo(px(0), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cpX = (px(i - 1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Last point dot
    const lx = px(data.length - 1);
    const ly = py(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = colors.line;
    ctx.fill();

    // Glow dot
    const dotGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 8);
    dotGrad.addColorStop(0, colors.fill + '0.6)');
    dotGrad.addColorStop(1, colors.fill + '0)');
    ctx.beginPath();
    ctx.arc(lx, ly, 8, 0, Math.PI * 2);
    ctx.fillStyle = dotGrad;
    ctx.fill();
  }
})();


// ═══════════════════════════════════════════════════
//  HERO CHART
// ═══════════════════════════════════════════════════
(function initHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Generate realistic-looking data
  const baseData = [];
  let val = 820;
  for (let i = 0; i < 80; i++) {
    val += (Math.random() - 0.38) * 8;
    val = Math.max(780, Math.min(910, val));
    baseData.push(val);
  }

  function draw(data) {
    const W = canvas.width;
    const H = canvas.height;
    const pad = 8;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    function px(i) { return pad + (i / (data.length - 1)) * (W - pad * 2); }
    function py(v) { return H - pad - ((v - min) / range) * (H - pad * 2); }

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let r = 0; r < 4; r++) {
      const y = pad + (r / 3) * (H - pad * 2);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(W - pad, y);
      ctx.stroke();
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,122,24,0.25)');
    grad.addColorStop(0.5, 'rgba(255,122,24,0.08)');
    grad.addColorStop(1, 'rgba(255,122,24,0)');

    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cpX = (px(i - 1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.lineTo(px(data.length - 1), H);
    ctx.lineTo(px(0), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Prediction zone (last 20%)
    const splitIdx = Math.floor(data.length * 0.8);
    const predGrad = ctx.createLinearGradient(0, 0, 0, H);
    predGrad.addColorStop(0, 'rgba(255,184,0,0.18)');
    predGrad.addColorStop(1, 'rgba(255,184,0,0)');

    ctx.beginPath();
    ctx.moveTo(px(splitIdx), py(data[splitIdx]));
    for (let i = splitIdx + 1; i < data.length; i++) {
      const cpX = (px(i - 1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.lineTo(px(data.length - 1), H);
    ctx.lineTo(px(splitIdx), H);
    ctx.closePath();
    ctx.fillStyle = predGrad;
    ctx.fill();

    // Main line
    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i <= splitIdx; i++) {
      const cpX = (px(i - 1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.strokeStyle = '#FF7A18';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Prediction line (dashed gold)
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(px(splitIdx), py(data[splitIdx]));
    for (let i = splitIdx + 1; i < data.length; i++) {
      const cpX = (px(i - 1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.strokeStyle = '#FFB800';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Divider
    ctx.beginPath();
    ctx.setLineDash([3, 4]);
    ctx.moveTo(px(splitIdx), 0);
    ctx.lineTo(px(splitIdx), H);
    ctx.strokeStyle = 'rgba(255,184,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Label at split
    ctx.fillStyle = 'rgba(255,184,0,0.8)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('AI Prediction →', px(splitIdx) + 5, 18);

    // Current price dot
    const lx = px(data.length - 1);
    const ly = py(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFB800';
    ctx.fill();
  }

  draw(baseData);

  // Animate: push new data point every 2s
  setInterval(() => {
    const last = baseData[baseData.length - 1];
    const next = last + (Math.random() - 0.4) * 5;
    baseData.push(Math.max(850, Math.min(920, next)));
    if (baseData.length > 100) baseData.shift();
    draw(baseData);
  }, 2000);
})();


// ═══════════════════════════════════════════════════
//  PORTFOLIO CHART
// ═══════════════════════════════════════════════════
(function initPortfolioChart() {
  const canvas = document.getElementById('portfolioChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data   = [271544, 268900, 274120, 272800, 278350, 281000, 284391];

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    const padL = 8, padR = 8, padT = 8, padB = 28;

    const min = Math.min(...data) * 0.998;
    const max = Math.max(...data) * 1.002;
    const range = max - min;

    function px(i) { return padL + (i / (data.length - 1)) * (W - padL - padR); }
    function py(v) { return padT + (1 - (v - min) / range) * (H - padT - padB); }

    ctx.clearRect(0, 0, W, H);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
    grad.addColorStop(0, 'rgba(255,122,24,0.3)');
    grad.addColorStop(1, 'rgba(255,122,24,0)');

    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cpX = (px(i-1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.lineTo(px(data.length - 1), H - padB);
    ctx.lineTo(px(0), H - padB);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(px(0), py(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cpX = (px(i-1) + px(i)) / 2;
      ctx.bezierCurveTo(cpX, py(data[i-1]), cpX, py(data[i]), px(i), py(data[i]));
    }
    ctx.strokeStyle = '#FF7A18';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points + labels
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((v, i) => {
      // Dot
      ctx.beginPath();
      ctx.arc(px(i), py(v), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF7A18';
      ctx.fill();
      // Label
      ctx.fillStyle = 'rgba(100,116,139,0.8)';
      ctx.fillText(labels[i], px(i), H - 6);
    });
  }

  draw();

  // Period button interaction
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Simulate data change
      const diffs = { '1W': [0,1,1.5,0.9,2.5,1.8,3.2], '1M': [0,2,4,3,6,5,7], '3M': [0,5,9,7,14,11,17], '1Y': [0,12,22,18,32,27,40] };
      const key = btn.textContent.trim();
      const arr = diffs[key] || diffs['1W'];
      const base = 265000;
      for (let i = 0; i < data.length; i++) {
        data[i] = base + arr[i] * 1200 + (Math.random() * 800);
      }
      draw();
    });
  });
})();


// ═══════════════════════════════════════════════════
//  LIVE PRICE TICKER (simulated)
// ═══════════════════════════════════════════════════
(function initLivePrices() {
  const prices = {
    AAPL: { value: 213.49, change: 1.82 },
    TSLA: { value: 248.71, change: -2.34 },
    NVDA: { value: 891.24, change: 3.47 },
    BTC:  { value: 67420,  change: 4.91 },
  };

  function formatPrice(ticker, val) {
    return ticker === 'BTC'
      ? '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : '$' + val.toFixed(2);
  }

  function tick() {
    Object.entries(prices).forEach(([ticker, state]) => {
      const el = document.querySelector(`.price[data-ticker="${ticker}"]`);
      if (!el) return;

      // Small random walk
      const drift = (Math.random() - 0.5) * 0.003;
      state.value *= (1 + drift);
      state.change += drift * 100;

      el.textContent = formatPrice(ticker, state.value);
      el.style.transition = 'color 0.4s';
      el.style.color = drift >= 0 ? '#22c55e' : '#f87171';
      setTimeout(() => { el.style.color = ''; }, 600);
    });
  }

  setInterval(tick, 3000);
})();


// ═══════════════════════════════════════════════════
//  CONFIDENCE RING ANIMATION
// ═══════════════════════════════════════════════════
(function initRings() {
  const rings = document.querySelectorAll('.ring-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger the CSS transition by forcing re-flow
        entry.target.style.strokeDashoffset = getComputedStyle(entry.target).strokeDashoffset;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  rings.forEach(r => observer.observe(r));
})();


// ═══════════════════════════════════════════════════
//  SMOOTH SCROLL
// ═══════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ═══════════════════════════════════════════════════
//  CONTACT FORM
// ═══════════════════════════════════════════════════
(function initForm() {
  const btn = document.getElementById('sendBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.form-input');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'rgba(248,113,113,0.5)';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Success state
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
      btn.style.background = '';
      btn.style.pointerEvents = '';
      inputs.forEach(i => { i.value = ''; });
    }, 3000);
  });
})();


// ═══════════════════════════════════════════════════
//  MAGNETIC HOVER EFFECT (market cards)
// ═══════════════════════════════════════════════════
(function initMagneticCards() {
  const cards = document.querySelectorAll('.market-card, .feature-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      card.style.transform = `
        translateY(-4px)
        rotateX(${-dy * 6}deg)
        rotateY(${dx * 6}deg)
      `;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });
})();


// ═══════════════════════════════════════════════════
//  ANIMATED COUNTER (stats)
// ═══════════════════════════════════════════════════
(function initCounters() {
  const stats = document.querySelectorAll('.stat-value');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      observer.unobserve(el);

      // Extract number
      const match = text.match(/[\d.]+/);
      if (!match) return;

      const target = parseFloat(match[0]);
      const prefix = text.replace(/[\d.]+.*/, '');
      const suffix = text.replace(/.*[\d.]/, match[0].length > 0 ? text.slice(text.indexOf(match[0]) + match[0].length) : '');

      let start = 0;
      const duration = 1500;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();


// ═══════════════════════════════════════════════════
//  AI SIGNAL CARD FLOATING ANIMATION
// ═══════════════════════════════════════════════════
(function initFloating() {
  const cards = document.querySelectorAll('.ai-signal-card');
  cards.forEach((card, i) => {
    const delay = i * 0.8;
    const duration = 4 + i * 0.5;

    let startTime = null;
    function animate(ts) {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime + delay * 1000) / 1000;
      const y = Math.sin(elapsed / duration * Math.PI * 2) * 6;
      card.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    }

    // Only float when not hovered
    card.addEventListener('mouseenter', () => { card.style.animation = 'none'; });
    card.addEventListener('mouseleave', () => {});

    // Start after cards animate in
    setTimeout(() => requestAnimationFrame(animate), (1 + i * 0.2) * 1000);
  });
})();


// ═══════════════════════════════════════════════════
//  SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
    background: linear-gradient(90deg, #FF7A18, #FF3D54, #FFB800);
    width: 0%; transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(255,122,24,0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
    bar.style.width = pct + '%';
  });
})();


// ═══════════════════════════════════════════════════
//  CURSOR GLOW
// ═══════════════════════════════════════════════════
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,122,24,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease, opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let visible = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) { glow.style.opacity = '1'; visible = true; }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });

  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }

  requestAnimationFrame(updateGlow);
})();


// ═══════════════════════════════════════════════════
//  INIT LOG
// ═══════════════════════════════════════════════════
console.log(
  '%cMarketPulse%c v1.0.0 — Built by Akshat Yadav | akshattcore@gmail.com',
  'color: #FF7A18; font-size: 18px; font-weight: bold; font-family: Space Grotesk, sans-serif;',
  'color: #64748B; font-size: 12px;'
);