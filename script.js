// --- YOUTUBE BACKGROUND PLAYER API ---
let player;

function initYoutubeBackground() {
  const videoContainer = document.getElementById('hero-video');
  if (!videoContainer) return;

  // Fallback for local files opened directly via file:// protocol
  if (window.location.protocol === 'file:') {
    videoContainer.innerHTML = `
      <iframe src="https://www.youtube-nocookie.com/embed/DstE-4uW1ZQ?autoplay=1&mute=1&loop=1&playlist=DstE-4uW1ZQ&controls=0&showinfo=0&rel=0&playsinline=1" 
              frameborder="0" 
              allow="autoplay; encrypted-media" 
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen></iframe>
    `;
    // Fade in the video after iframe is loaded
    setTimeout(() => {
      videoContainer.classList.add('loaded');
    }, 500);
    return;
  }

  // Standard API flow for web servers (http:// or https://)
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('hero-video', {
      host: 'https://www.youtube-nocookie.com',
      videoId: 'DstE-4uW1ZQ',
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: 'DstE-4uW1ZQ',
        controls: 0,
        showinfo: 0,
        rel: 0,
        enablejsapi: 1,
        modestbranding: 1,
        iv_load_policy: 3,
        playsinline: 1,
        fs: 0,
        disablekb: 1
      },
      events: {
        onReady: (event) => {
          const iframe = document.getElementById('hero-video');
          if (iframe) {
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          }
          event.target.mute();
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === 1) { // 1 = YT.PlayerState.PLAYING
            videoContainer.classList.add('loaded');
          }
        }
      }
    });
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initYoutubeBackground();
  
  // --- LUMERA PROJECTS DATA ---
  const artworks = [
    {
      id: 'artwork1',
      title: 'Amelia & Jack',
      category: 'weddings',
      medium: 'Wedding Cinematography Still',
      year: '2026',
      dimensions: 'Sunset Outdoor Session',
      description: 'A stunning sunset portrait captured in the private vineyard estates of Luxembourg during Amelia and Jack’s summer wedding, emphasizing warm golden rays and natural emotions.',
      image: 'images/portfolio_wedding1.jpg'
    },
    {
      id: 'artwork2',
      title: 'Emotional Toast',
      category: 'weddings',
      medium: 'Candid Wedding Photo',
      year: '2025',
      dimensions: 'Fine Art Black & White',
      description: 'A close-up documentary frame capturing raw laughter and happy tears from the bridal party during the maid of honor’s wedding reception speech.',
      image: 'images/portfolio_wedding2.jpg'
    },
    {
      id: 'artwork3',
      title: 'Galas & Lights',
      category: 'events',
      medium: 'Event Coverage Still',
      year: '2026',
      dimensions: 'Corporate Gala Coverage',
      description: 'A high-energy shot capturing ambient spotlight reflections and guest toasts during the annual Luxembourg Creative Industry Gala.',
      image: 'images/portfolio_event1.jpg'
    },
    {
      id: 'artwork4',
      title: 'European Streets',
      category: 'portraits',
      medium: 'Editorial Portrait Still',
      year: '2025',
      dimensions: 'Couples Anniversary Session',
      description: 'An editorial couples photoshoot set in the ancient stone corridors and historic architectural arches of old Luxembourg City.',
      image: 'images/portfolio_event2.jpg'
    }
  ];

  // --- REVEAL ON SCROLL ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // --- CUSTOM CURSOR WITH DYNAMIC VIEW BADGE ---
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });
    
    // Smooth lagging follower
    const updateFollower = () => {
      const ease = 0.12;
      followerX += (mouseX - followerX) * ease;
      followerY += (mouseY - followerY) * ease;
      
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      
      requestAnimationFrame(updateFollower);
    };
    updateFollower();
    
    // Standard Hover interactions (expand circle)
    const interactiveElements = document.querySelectorAll('a, button, .filter-btn, .lightbox-btn, .lightbox-close, .picker-card, .package-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
      });
    });
  }

  // --- MOBILE NAVIGATION ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // --- GALLERY FILTER & POPULATION ---
  const galleryGrid = document.querySelector('.gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilteredArtworks = [...artworks];
  
  // Render gallery with asymmetric layout styling
  const renderGallery = (items) => {
    galleryGrid.innerHTML = '';
    items.forEach((art, index) => {
      const item = document.createElement('div');
      
      // Alternate classes to generate staggered layout:
      // Index 0, 3, 4, 7 -> Wide (item-wide)
      // Index 1, 2, 5, 6 -> Narrow (item-narrow)
      const layoutPattern = [0, 3].includes(index % 4) ? 'item-wide' : 'item-narrow';
      
      item.className = `gallery-item ${layoutPattern} reveal`;
      item.setAttribute('data-id', art.id);
      item.innerHTML = `
        <div class="gallery-image-wrapper">
          <img src="${art.image}" alt="${art.title}" class="gallery-img" loading="lazy">
          <div class="gallery-overlay">
            <div class="gallery-info">
              <span class="art-category">${art.category}</span>
              <h3 class="art-title">${art.title}</h3>
              <span class="art-year">${art.year}</span>
            </div>
          </div>
        </div>
      `;
      
      // Re-observe for reveal
      revealObserver.observe(item);
      
      // Click event for Lightbox
      item.addEventListener('click', () => openLightbox(art.id));
      
      // Apply "VIEW" badge state when cursor is over gallery item
      if (cursor && follower) {
        item.addEventListener('mouseenter', () => {
          cursor.classList.add('view-mode');
          follower.classList.add('view-mode');
        });
        item.addEventListener('mouseleave', () => {
          cursor.classList.remove('view-mode');
          follower.classList.remove('view-mode');
        });
      }
      
      galleryGrid.appendChild(item);
    });
  };
  
  renderGallery(artworks);

  // Filter Button Click Handling
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      if (filterValue === 'all') {
        currentFilteredArtworks = [...artworks];
      } else {
        currentFilteredArtworks = artworks.filter(art => art.category === filterValue);
      }
      
      // Animate gallery change
      galleryGrid.style.opacity = 0;
      galleryGrid.style.transform = 'translateY(15px)';
      
      setTimeout(() => {
        renderGallery(currentFilteredArtworks);
        galleryGrid.style.opacity = 1;
        galleryGrid.style.transform = 'translateY(0)';
      }, 300);
    });
  });

  // --- LIGHTBOX MODAL ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxMedium = document.getElementById('lightbox-medium');
  const lightboxYear = document.getElementById('lightbox-year');
  const lightboxDimensions = document.getElementById('lightbox-dimensions');
  const lightboxDesc = document.querySelector('.lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  let currentArtIndex = 0;
  
  const openLightbox = (artId) => {
    currentArtIndex = currentFilteredArtworks.findIndex(art => art.id === artId);
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scroll
    
    // Hide custom cursor elements temporarily in lightbox mode to avoid overlaps
    if (cursor && follower) {
      cursor.style.display = 'none';
      follower.style.display = 'none';
    }
  };
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scroll
    
    // Re-enable custom cursor elements
    if (cursor && follower) {
      cursor.style.display = '';
      follower.style.display = '';
    }
  };
  
  const updateLightboxContent = () => {
    const art = currentFilteredArtworks[currentArtIndex];
    if (!art) return;
    
    lightboxImg.style.opacity = 0;
    lightboxImg.style.transform = 'scale(0.97)';
    
    setTimeout(() => {
      lightboxImg.src = art.image;
      lightboxImg.alt = art.title;
      lightboxTitle.textContent = art.title;
      lightboxMedium.textContent = art.medium;
      lightboxYear.textContent = art.year;
      lightboxDimensions.textContent = art.dimensions;
      lightboxDesc.textContent = art.description;
      
      lightboxImg.style.opacity = 1;
      lightboxImg.style.transform = 'scale(1)';
    }, 150);
  };
  
  const navigateLightbox = (direction) => {
    if (direction === 'next') {
      currentArtIndex = (currentArtIndex + 1) % currentFilteredArtworks.length;
    } else {
      currentArtIndex = (currentArtIndex - 1 + currentFilteredArtworks.length) % currentFilteredArtworks.length;
    }
    updateLightboxContent();
  };
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-container') || e.target.classList.contains('lightbox-img-wrapper')) {
        closeLightbox();
      }
    });
  }
  
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox('prev'));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox('next'));
  
  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  });

  // --- INTERACTIVE MULTI-STEP BOOKING FORM ---
  const bookingForm = document.getElementById('booking-form');
  const steps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const progressLine = document.getElementById('progress-line');
  
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const navRow = document.getElementById('form-navigation-row');
  
  let currentStep = 1;
  const totalSteps = 3; // Step 4 is success screen which hides nav

  // Selectable Package Cards Highlight Logic
  const pickerCards = document.querySelectorAll('.picker-card');
  pickerCards.forEach(card => {
    card.addEventListener('click', () => {
      pickerCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radioBtn = card.querySelector('input[type="radio"]');
      if (radioBtn) radioBtn.checked = true;
    });
  });

  // Pre-select service when clicking select packages on comparison cards
  const selectPackageBtns = document.querySelectorAll('.select-package');
  selectPackageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packageType = btn.getAttribute('data-package');
      const targetCard = document.querySelector(`.picker-card[for="srv-${packageType}"]`);
      if (targetCard) {
        // Pre-select Step 1 selection card
        pickerCards.forEach(c => c.classList.remove('selected'));
        targetCard.classList.add('selected');
        const radio = targetCard.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        
        // Go immediately to Step 2
        currentStep = 2;
        showStep(currentStep);
      }
    });
  });

  const showStep = (stepIndex) => {
    steps.forEach(step => step.classList.remove('active'));
    const activeStep = document.querySelector(`.form-step[data-step="${stepIndex}"]`);
    if (activeStep) activeStep.classList.add('active');
    
    // Update Indicators
    stepDots.forEach(dot => {
      const dotStep = parseInt(dot.getAttribute('data-step'));
      dot.classList.remove('active', 'completed');
      if (dotStep === stepIndex) {
        dot.classList.add('active');
      } else if (dotStep < stepIndex) {
        dot.classList.add('completed');
      }
    });

    // Update Progress Line Width
    const progressWidth = ((stepIndex - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = `${progressWidth}%`;

    // Manage Nav Buttons Visibility
    if (stepIndex === 1) {
      btnPrev.style.display = 'none';
      btnNext.textContent = 'Next →';
    } else if (stepIndex === totalSteps) {
      btnPrev.style.display = 'block';
      btnNext.textContent = 'Submit Inquiry';
    } else {
      btnPrev.style.display = 'block';
      btnNext.textContent = 'Next →';
    }

    if (stepIndex > totalSteps) {
      navRow.style.display = 'none'; // Hide buttons on success step
    }
  };

  const validateCurrentStep = (stepIndex) => {
    if (stepIndex === 1) {
      // Must have checked radio
      const selectedRadio = document.querySelector('input[name="service_package"]:checked');
      if (!selectedRadio) {
        alert('Please select a service package to continue.');
        return false;
      }
    } else if (stepIndex === 2) {
      // Check date, location and hours fields
      const date = document.getElementById('event-date');
      const location = document.getElementById('event-location');
      const hours = document.getElementById('event-hours');
      
      if (!date.value || !location.value || !hours.value) {
        alert('Please fill out all required details (Date, Location, and Duration) to continue.');
        return false;
      }
    } else if (stepIndex === 3) {
      // Check client contact details
      const name = document.getElementById('client-name');
      const email = document.getElementById('client-email');
      const phone = document.getElementById('client-phone');
      
      if (!name.value || !email.value || !phone.value) {
        alert('Please fill out your contact details (Name, Email, and Phone) to submit.');
        return false;
      }
    }
    return true;
  };

  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
        } else {
          // Submit Inquiry - Proceed to step 4 (Success Card)
          submitBookingInquiry();
        }
      }
    });

    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  const submitBookingInquiry = () => {
    // Show loading text on submit
    btnNext.disabled = true;
    btnNext.textContent = 'Submitting...';
    btnPrev.style.display = 'none';
    
    // Simulate server POST request
    setTimeout(() => {
      // Move to step 4 (Success Card)
      currentStep = 4;
      showStep(currentStep);
      
      // Reset form variables
      bookingForm.reset();
      pickerCards.forEach(c => c.classList.remove('selected'));
    }, 1500);
  };
  
  // Adjust header look on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.style.padding = '14px 0';
      header.style.backgroundColor = 'rgba(18, 18, 16, 0.96)';
    } else {
      header.style.padding = '24px 0';
      header.style.backgroundColor = 'var(--bg-glass)';
    }
  });

});
