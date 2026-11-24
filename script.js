/* ===================================================================
   PORTFOLIO INTERACTIVE SCRIPT
   Smooth scrolling, scroll progress, counter animations,
   email copy feedback, mobile drawer & contact handlers.
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Top Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking any nav link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // 3. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  });

  // 4. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Scroll Reveal with Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Animated Number Counters
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersAnimated = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1400; // ms
      const startTime = performance.now();

      const updateCount = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.innerText = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const telemetrySection = document.querySelector('.telemetry-section');
  if (telemetrySection) {
    const counterObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !countersAnimated) {
          countersAnimated = true;
          countUp();
        }
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(telemetrySection);
  }

  // 7. Copy Email to Clipboard
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailAddress');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', async () => {
      const email = emailText.innerText.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        copyBtn.style.color = 'var(--success)';

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2200);
      }
    });
  }

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all fields.';
        formStatus.style.color = '#ff5f56';
        formStatus.style.display = 'block';
        return;
      }

      // Simulate sending feedback and prepare mailto link
      const mailtoLink = `mailto:dhruvsharma71105@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(email)}`;
      
      formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Opening your mail client to send...';
      formStatus.className = 'form-status success';
      formStatus.style.display = 'block';

      window.location.href = mailtoLink;

      setTimeout(() => {
        contactForm.reset();
        formStatus.textContent = "Thank you! I will get back to you shortly.";
      }, 1500);
    });
  }
});
