/* ============================================================
   PURE MAGIC — Final Synthesis Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================================
  // 1. PARTICLE FIELD CANVAS
  // ============================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let mouse = { x: W / 2, y: H / 2 };

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    const line = (x1, y1, x2, y2, color, width = 1) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
    };
    const shape = (points, fill) => {
      ctx.beginPath(); ctx.moveTo(...points[0]); points.slice(1).forEach(point => ctx.lineTo(...point));
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    };
    const cloud = (x, y, sx, sy, alpha = 0.78) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(255,250,240,.96)';
      ctx.beginPath();
      ctx.ellipse(x - sx * 0.28, y + sy * 0.02, sx * 0.24, sy * 0.18, -0.08, 0, Math.PI * 2);
      ctx.ellipse(x - sx * 0.04, y - sy * 0.08, sx * 0.34, sy * 0.26, 0.04, 0, Math.PI * 2);
      ctx.ellipse(x + sx * 0.22, y + sy * 0.01, sx * 0.28, sy * 0.2, 0.1, 0, Math.PI * 2);
      ctx.ellipse(x + sx * 0.02, y + sy * 0.12, sx * 0.38, sy * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    const bird = (x, y, s = 1, tilt = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.strokeStyle = 'rgba(43,39,33,.76)';
      ctx.lineWidth = Math.max(1, 1.6 * s);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-8 * s, 1 * s);
      ctx.quadraticCurveTo(-2 * s, -5 * s, 0, -1 * s);
      ctx.quadraticCurveTo(2 * s, -5 * s, 8 * s, 1 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-0.5 * s, 1.1 * s, 3.8 * s, 1.7 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(43,39,33,.76)';
      ctx.fill();
      ctx.restore();
    };
    const tower = (x, top, base, lit) => {
      const towerWidth = Math.max(28, W * 0.034);
      const depth = towerWidth * 0.44;
      const cap = top - towerWidth * 0.18;
      const foot = base - towerWidth * 0.1;
      shape([[x - towerWidth / 2, top], [x + towerWidth / 2, top], [x + towerWidth / 2, foot], [x - towerWidth / 2, foot]], '#ef5834');
      shape([[x + towerWidth / 2, top], [x + towerWidth / 2 + depth, top - depth], [x + towerWidth / 2 + depth, foot - depth], [x + towerWidth / 2, foot]], '#9f2f24');
      shape([[x - towerWidth / 2, top], [x, cap], [x + towerWidth / 2, top], [x + towerWidth / 2 + depth, top - depth], [x + depth, cap - depth], [x, cap]], '#ff8453');
      shape([[x - towerWidth * 0.26, top + towerWidth * 0.45], [x + towerWidth * 0.26, top + towerWidth * 0.45], [x + towerWidth * 0.26, top + towerWidth * 0.62], [x - towerWidth * 0.26, top + towerWidth * 0.62]], '#7b2421');
      shape([[x - towerWidth * 0.28, foot - towerWidth * 0.15], [x + towerWidth * 0.28, foot - towerWidth * 0.15], [x + towerWidth * 0.28, foot], [x - towerWidth * 0.28, foot]], '#8d2822');
      if (lit) { ctx.fillStyle = 'rgba(255,214,151,.28)'; ctx.fillRect(x - towerWidth * 0.22, top + towerWidth * 0.42, towerWidth * 0.08, foot - top - towerWidth * 0.48); }
    };

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animateParticles(time = 0) {
      const sway = (mouse.x / W - 0.5) * 30;
      const horizon = H * 0.63;
      const towerLeft = W * 0.29 + sway * 0.12;
      const towerRight = W * 0.71 + sway * 0.12;
      const towerTop = H * 0.28;
      const towerBottom = H * 0.74;
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#f8f3e9'); sky.addColorStop(0.6, '#e5ddd0'); sky.addColorStop(1, '#9bc4c7');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      const dawn = Math.min(1, time / 6500);
      const sunY = horizon - H * (0.05 + dawn * 0.18);
      const sunRadius = Math.min(W, H) * 0.07;
      const glow = ctx.createRadialGradient(W * 0.69, sunY, sunRadius * 0.2, W * 0.69, sunY, sunRadius * 3.5);
      glow.addColorStop(0, 'rgba(255,203,99,.72)'); glow.addColorStop(1, 'rgba(255,203,99,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      ctx.beginPath(); ctx.arc(W * 0.69, sunY, sunRadius, 0, Math.PI * 2); ctx.fillStyle = '#ffc45f'; ctx.fill();
      ctx.fillStyle = '#9ac5c8'; ctx.fillRect(0, horizon, W, H - horizon);
      ctx.save();
      ctx.globalAlpha = 0.24;
      const bayBand = ctx.createLinearGradient(0, horizon, 0, H);
      bayBand.addColorStop(0, 'rgba(148,190,194,0)');
      bayBand.addColorStop(0.12, 'rgba(136,183,188,.55)');
      bayBand.addColorStop(1, 'rgba(111,152,157,.92)');
      ctx.fillStyle = bayBand;
      ctx.fillRect(0, horizon, W, H - horizon);
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = '#dff3f1';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(W * (0.2 + i * 0.2), horizon + H * 0.09 + Math.sin(time * 0.0006 + i) * 6, W * 0.16, H * 0.02, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.23;
      for (let i = 0; i < 12; i++) line(0, horizon + i * 20, W, horizon + i * 20 + Math.sin(time * 0.001 + i) * 5, '#286c72');
      ctx.restore();
      ctx.save(); ctx.shadowColor = 'rgba(59,22,16,.22)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 18;
      shape([[-W * 0.08, H * 0.94], [W * 0.13, horizon + H * 0.08], [W * 0.87, horizon + H * 0.08], [W * 1.08, H * 0.94]], '#a93228'); ctx.restore();
      shape([[-W * 0.1, H * 0.94], [W * 1.1, H * 0.94], [W * 1.06, H], [-W * 0.06, H]], '#702522');
      tower(towerLeft, towerTop, towerBottom, true); tower(towerRight, towerTop, towerBottom, false);
      const cableY = (rel) => towerTop + H * 0.06 + Math.pow(Math.sin(rel * Math.PI), 1.2) * H * 0.26;
      ctx.strokeStyle = '#cc4a31'; ctx.lineWidth = Math.max(3.5, W * 0.0032);
      ctx.beginPath();
      ctx.moveTo(-W * 0.03, cableY(0) + H * 0.01);
      ctx.bezierCurveTo(W * 0.12, towerTop + H * 0.12, W * 0.18, towerTop + H * 0.18, towerLeft - W * 0.01, cableY(0.22));
      ctx.bezierCurveTo((towerLeft + towerRight) * 0.43, towerTop + H * 0.34, (towerLeft + towerRight) * 0.57, towerTop + H * 0.34, towerRight + W * 0.01, cableY(0.78));
      ctx.bezierCurveTo(W * 0.82, towerTop + H * 0.18, W * 0.90, towerTop + H * 0.12, W * 1.03, cableY(1) + H * 0.01);
      ctx.stroke();
      const deckTop = horizon + H * 0.11;
      const deckBottom = deckTop + H * 0.032;
      shape([[W * 0.08, deckTop], [W * 0.92, deckTop], [W * 0.88, deckBottom], [W * 0.12, deckBottom]], '#d9482c');
      ctx.save(); ctx.globalAlpha = 0.55;
      for (let x = W * 0.03; x <= W * 0.97; x += Math.max(28, W * 0.032)) {
        const rel = (x - W * 0.03) / (W * 0.94);
        const topY = cableY(rel) + Math.sin(time * 0.0014 + rel * 6.2) * 2;
        const bottomY = deckTop;
        line(x, topY, x, bottomY, 'rgba(145,41,33,.78)', 1.1);
      }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.85;
      for (let x = W * 0.1; x <= W * 0.9; x += Math.max(26, W * 0.03)) {
        line(x, deckTop + H * 0.015, x + sway * 0.02, deckBottom - H * 0.005, 'rgba(94,33,29,.62)', 1);
      }
      ctx.restore();
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const drift = (time * 0.005 * (i % 2 ? 1 : -1) + i * W * 0.28) % (W * 1.35);
        const cloudX = drift - W * 0.15;
        const cloudY = H * (0.13 + i * 0.08) + Math.sin(time * 0.00045 + i) * 9;
        cloud(cloudX, cloudY, W * (0.14 + i * 0.01), H * (0.08 + i * 0.005), 0.72);
      }
      ctx.restore();
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const bx = ((time * 0.02 + i * W * 0.15) % (W * 1.18)) - W * 0.08;
        const by = H * (0.17 + (i % 3) * 0.042) + Math.sin(time * 0.0018 + i) * 8;
        bird(bx, by, 0.85 + (i % 2) * 0.1, Math.sin(time * 0.0007 + i) * 0.2);
      }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.5;
      for (let i = 0; i < 6; i++) { const fogX = (i / 5) * W + sway * 1.8; const fogY = H * 0.57 + Math.sin(time * 0.0003 + i) * 24; const fog = ctx.createRadialGradient(fogX, fogY, 0, fogX, fogY, W * 0.18); fog.addColorStop(0, 'rgba(247,242,232,.8)'); fog.addColorStop(1, 'rgba(247,242,232,0)'); ctx.fillStyle = fog; ctx.fillRect(0, 0, W, H); }
      ctx.restore();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ============================================================
  // 2. HERO PARALLAX — 3D MOUSE TILT
  // ============================================================
  const heroWords = document.getElementById('heroWords');
  if (heroWords) {
    const rows = heroWords.querySelectorAll('.hero-word-row');
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rx = (e.clientY - cy) / cy; // -1 to 1
      const ry = (e.clientX - cx) / cx; // -1 to 1
      rows.forEach(row => {
        const depth = parseFloat(row.dataset.depth) || 1;
        row.style.transform = `translate(${ry * depth * 14}px, ${rx * depth * 6}px)`;
        row.style.transition = 'transform 0.15s ease';
      });
    });
    document.addEventListener('mouseleave', () => {
      rows.forEach(row => {
        row.style.transform = 'translate(0,0)';
        row.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  // 3. Minimal Header
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  function closeMenu() {
    if (!siteHeader || !menuToggle) return;
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-is-open');
  }

  if (siteHeader) {
    const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if (menuToggle && siteHeader) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-is-open', isOpen);
    });
  }

  if (siteNav) siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));




  // 4. Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // 4b. Testimonial Slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.t-dot');
  let currentSlide = 0;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
      dots[i].setAttribute('aria-current', 'false');
    });
    if (slides[index] && dots[index]) {
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      dots[index].setAttribute('aria-current', 'true');
      currentSlide = index;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      goToSlide(index);
    });
  });

  // 4c. Magnetic Button Effect
  const magneticEls = document.querySelectorAll('.chat-submit, .faq-btn, #menuBtn');
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      el.style.transition = 'transform 0.1s ease';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

  // 5. Stat Numbers Counter
  const stats = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.val, 10);
        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.innerText = Math.floor(current);
        }, stepTime);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statObserver.observe(stat));

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + "px";
      }
    });
  });

  // 6b. Footer Pills Multi-Select
  const footerPills = document.querySelectorAll('.footer-pills .pill');
  const selectedServicesInput = document.getElementById('selectedServices');
  let selectedPills = [];

  footerPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const val = pill.getAttribute('data-value');

      if (pill.classList.contains('selected')) {
        pill.classList.remove('selected');
        selectedPills = selectedPills.filter(v => v !== val);
      } else {
        pill.classList.add('selected');
        selectedPills.push(val);
      }

      selectedServicesInput.value = selectedPills.join(', ');
    });
  });

  // 7. Formspree AJAX Submission
  const chatForm = document.getElementById('chatForm');
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = chatForm.querySelector('.chat-submit');
      const input = chatForm.querySelector('.chat-input');
      const successMsg = document.getElementById('chatSuccess');

      const formData = new FormData(chatForm);
      
      try {
        submitBtn.style.opacity = '0.5';
        submitBtn.innerText = 'Sending...';
        
        const response = await fetch(chatForm.action, {
          method: chatForm.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const pillsContainer = chatForm.querySelector('.footer-pills');
          if (pillsContainer) pillsContainer.style.display = 'none';
          input.style.display = 'none';
          submitBtn.style.display = 'none';
          successMsg.style.display = 'flex';
        } else {
          submitBtn.style.opacity = '1';
          submitBtn.innerText = 'Error. Try Again.';
        }
      } catch (err) {
        submitBtn.style.opacity = '1';
        submitBtn.innerText = 'Error. Try Again.';
      }
    });
  }

});
