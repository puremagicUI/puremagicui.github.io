/* ============================================================
   PURE MAGIC — Final Synthesis Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Intro Sequence (Direction 03 Spatial Light)
  // After 4.5s total animation, the void goes away.
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100); 
  // Wait, the animation takes ~4s. Let's make it 3500ms to allow the drop-in hero.
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 3500);

  // 2. Custom Cursor
  const cursor = document.getElementById('cursor');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    cursor.style.left = '0';
    cursor.style.top = '0';
  });

  // Hover states for cursor
  const hoverTargets = document.querySelectorAll('a, button, .cursor-hover-target');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // 3. Nav Hide/Show on Scroll & Dark Theme Detection
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Hide/Show
    if (currentScroll > lastScroll && currentScroll > 100) {
      nav.classList.remove('scrolled-up');
      nav.classList.add('scrolled-down');
    } else {
      nav.classList.remove('scrolled-down');
      nav.classList.add('scrolled-up');
    }
    lastScroll = currentScroll;
  });

  // Detect dark sections to change nav color
  const darkSections = document.querySelectorAll('[data-theme="dark"], .intro');
  const navObserver = new IntersectionObserver((entries) => {
    let isDark = false;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isDark = true;
      }
    });
    if (isDark) {
      nav.classList.add('dark');
    } else {
      nav.classList.remove('dark');
    }
  }, { rootMargin: '-50px 0px -90% 0px' }); // Trigger when section hits top of screen

  darkSections.forEach(sec => navObserver.observe(sec));
  // Also observe hero so it defaults back properly
  navObserver.observe(document.getElementById('hero'));

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

  // 4b. Staggered Testimonial Reveal
  const testimonialEls = document.querySelectorAll('.testimonial-quote, .testimonial-author, .testimonial-role');
  const testimonialObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  testimonialEls.forEach(el => testimonialObserver.observe(el));

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
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + "px";
      }
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
          input.style.display = 'none';
          submitBtn.style.display = 'none';
          successMsg.style.display = 'block';
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
