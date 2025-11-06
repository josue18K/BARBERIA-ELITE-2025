// =============================================
// INTERSECTION OBSERVER - SCROLL ANIMATIONS
// =============================================

class ScrollAnimations {
    constructor() {
        this.observedElements = new WeakMap();
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .fade-in, .scale-in, .slide-in-up'
        );

        fadeElements.forEach(element => {
            this.observer.observe(element);
        });

        // Observe stat counters
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    animateElement(element) {
        // Check if element has animation class
        const hasAnimation = element.classList.contains('fade-in-up') ||
                           element.classList.contains('fade-in-down') ||
                           element.classList.contains('fade-in-left') ||
                           element.classList.contains('fade-in-right') ||
                           element.classList.contains('fade-in') ||
                           element.classList.contains('scale-in') ||
                           element.classList.contains('slide-in-up');

        if (hasAnimation) {
            // Animation already applied via CSS
            return;
        }

        // Animate counters
        if (element.classList.contains('stat-number')) {
            const target = parseInt(element.dataset.count);
            if (!isNaN(target)) {
                animateCounter(element, target, 2000);
            }
        }
    }
}

// =============================================
// PARALLAX EFFECT
// =============================================

class ParallaxEffect {
    constructor() {
        this.parallaxElements = document.querySelectorAll('.parallax');
        this.init();
    }

    init() {
        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', throttle(() => this.updateParallax(), 16));
        }
    }

    updateParallax() {
        this.parallaxElements.forEach(element => {
            const scrollPosition = window.scrollY;
            const elementPosition = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;

            // Only apply parallax if element is visible
            if (elementPosition + elementHeight > scrollPosition && elementPosition < scrollPosition + windowHeight) {
                const offset = (scrollPosition - elementPosition) * 0.5;
                element.style.backgroundPosition = `center ${offset}px`;
            }
        });
    }
}

// =============================================
// SCROLL TO TOP BUTTON
// =============================================

class ScrollToTopButton {
    constructor() {
        this.button = document.getElementById('scrollTop');
        if (this.button) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', throttle(() => this.toggleButton(), 100));
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleButton() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new ParallaxEffect();
    new ScrollToTopButton();
});
