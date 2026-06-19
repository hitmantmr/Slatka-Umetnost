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
        openLightbox(filteredData.indexOf(item));
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
    lightboxImg.src = filteredData[activeIndex].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock scrolling
  }

  function showNext() {
    if (filteredData.length === 0) return;
    activeIndex = (activeIndex + 1) % filteredData.length;
    lightboxImg.src = filteredData[activeIndex].src;
  }

  function showPrev() {
    if (filteredData.length === 0) return;
    activeIndex = (activeIndex - 1 + filteredData.length) % filteredData.length;
    lightboxImg.src = filteredData[activeIndex].src;
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

  // 7. Contact Form Handler (Formspree AJAX Submission)
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cakeTypeInput = document.getElementById('form-cake-type');
      const selectTrigger = document.getElementById('custom-select-trigger');
      
      if (cakeTypeInput && !cakeTypeInput.value) {
        if (selectTrigger) {
          selectTrigger.classList.add('select-error');
          selectTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const cakeType = cakeTypeInput.value;
      const msg = document.getElementById('form-message').value.trim();
      
      // Onemogući dugme i prikaži loader tokom slanja
      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Slanje upita...';
      }

      // Klijentkinja može zameniti 'YOUR_FORMSPREE_TOKEN' sa pravim Formspree ID-jem
      // Formspree je besplatan i sakriva email adresu sa koda sajta
      const formspreeToken = 'meewyrbj'; 
      
      const formData = {
        Ime_i_Prezime: name,
        Telefon_Viber: phone,
        Email_adresa: email || 'Nije uneta',
        Tip_torte: cakeType,
        Poruka: msg
      };

      // Ako token nije zamenjen, simuliramo uspešno slanje na lokalu radi testiranja
      if (formspreeToken === 'YOUR_FORMSPREE_TOKEN') {
        console.log("Simulacija slanja (Zameni token za slanje na email):", formData);
        setTimeout(() => {
          if (formSuccess) {
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          if (formSubmitBtn) {
            formSubmitBtn.disabled = false;
            formSubmitBtn.innerHTML = '<i class="ri-send-plane-line"></i> Pošalji upit';
          }
          contactForm.reset();
        }, 1200);
        return;
      }

      // Slanje upita na Formspree
      fetch(`https://formspree.io/f/${formspreeToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          if (formSuccess) {
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          contactForm.reset();
        } else {
          alert('Došlo je do greške. Molimo pokušajte ponovo.');
        }
      })
      .catch(error => {
        console.error('Greška:', error);
        alert('Došlo je do greške sa mrežom. Molimo pokušajte ponovo.');
      })
      .finally(() => {
        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = '<i class="ri-send-plane-line"></i> Pošalji upit';
        }
      });
    });
  }

  // 8. Back to Top Button Functionality
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 150) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. Custom Select Dropdown logic
  const selectTrigger = document.getElementById('custom-select-trigger');
  const selectOptionsList = document.getElementById('custom-select-options-list');
  const hiddenInput = document.getElementById('form-cake-type');
  const selectOptions = document.querySelectorAll('.custom-select-option');

  if (selectTrigger && selectOptionsList && hiddenInput) {
    // Toggle dropdown
    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTrigger.classList.toggle('active');
      selectOptionsList.classList.toggle('active');
      selectTrigger.classList.remove('select-error');
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!selectTrigger.contains(e.target) && !selectOptionsList.contains(e.target)) {
        selectTrigger.classList.remove('active');
        selectOptionsList.classList.remove('active');
      }
    });

    // Handle option selection
    selectOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove selected class from all options
        selectOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Get option value and label
        const val = option.getAttribute('data-value');
        const text = option.textContent;
        
        // Update trigger text and hidden input value
        const placeholderSpan = selectTrigger.querySelector('span');
        if (placeholderSpan) {
          placeholderSpan.textContent = text;
          placeholderSpan.classList.remove('custom-select-placeholder');
        }
        
        hiddenInput.value = val;
        
        // Close dropdown
        selectTrigger.classList.remove('active');
        selectOptionsList.classList.remove('active');
      });
    });
  }
});
