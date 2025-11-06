// =============================================
// NAVIGATION CONTROLLER
// =============================================

class NavigationController {
    constructor() {
        this.header = document.getElementById('header');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveLink();
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Close menu on link click
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMobileMenu();
            }
        });

        // Header scroll effect
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        // Update active state
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');

        // Navigate if it's internal
        if (href.startsWith('#')) {
            smoothScroll(href);
        } else {
            window.location.href = href;
        }
    }

    updateActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes(currentPage) || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    new NavigationController();
});
