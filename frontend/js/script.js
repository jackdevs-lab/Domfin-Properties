// script.js - Main JavaScript file for Domfin Properties

// Mobile Menu Toggle
 function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('fa-bars');
      hamburger.classList.toggle('fa-times');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburger.classList.add('fa-bars');
        hamburger.classList.remove('fa-times');
      }
    });
  }
}
const images = [
        'url("images/p3.jpeg")',
        'url("images/p4.jpg")',
        'url("images/p5.jpeg")',
        'url("images/p2.jpg")',
        'url("images/p1.webp")'
    ];
    
    let currentIndex = 0;
    const backgroundElement = document.querySelector('.hero-background');
    
    function changeSlide() {
        // Fade out
        backgroundElement.style.opacity = 0;
        
        setTimeout(() => {
            // Change image after fade out
            backgroundElement.style.backgroundImage = images[currentIndex];
            currentIndex = (currentIndex + 1) % images.length;
            // Fade in
            backgroundElement.style.opacity = 1;
        }, 1000); // Matches the transition duration
    }
    
    // Initial image
    backgroundElement.style.backgroundImage = images[0];
    backgroundElement.style.opacity = 1;
    currentIndex = 1;
    
    // Change every 2.5 seconds (1500ms display + 1000ms fade)
    setInterval(changeSlide, 3500);

// Slider/Carousel
function initSlider() {
  const slider = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  
  if (!slider || !slides.length) return;
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active indicators if they exist
    const indicators = document.querySelectorAll('.slider-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }
  // Enhanced Filter Features
function initEnhancedFilters() {
    // Advanced filters toggle
    const toggleBtn = document.querySelector('.filter-toggle button');
    const advancedFilters = document.querySelector('.advanced-filters');
    
    if (toggleBtn && advancedFilters) {
        toggleBtn.addEventListener('click', () => {
            advancedFilters.classList.toggle('show');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    }
    
    // Real-time filter updates (optional)
    const filterInputs = document.querySelectorAll('.filter-form select, .filter-form input');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // You can add real-time filtering here if desired
            const form = this.closest('.filter-form');
            if (form) {
                // Trigger filter on change (optional)
                // form.dispatchEvent(new Event('submit'));
            }
        });
    });
    
    // Add price range display
    const priceSelect = document.querySelector('#price');
    if (priceSelect) {
        priceSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value) {
                // You could show a price range display here
            }
        });
    }
    
    // Reset form functionality
    const resetBtn = document.querySelector('.btn-outline[type="button"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const form = this.closest('.filter-form');
            if (form) {
                form.reset();
                
                // Also trigger the form submit to reset displayed properties
                form.dispatchEvent(new Event('submit'));
                
                // Show all properties
                const propertyCards = document.querySelectorAll('.property-card');
                propertyCards.forEach(card => {
                    card.style.display = 'block';
                });
                
                // Update results counter if it exists
                updateResultsCounter();
            }
        });
    }
    
    // Initialize results counter
    updateResultsCounter();
}

function updateResultsCounter() {
    const propertyCards = document.querySelectorAll('.property-card');
    const visibleCards = Array.from(propertyCards).filter(card => 
        card.style.display !== 'none'
    ).length;
    
    let counter = document.querySelector('.results-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'results-counter';
        const filterSection = document.querySelector('.filter-section');
        if (filterSection) {
            filterSection.appendChild(counter);
        }
    }
    
    counter.innerHTML = `Showing <span>${visibleCards}</span> of ${propertyCards.length} properties`;
}

// Update the main init function to include enhanced filters
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSlider();
    initPropertyGallery();
    initFormValidation();
    initPropertyFilter();
    initEnhancedFilters(); // Add this line
    
    // ... rest of existing code ...
});
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }
  
  // Auto slide every 5 seconds
  let slideInterval = setInterval(nextSlide, 5000);
  
  // Pause on hover
  slider.parentElement.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  slider.parentElement.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });
  
  // Button events
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  // Create indicators if they don't exist
  if (!document.querySelector('.slider-indicators')) {
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'slider-indicators';
    indicatorContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    `;
    
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = `slider-indicator ${i === 0 ? 'active' : ''}`;
      indicator.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: none;
        background: ${i === 0 ? '#007bff' : '#ccc'};
        cursor: pointer;
        transition: background 0.3s;
      `;
      indicator.addEventListener('click', () => {
        currentSlide = i;
        updateSlider();
      });
      indicatorContainer.appendChild(indicator);
    }
    
    slider.parentElement.appendChild(indicatorContainer);
  }
}

