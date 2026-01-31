// ===== DOM Elements =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const typedName = document.getElementById('typed-name');
const skillBars = document.querySelectorAll('.skill-progress');
const sections = document.querySelectorAll('.section');

// ===== Configuration =====
const CONFIG = {
    name: 'Parth Sahastrabuddhe',
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2000
};

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger
    const hamburger = navToggle.querySelector('.hamburger');
    hamburger.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== Typing Animation =====
class TypeWriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
    }

    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start() {
        this.element.textContent = '';
        this.currentIndex = 0;
        this.type();
    }
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    if (typedName) {
        const typeWriter = new TypeWriter(typedName, CONFIG.name, CONFIG.typingSpeed);
        setTimeout(() => typeWriter.start(), 500);
    }
});

// ===== Skill Bars Animation =====
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const rect = bar.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            bar.style.width = `${progress}%`;
        }
    });
};

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars when skills section is visible
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ===== Smooth Scrolling for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Navbar Background on Scroll =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== Active Navigation Link =====
const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// ===== Console Easter Egg =====
console.log('%c Welcome to my portfolio!', 'color: #00ff00; font-size: 20px; font-weight: bold;');
console.log('%c Built with HTML, CSS & JavaScript', 'color: #00d9ff; font-size: 14px;');
console.log('%c Feel free to explore the code!', 'color: #ffd700; font-size: 14px;');

// ===== Prevent FOUC (Flash of Unstyled Content) =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});
