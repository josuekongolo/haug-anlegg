/* ========================================
   HAUG ANLEGG AS - MAIN.JS
   Elegant interactions and animations
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
});

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const body = document.body;

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

/* ========================================
   HEADER SCROLL EFFECT
   ======================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const scrollThreshold = 50;

    function handleScroll() {
        if (window.pageYOffset > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    handleScroll();
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearFormErrors();

        const isValid = validateForm();

        if (isValid) {
            const submitBtn = form.querySelector('.btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sender...';
            submitBtn.disabled = true;

            setTimeout(function() {
                showFormSuccess();
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm() {
    const form = document.querySelector('.contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dette feltet er obligatorisk';
    }
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
        }
    }
    else if (name === 'phone' && value) {
        const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');

    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearFormErrors() {
    const form = document.querySelector('.contact-form');
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.form-error');

    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(msg => msg.remove());

    const successMsg = form.parentNode.querySelector('.form-success');
    if (successMsg) {
        successMsg.remove();
    }
}

function showFormSuccess() {
    const formWrapper = document.querySelector('.contact-form-wrapper');

    const existingSuccess = formWrapper.querySelector('.form-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div style="
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 1rem 1.25rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#155724">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Takk for din henvendelse. Vi kontakter deg snart.</span>
        </div>
    `;

    formWrapper.insertBefore(successDiv, formWrapper.querySelector('.contact-form'));

    setTimeout(function() {
        if (successDiv.parentNode) {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }
    }, 5000);
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