// Property Gallery Thumbnail Navigation
function initPropertyGallery() {
  const mainImage = document.querySelector('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (!mainImage || !thumbnails.length) return;
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      mainImage.src = thumb.dataset.full || thumb.src;
      mainImage.alt = thumb.alt;
      
      // Update active thumbnail
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('.contact-form, .filter-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        field.style.borderColor = '#dee2e6';
        
        if (!field.value.trim()) {
          field.style.borderColor = '#dc3545';
          isValid = false;
          
          // Create error message if it doesn't exist
          let errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = `
              color: #dc3545;
              font-size: 0.875rem;
              margin-top: 0.25rem;
            `;
            field.parentNode.appendChild(errorMsg);
          }
          errorMsg.textContent = 'This field is required';
        } else if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            field.style.borderColor = '#dc3545';
            isValid = false;
            
            let errorMsg = field.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
              errorMsg = document.createElement('div');
              errorMsg.className = 'error-message';
              errorMsg.style.cssText = `
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
              `;
              field.parentNode.appendChild(errorMsg);
            }
            errorMsg.textContent = 'Please enter a valid email address';
          }
        } else {
          // Remove error message if it exists
          const errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        // For demo purposes, show success message
        e.preventDefault();
        alert('Thank you! Your form has been submitted successfully.');
        form.reset();
      }
    });
    
    // Clear error messages on input
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '#dee2e6';
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      });
    });
  });
}

// Property Filtering
function initPropertyFilter() {
  const filterForm = document.querySelector('.filter-form');
  const propertyCards = document.querySelectorAll('.property-card');
  
  if (!filterForm || !propertyCards.length) return;
  
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(filterForm);
    const filters = {
      neighborhood: formData.get('neighborhood')?.toLowerCase() || '',
      bedrooms: formData.get('bedrooms') || '',
      price: formData.get('price') || '',
      type: formData.get('type')?.toLowerCase() || ''
    };
    
    propertyCards.forEach(card => {
      const cardData = {
        neighborhood: card.dataset.neighborhood?.toLowerCase() || '',
        bedrooms: card.dataset.bedrooms || '',
        price: parseFloat(card.dataset.price) || 0,
        type: card.dataset.type?.toLowerCase() || ''
      };
      
      let matches = true;
      
      // Check neighborhood
      if (filters.neighborhood && !cardData.neighborhood.includes(filters.neighborhood)) {
        matches = false;
      }
      
      // Check bedrooms
      if (filters.bedrooms) {
        if (filters.bedrooms === '4+' && cardData.bedrooms < 4) {
          matches = false;
        } else if (filters.bedrooms !== '4+' && cardData.bedrooms !== parseInt(filters.bedrooms)) {
          matches = false;
        }
      }
      
      // Check price range
      if (filters.price) {
        const [min, max] = filters.price.split('-').map(p => p === '100+' ? Infinity : parseFloat(p));
        if (cardData.price < min || cardData.price > max) {
          matches = false;
        }
      }
      
      // Check property type
      if (filters.type && cardData.type !== filters.type) {
        matches = false;
      }
      
      // Show/hide card based on matches
      card.style.display = matches ? 'block' : 'none';
    });
  });
  
  // Reset button functionality
  const resetBtn = filterForm.querySelector('.btn-outline');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filterForm.reset();
      propertyCards.forEach(card => {
        card.style.display = 'block';
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSlider();
  initPropertyGallery();
  initFormValidation();
  initPropertyFilter();
  
  // Add loading="lazy" to all images if not already present
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Mock Data Generator (for demo purposes)
function generateMockProperties(count = 20) {
  const neighborhoods = ['Westlands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Karen', 'Runda', 'Parklands'];
  const types = ['apartment', 'house', 'townhouse', 'penthouse'];
  const statuses = ['For Sale', 'For Rent'];
  const amenities = ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Property ${i + 1} in ${neighborhoods[i % neighborhoods.length]}`,
    neighborhood: neighborhoods[i % neighborhoods.length],
    type: types[i % types.length],
    status: statuses[i % statuses.length],
    price: Math.floor(Math.random() * 100 + 5) + 'M',
    bedrooms: Math.floor(Math.random() * 5) + 1,
    bathrooms: Math.floor(Math.random() * 4) + 1,
    size: Math.floor(Math.random() * 300) + 50,
    description: `Beautiful ${types[i % types.length]} located in the heart of ${neighborhoods[i % neighborhoods.length]}. This property features modern amenities and stunning views.`,
    amenities: amenities.slice(0, Math.floor(Math.random() * amenities.length) + 1),
    image: `https://via.placeholder.com/400x300/007bff/ffffff?text=Property+${i + 1}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }));
}