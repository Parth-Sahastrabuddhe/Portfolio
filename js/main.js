// Theme toggle, analytics consent, and the contact form. Navigation and scrolling are plain HTML/CSS.
const GA_ID = 'G-E5YZHSZVF8';

// localStorage throws when the visitor blocks site data; every read and write goes through here.
const storage = {
    get(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch { /* storage blocked: keep the in-memory state only */ }
    },
};

// ===== Theme =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
    return root.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
}

function labelThemeToggle() {
    themeToggle.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

themeToggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    storage.set('theme', next);
    labelThemeToggle();
});

prefersDark.addEventListener('change', labelThemeToggle);
labelThemeToggle();

// ===== Analytics consent =====
function loadAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
}

const banner = document.getElementById('cookieBanner');
const consent = storage.get('cookie-consent');

if (consent === 'accepted') {
    loadAnalytics();
} else if (consent !== 'declined') {
    banner.hidden = false;
}

function answerConsent(value) {
    storage.set('cookie-consent', value);
    banner.hidden = true;
    if (value === 'accepted') loadAnalytics();
}

document.getElementById('cookieAccept').addEventListener('click', () => answerConsent('accepted'));
document.getElementById('cookieDecline').addEventListener('click', () => answerConsent('declined'));

// ===== Contact form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending…';
    formStatus.textContent = '';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
        contactForm.reset();
        formStatus.textContent = 'Message sent.';
    } catch {
        formStatus.textContent = 'Message not sent. Email sahastrabuddhe.parth@gmail.com instead.';
    } finally {
        button.disabled = false;
        button.textContent = 'Send message';
    }
});
