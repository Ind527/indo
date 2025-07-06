// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeProductTabs();
    initializeScrollAnimations();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeScrollSpy();
});

// Navigation Toggle for Mobile
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Product Category Tabs
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const productCategories = document.querySelectorAll('.product-category');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');

            // Remove active class from all buttons and categories
            tabButtons.forEach(btn => btn.classList.remove('active'));
            productCategories.forEach(category => category.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding category
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');

                // Add fade-in animation
                targetElement.style.opacity = '0';
                setTimeout(() => {
                    targetElement.style.opacity = '1';
                }, 100);
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const buttons = document.querySelectorAll('a[href^="#"]');

    buttons.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Only prevent default for hash links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Set active class for current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll Spy for Navigation
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.product-card, .service-card, .step, .about-stats .stat');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter Animation
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/\d/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    // Only initialize if contact form exists on the page
    if (!contactForm) return;

    const formGroups = document.querySelectorAll('.form-group');

    // Add input event listeners for validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        }
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            submitForm();
        }
    });
}

// Form Validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const product = document.getElementById('product');
    const message = document.getElementById('message');

    let isValid = true;

    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
        showFieldError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate product selection
    if (!product.value) {
        showFieldError(product, 'Please select a product category');
        isValid = false;
    }

    // Validate message
    if (!message.value.trim()) {
        showFieldError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');

    switch (fieldName) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Name is required');
                return false;
            } else if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
                return false;
            }
            break;

        case 'email':
            if (!value) {
                showFieldError(field, 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;

        case 'product':
            if (!value) {
                showFieldError(field, 'Please select a product category');
                return false;
            }
            break;

        case 'message':
            if (!value) {
                showFieldError(field, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters');
                return false;
            }
            break;
    }

    clearFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    field.classList.add('error');

    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    field.classList.remove('error');

    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit form
function submitForm() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showSuccessMessage();

        // Reset form
        document.getElementById('contactForm').reset();

        // Reset button
        submitButton.classList.remove('loading');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
    `;

    form.insertBefore(successDiv, form.firstChild);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Product Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Remove Parallax Effect for Hero Section
/*
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-image img');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});
*/

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading if needed
// initializeLazyLoading();

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (if needed)
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const productText = product.textContent.toLowerCase();
                if (productText.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }, 300));
    }
}

// Performance optimization
function optimizePerformance() {
    // Add passive event listeners for better scrolling performance
    document.addEventListener('scroll', function() {
        // Scroll-related functions
    }, { passive: true });

    // Preload critical images
    const criticalImages = [
        'https://pixabay.com/get/g381f7ddda31014e5e529809cbf6c682f1684e40d716177fdb5484da82c53299a86c8fa990004ea9365346e8c03a41c18fb8eea29cabb7f825b6e1d22e53bfe5b_1280.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize performance optimizations
optimizePerformance();

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Print styles handling
window.addEventListener('beforeprint', function() {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('print-mode');
});
```

```javascript
// This code modifies the original JavaScript file to remove the parallax effect on the hero image and adds a null check for the contact form.
// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeProductTabs();
    initializeScrollAnimations();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeScrollSpy();
});

// Navigation Toggle for Mobile
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle mobile menu
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
          navMenu.classList.toggle('active');
          navToggle.classList.toggle('active');
      });
    }

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Product Category Tabs
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const productCategories = document.querySelectorAll('.product-category');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');

            // Remove active class from all buttons and categories
            tabButtons.forEach(btn => btn.classList.remove('active'));
            productCategories.forEach(category => category.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding category
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');

                // Add fade-in animation
                targetElement.style.opacity = '0';
                setTimeout(() => {
                    targetElement.style.opacity = '1';
                }, 100);
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const buttons = document.querySelectorAll('a[href^="#"]');

    buttons.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Only prevent default for hash links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Set active class for current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll Spy for Navigation
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.product-card, .service-card, .step, .about-stats .stat');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter Animation
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/\d/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    // Only initialize if contact form exists on the page
    if (!contactForm) return;

    const formGroups = document.querySelectorAll('.form-group');

    // Add input event listeners for validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        }
    });

    // Form submission
    if(contactForm){
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm()) {
                submitForm();
            }
        });
    }
}

// Form Validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const product = document.getElementById('product');
    const message = document.getElementById('message');

    let isValid = true;

    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
        showFieldError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate product selection
    if (!product.value) {
        showFieldError(product, 'Please select a product category');
        isValid = false;
    }

    // Validate message
    if (!message.value.trim()) {
        showFieldError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');

    switch (fieldName) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Name is required');
                return false;
            } else if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
                return false;
            }
            break;

        case 'email':
            if (!value) {
                showFieldError(field, 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;

        case 'product':
            if (!value) {
                showFieldError(field, 'Please select a product category');
                return false;
            }
            break;

        case 'message':
            if (!value) {
                showFieldError(field, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showFieldError(field, 'Message must be at least 10 characters');
                return false;
            }
            break;
    }

    clearFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    field.classList.add('error');

    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    field.classList.remove('error');

    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit form
function submitForm() {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    if(!submitButton) return;

    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showSuccessMessage();

        // Reset form
        document.getElementById('contactForm').reset();

        // Reset button
        submitButton.classList.remove('loading');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    if(!form) return;
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
    `;

    form.insertBefore(successDiv, form.firstChild);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Product Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Remove Parallax Effect for Hero Section
// Removing the event listener and related code
/*window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-image img');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});*/

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading if needed
// initializeLazyLoading();

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (if needed)
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const productText = product.textContent.toLowerCase();
                if (productText.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }, 300));
    }
}

// Performance optimization
function optimizePerformance() {
    // Add passive event listeners for better scrolling performance
    document.addEventListener('scroll', function() {
        // Scroll-related functions
    }, { passive: true });

    // Preload critical images
    const criticalImages = [
        'https://pixabay.com/get/g381f7ddda31014e5e529809cbf6c682f1684e40d716177fdb5484da82c53299a86c8fa990004ea9365346e8c03a41c18fb8eea29cabb7f825b6e1d22e53bfe5b_1280.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize performance optimizations
optimizePerformance();

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Print styles handling
window.addEventListener('beforeprint', function() {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('print-mode');
});