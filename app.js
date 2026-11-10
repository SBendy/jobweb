// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Compact navigation on phones.
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const mobileNavigation = window.matchMedia('(max-width: 768px)');

function setMobileMenu(open) {
    header.classList.toggle('menu-open', open);
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    }
}

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        setMobileMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mainNav.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMobileMenu(false);
    });
    document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setMobileMenu(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('menu-open')) {
            setMobileMenu(false);
            menuToggle.focus();
        }
    });
    mobileNavigation.addEventListener('change', () => setMobileMenu(false));
}

// Contacts Modal
const contactsBtn = document.getElementById('contactsBtn');
const contactsModal = document.getElementById('contactsModal');
const modalClose = document.getElementById('modalClose');

if (contactsBtn && contactsModal) {
    contactsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (modalClose && contactsModal) {
    modalClose.addEventListener('click', () => {
        contactsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal on overlay click
    contactsModal.addEventListener('click', (e) => {
        if (e.target === contactsModal) {
            contactsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactsModal.classList.contains('active')) {
            contactsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Reveal each block once, when it enters the viewport.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileRevealElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .contact-card, .contacts-actions, ' +
    '.contacts-map-panel, .warranty-content, .warranty-image, .footer-logo, ' +
    '.footer-column, .footer-social, .footer-bottom'
);
mobileRevealElements.forEach((element) => {
    element.classList.add('mobile-reveal');
    const siblings = Array.from(element.parentElement.children);
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 2) * 60}ms`);
});
const revealElements = document.querySelectorAll('.fade-in, .mobile-reveal');
let revealObserver;
if ('IntersectionObserver' in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('visible'));
}
reducedMotion.addEventListener('change', (event) => {
    if (!event.matches) return;
    if (revealObserver) revealObserver.disconnect();
    revealElements.forEach((element) => element.classList.add('visible'));
});

// News tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const newsGrid = document.getElementById('newsGrid');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked tab
        btn.classList.add('active');
        
        // Here you would typically filter news items
        // For now, just animate the grid
        if (newsGrid) {
            newsGrid.style.opacity = '0';
            setTimeout(() => {
                newsGrid.style.opacity = '1';
            }, 300);
        }
    });
});

// Promo widget: контент и таймер — в home-content.js (content/promo/meta.json)

// Legal sections toggle
const legalItems = document.querySelectorAll('.legal-item');

legalItems.forEach(item => {
    const title = item.querySelector('.legal-title');
    if (title) {
        title.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            legalItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

// Address section - no search needed for single address

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Action buttons (Learn more / Details / View all)
document.querySelectorAll('[data-scroll-target]').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        const targetSelector = button.getAttribute('data-scroll-target');
        if (!targetSelector) return;

        const target = document.querySelector(targetSelector);
        if (!target) return;

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Navigation to detail pages from cards/buttons
document.querySelectorAll('[data-detail-url]').forEach((element) => {
    const isCard = element.classList.contains('offer-card') || element.classList.contains('news-card');
    if (isCard) return;

    const openDetailsPage = () => {
        const detailUrl = element.getAttribute('data-detail-url');
        if (!detailUrl) return;
        window.location.href = detailUrl;
    };

    element.addEventListener('click', (event) => {
        // Preserve behavior for interactive controls inside cards.
        if (event.target.closest('button, a') && event.target !== element) return;
        openDetailsPage();
    });

    element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetailsPage();
        }
    });
});

// Preview modal for offer/news cards with follow-up "Подробнее"
const detailsPreviewModal = document.getElementById('detailsPreviewModal');
const detailsPreviewClose = document.getElementById('detailsPreviewClose');
const detailsPreviewTitle = document.getElementById('detailsPreviewTitle');
const detailsPreviewText = document.getElementById('detailsPreviewText');
const detailsPreviewAction = document.getElementById('detailsPreviewAction');
let detailsPreviewUrl = '';

function closeDetailsPreview() {
    if (!detailsPreviewModal) return;
    detailsPreviewModal.classList.remove('active');
    document.body.style.overflow = '';
}

function openDetailsPreview({ title, text, url }) {
    if (!detailsPreviewModal || !detailsPreviewTitle || !detailsPreviewText || !detailsPreviewAction) return;

    detailsPreviewTitle.textContent = title || 'Подробнее';
    detailsPreviewText.textContent = text || 'Краткая информация скоро появится.';
    detailsPreviewUrl = url || '';
    detailsPreviewAction.href = detailsPreviewUrl || '#';

    detailsPreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

document.querySelectorAll(
    '.offer-card[data-catalog="special-offer"], .news-card[data-catalog="news"], .offer-card[data-catalog="service"]'
).forEach((card) => {
    const openCardPreview = () => {
        const detailUrl = card.getAttribute('data-detail-url');
        if (!detailUrl) return;
        const titleEl = card.querySelector('.offer-title, .news-title');
        const textEl = card.querySelector('.offer-desc, .news-date');
        const title = titleEl ? titleEl.textContent.trim() : 'Подробнее';
        const text = textEl ? textEl.textContent.trim() : 'Краткая информация по выбранному материалу.';

        openDetailsPreview({ title, text, url: detailUrl });
    };

    card.addEventListener('click', openCardPreview);
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openCardPreview();
        }
    });
});

if (detailsPreviewClose && detailsPreviewModal) {
    detailsPreviewClose.addEventListener('click', closeDetailsPreview);
    detailsPreviewModal.addEventListener('click', (event) => {
        if (event.target === detailsPreviewModal) {
            closeDetailsPreview();
        }
    });
}

if (detailsPreviewAction) {
    detailsPreviewAction.addEventListener('click', (event) => {
        event.preventDefault();
        if (!detailsPreviewUrl) return;
        window.location.href = detailsPreviewUrl;
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && detailsPreviewModal && detailsPreviewModal.classList.contains('active')) {
        closeDetailsPreview();
    }
});

// Service items hover effect enhancement
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(139, 92, 246, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        item.style.position = 'relative';
        item.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Главная страница: тексты и изображения только из content/ (см. home-content.js)
(async function initHomeFromContent() {
    try {
        if (typeof window.loadHomeCatalogContent === 'function') {
            await window.loadHomeCatalogContent();
        }
    } catch (e) {
        console.warn(e);
    }
})();

// Model cards parallax effect
const modelCards = document.querySelectorAll('.model-card');
modelCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Offer cards click effect
const offerCards = document.querySelectorAll('.offer-card');
offerCards.forEach(card => {
    card.addEventListener('click', () => {
        if (mobileNavigation.matches || reducedMotion.matches) return;
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
});

// News cards click effect
const newsCards = document.querySelectorAll('.news-card');
newsCards.forEach(card => {
    card.addEventListener('click', () => {
        if (mobileNavigation.matches || reducedMotion.matches) return;
        card.style.transform = 'scale(0.98) translateY(-4px)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
});

// Button click animations
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }
});

// Image loading and error handling
const images = document.querySelectorAll('img');
images.forEach(img => {
    // Add loading="lazy" for better performance
    if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
    }
    
    // Handle image load errors with fallback
    img.addEventListener('error', function() {
        this.style.background = 'linear-gradient(135deg, var(--purple-primary), var(--purple-dark))';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.color = 'white';
        this.style.fontSize = '14px';
        this.alt = 'Изображение не загружено';
    });
    
    // Add fade-in animation when image loads
    img.addEventListener('load', function() {
        this.classList.add('loaded');
        this.style.opacity = '1';
    });
    
    // If image is already loaded (cached), show it immediately
    if (img.complete) {
        img.classList.add('loaded');
        img.style.opacity = '1';
    }
});

// Initialize animations on load
window.addEventListener('load', () => {
    // Animate hero elements
    const heroLabel = document.querySelector('.hero-label');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero-text .btn');
    
    if (heroLabel) {
        setTimeout(() => heroLabel.style.opacity = '1', 200);
    }
    if (heroTitle) {
        setTimeout(() => heroTitle.style.opacity = '1', 400);
    }
    if (heroSubtitle) {
        setTimeout(() => heroSubtitle.style.opacity = '1', 600);
    }
    if (heroBtn) {
        setTimeout(() => heroBtn.style.opacity = '1', 800);
    }
});

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

