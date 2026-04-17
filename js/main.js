// ===== Cookie Consent & Google Analytics =====
const GA_ID = 'G-E5YZHSZVF8';

function loadGA() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
}

(function initCookieConsent() {
    const banner = document.getElementById('cookieBanner');
    const consent = localStorage.getItem('cookie-consent');

    if (consent === 'accepted') {
        loadGA();
    } else if (consent !== 'declined') {
        banner.classList.add('visible');
    }

    document.getElementById('cookieAccept').addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.classList.remove('visible');
        loadGA();
    });

    document.getElementById('cookieDecline').addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        banner.classList.remove('visible');
    });
})();

// ===== DOM Elements =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('.section');
const navbar = document.querySelector('.navbar');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');

// ===== Theme Toggle =====
function getTheme() {
    return document.documentElement.getAttribute('data-theme');
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
});

// ===== Mobile Navigation =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const updateActiveLink = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.querySelectorAll('a').forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ===== Intersection Observer: Fade-in =====
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1 }
);

sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ===== Smooth Scroll with Navbar Offset =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = navbar.offsetHeight;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    });
});

// ===== Project Category Filters =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Contact Form =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        const status = document.getElementById('formStatus');

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btn.disabled = true;
        status.textContent = '';
        status.className = 'form-status';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.textContent = 'Message sent! I\'ll get back to you soon.';
                status.classList.add('success');
                contactForm.reset();
            } else {
                status.textContent = 'Something went wrong. Please try again or email me directly.';
                status.classList.add('error');
            }
        } catch {
            status.textContent = 'Network error. Please try again or email me directly.';
            status.classList.add('error');
        }

        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btn.disabled = false;
    });
}
