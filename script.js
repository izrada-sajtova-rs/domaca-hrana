document.addEventListener("DOMContentLoaded", () => {
  // Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  const body = document.body;

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
      body.classList.toggle("active");
    });
  }

  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      body.classList.remove("active");
    });
  });

  // Counters Animation - pokreće se jednom, kad sekcija uđe u vidno polje
  const counters = document.querySelectorAll(".counter");
  const counterSection = document.querySelector(".counter-section");

  const animateCounters = () => {
    const duration = 1500; // ms
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      counters.forEach((counter) => {
        counter.innerText = Math.round(+counter.getAttribute("data-count") * progress);
      });
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (counterSection && counters.length > 0) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateCounters();
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      counterObserver.observe(counterSection);
    } else {
      animateCounters();
    }
  }
  // Testimonials Slider
  const testimonialSlider = document.querySelector(".testimonials-slider");
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.querySelector(".prev-slide");
  const nextBtn = document.querySelector(".next-slide");
  const sliderDots = document.querySelector(".slider-dots");

  if (testimonialSlider && testimonialSlides.length > 0) {
    let currentSlide = 0;

    // Create dots
    testimonialSlides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("slider-dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      sliderDots.appendChild(dot);
    });

    const dots = document.querySelectorAll(".slider-dot");

    // Show slide
    function showSlide(n) {
      testimonialSlides.forEach((slide, index) => {
        slide.style.display = index === n ? "block" : "none";
        dots[index].classList.toggle("active", index === n);
      });
    }

    // Go to specific slide
    function goToSlide(n) {
      currentSlide = n;
      showSlide(currentSlide);
    }

    // Next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % testimonialSlides.length;
      showSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
      currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
      showSlide(currentSlide);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    testimonialSlider.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

    testimonialSlider.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000);
    });

    // Initialize slider
    showSlide(currentSlide);
  }

  // Scroll Animation - IntersectionObserver umesto scroll listenera (bez stalnog čitanja layouta)
  const animatedElements = document.querySelectorAll(".product-card, .about-content, .about-image, .delivery-card, .partner, .price-categories, .price-tables, .price-notes, .order-cta, .product-content, .product-variants, .product-gallery, .ingredients-section, .order-info, .testimonials-section, .story-section, .values-section, .process-step, .faq-item, .map-section, .contact-section");

  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        // Elementi iznad ekrana (npr. posle osvežavanja na sredini stranice) se takođe prikazuju
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          entry.target.classList.add("fade-in");
          obs.unobserve(entry.target);
        }
      });
    });
    animatedElements.forEach((el) => fadeObserver.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add("fade-in"));
  }
  // Music Toggle
  const musicToggle = document.querySelector(".music-toggle");
  let audio = null;
  let isPlaying = false;

  if (musicToggle) {
    // Audio element se pravi tek na prvi klik, da se mp3 ne preuzima pri učitavanju stranice
    musicToggle.addEventListener("click", () => {
      if (!audio) {
        audio = document.createElement("audio");
        audio.preload = "none";
        audio.loop = true;
        audio.src = "mp3/domace.mp3";
      }

      if (isPlaying) {
        audio.pause();
        musicToggle.querySelector(".music-icon").innerHTML = '<i class="fas fa-music"></i>';
      } else {
        audio.play().catch(() => {});
        musicToggle.querySelector(".music-icon").innerHTML = '<i class="fas fa-volume-up"></i>';
      }
      isPlaying = !isPlaying;
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // FAQ functionality with smooth transition
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const toggle = item.querySelector('.faq-toggle');
    
      if (question && answer && toggle) {
        question.addEventListener('click', () => {
          // Close all other answers
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              const otherAnswer = otherItem.querySelector('.faq-answer');
              const otherToggle = otherItem.querySelector('.faq-toggle');
              if (otherAnswer && otherAnswer.classList.contains('active')) {
                otherAnswer.classList.remove('active');
                if (otherToggle) {
                  otherToggle.innerHTML = '<i class="fas fa-plus"></i>';
                }
              }
            }
          });
        
          // Toggle current answer
          answer.classList.toggle('active');
          if (answer.classList.contains('active')) {
            toggle.innerHTML = '<i class="fas fa-minus"></i>';
          } else {
            toggle.innerHTML = '<i class="fas fa-plus"></i>';
          }
        });
      }
    });
  }

  // Price category tabs functionality
  const categoryTabs = document.querySelectorAll(".category-tab");
  const priceTables = document.querySelectorAll(".price-table");

  if (categoryTabs.length > 0 && priceTables.length > 0) {
    categoryTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs and tables
        categoryTabs.forEach((t) => t.classList.remove("active"));
        priceTables.forEach((table) => table.classList.remove("active"));

        // Add active class to clicked tab
        this.classList.add("active");

        // Show corresponding price table
        const category = this.getAttribute("data-category");
        const table = document.getElementById(category);
        if (table) {
          table.classList.add("active");
        }
      });
    });
  }

  // INTERACTIVE CURSOR
  // Pokreće se tek na prvi pokret miša (ne na dodir/telefonu), da ne opterećuje učitavanje stranice
  const $circle = document.querySelector("#circle");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if ($circle && canHover) {
    const $context = document.body;
    const $divs = document.querySelectorAll(".interactive .interactive-div");

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let onDiv = false;
    let hoveringDiv = null;
    let rafId = null;
    const easing = 0.1;

    function animateCircle() {
      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;

      $circle.style.setProperty("--xpos", `${currentX}px`);
      $circle.style.setProperty("--ypos", `${currentY}px`);

      // Petlja se zaustavlja kad krug stigne na cilj, i ponovo pokreće na sledeći pokret
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        rafId = requestAnimationFrame(animateCircle);
      } else {
        rafId = null;
      }
    }

    function startAnimation() {
      if (rafId === null) rafId = requestAnimationFrame(animateCircle);
    }

    function enterDiv(div) {
      const divRect = div.getBoundingClientRect();
      const scrollOffsetY = window.scrollY; // Kompenzujemo skrol

      const finalWidth = divRect.width + 30;
      const finalHeight = divRect.height + 30;
      const divCenterX = divRect.left + divRect.width / 2;
      const divCenterY = divRect.top + scrollOffsetY + divRect.height / 2;

      targetX = divCenterX - finalWidth / 2;
      targetY = divCenterY - finalHeight / 2;

      if (!onDiv || hoveringDiv !== div) {
        $circle.style.width = `${finalWidth}px`;
        $circle.style.height = `${finalHeight}px`;
        $circle.style.borderRadius = "22px";
      }

      onDiv = true;
      hoveringDiv = div;
      startAnimation();
    }

    function initCursor(firstEvt) {
      // Krug odmah stoji na poziciji miša i postaje vidljiv
      currentX = targetX = firstEvt.clientX + 0 - $circle.offsetWidth / 2;
      currentY = targetY = firstEvt.clientY + window.scrollY - $circle.offsetHeight / 2;
      $circle.style.setProperty("--xpos", `${currentX}px`);
      $circle.style.setProperty("--ypos", `${currentY}px`);
      $circle.classList.add("active");

      // Praćenje miša
      $context.addEventListener("pointermove", (evt) => {
        if (!onDiv) {
          targetX = evt.clientX - $circle.offsetWidth / 2;
          targetY = evt.clientY + window.scrollY - $circle.offsetHeight / 2;
          startAnimation();
        }
      }, { passive: true });

      $divs.forEach((div) => {
        div.addEventListener("mouseenter", () => enterDiv(div));

        div.addEventListener("mouseleave", (evt) => {
          if (hoveringDiv === div) {
            onDiv = false;
            hoveringDiv = null;

            $circle.style.width = "var(--circleSize)";
            $circle.style.height = "var(--circleSize)";
            $circle.style.borderRadius = "50%";

            targetX = evt.clientX - $circle.offsetWidth / 2;
            targetY = evt.clientY + window.scrollY - $circle.offsetHeight / 2;
            startAnimation();
          }
        });
      });

      // Ako je miš pri prvom pokretu već iznad kartice, mouseenter se neće okinuti pa je hvatamo ručno
      const startDiv = document.elementFromPoint(firstEvt.clientX, firstEvt.clientY);
      const hovered = startDiv && startDiv.closest(".interactive .interactive-div");
      if (hovered) enterDiv(hovered);
    }

    document.addEventListener("pointermove", (evt) => {
      if (evt.pointerType === "mouse") initCursor(evt);
    }, { once: true, passive: true });
  }
  // Odloženo učitavanje: Google mapa (iframe[data-src]) i fontovi za potpis u footeru
  const lazyMaps = document.querySelectorAll("iframe[data-src]");
  const footerSignature = document.querySelector(".copyright");

  const loadMap = (iframe) => {
    iframe.src = iframe.dataset.src;
    iframe.removeAttribute("data-src");
  };

  const loadSignatureFonts = () => {
    if (!("FontFace" in window)) return;
    [
      new FontFace("lexend", "url(fonts/Lexend/LexendZetta-Light.woff2)", { display: "swap" }),
      new FontFace("mrs_saint", "url(fonts/Mrs_Saint_Delafield/MrsSaintDelafield-Regular.woff2)", { display: "swap" }),
    ].forEach((font) => font.load().then((f) => document.fonts.add(f)).catch(() => {}));
  };

  if ("IntersectionObserver" in window) {
    const lazyObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        if (entry.target.dataset.src) loadMap(entry.target);
        else loadSignatureFonts();
      });
    }, { rootMargin: "300px" });

    lazyMaps.forEach((iframe) => lazyObserver.observe(iframe));
    if (footerSignature) lazyObserver.observe(footerSignature);
  } else {
    lazyMaps.forEach(loadMap);
    loadSignatureFonts();
  }
  // Praćenje klikova na .trackcall dugmad - slanje na eksterni server
  document.querySelectorAll(".trackcall").forEach(function (el) {
    el.addEventListener("click", function () {
      const payload = JSON.stringify({
        time: new Date().toISOString(),
        call: 1
      });

      fetch("https://bobanwebmaker.com/private/domaca-hrana.php", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: payload,
        keepalive: true
      }).catch(() => {});
    });
  });
});