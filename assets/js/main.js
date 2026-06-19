document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // 2. Mobile Menu Navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Simple accessibility toggle or icon shift can go here if needed
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Gallery Data & Filtering System
  // Učitavamo slike iz gallery-data.js
  const galleryData = typeof galleryImagesList !== 'undefined' ? galleryImagesList : [];

  const galleryGrid = document.getElementById('gallery-grid');
  const galleryGridAll = document.getElementById('gallery-grid-all');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  let currentFilter = 'all';
  let filteredData = [...galleryData];

  // Function to render gallery items
  function renderGallery() {
    const grid = galleryGrid || galleryGridAll;
    if (!grid) return;
    grid.innerHTML = '';
    
    // Ako smo na stranici katalog (galleryGridAll) prikazujemo sve slike, inače samo 12
    const isCatalogPage = !!galleryGridAll;
    const itemsToRender = isCatalogPage ? filteredData : filteredData.slice(0, 12);
    
    itemsToRender.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'gallery-item reveal';
      itemEl.setAttribute('data-id', item.id);
      itemEl.innerHTML = `
        <div class="gallery-img-wrap">
          <img src="${item.src}" alt="${item.title}" loading="lazy">
          <div class="gallery-overlay">
            <span>${item.categoryLabel}</span>
            <h4>${item.title}</h4>
          </div>
        </div>
      `;
      
      // Setup click event for lightbox
      itemEl.addEventListener('click', () => {
        openLightbox(galleryData.indexOf(item));
      });

      grid.appendChild(itemEl);
    });

    // Handle scroll animations for newly rendered items
    setTimeout(revealElements, 100);
  }

  // Filter selection
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentFilter = btn.getAttribute('data-filter');
      
      if (currentFilter === 'all') {
        filteredData = [...galleryData];
      } else {
        filteredData = galleryData.filter(item => item.category === currentFilter);
      }
      
      renderGallery();
    });
  });

  // Initial gallery render
  renderGallery();

  // 4. Lightbox Modal Functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let activeIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    activeIndex = index;
    lightboxImg.src = galleryData[activeIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock scrolling
  }

  function showNext() {
    activeIndex = (activeIndex + 1) % galleryData.length;
    lightboxImg.src = galleryData[activeIndex].src;
  }

  function showPrev() {
    activeIndex = (activeIndex - 1 + galleryData.length) % galleryData.length;
    lightboxImg.src = galleryData[activeIndex].src;
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  // Close lightbox on click outside the image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // 5. Scroll Reveal Animation using IntersectionObserver
  function revealElements() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 100; // Trigger distance
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }

  // Run on load and scroll
  window.addEventListener('scroll', revealElements);
  revealElements(); // Initial call

  // 6. FAQ Accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Toggle current item
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Open if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Contact Form Handler (Direct WhatsApp Redirect option)
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const cakeType = document.getElementById('form-cake-type').value;
      const msg = document.getElementById('form-message').value.trim();
      
      // Pre-fill a WhatsApp message and open it
      const myPhoneNumber = '381653310465';
      const waText = `Zdravo! Moje ime je ${name}. Želim da se raspitam o poručivanju torte.%0A%0A*Tip torte:* ${cakeType}%0A*Kontakt telefon:* ${phone}%0A*E-mail:* ${email}%0A*Poruka:* ${msg}`;
      
      const waUrl = `https://wa.me/${myPhoneNumber}?text=${waText}`;
      
      // Show success container on site
      formSuccess.style.display = 'block';
      contactForm.reset();
      
      // Open WhatsApp in a new tab
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1500);
    });
  }
});
