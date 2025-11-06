// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Throttle function - Limita la ejecución de una función
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function - Retrasa la ejecución de una función
 */
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

/**
 * Animación de contador de números
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Animar múltiples contadores
 */
function animateAllCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        animateCounter(counter, target);
    });
}

/**
 * Scroll suave a elemento
 */
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Detectar si elemento está en viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * Formatear teléfono
 */
function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

/**
 * Validar email
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar teléfono peruano
 */
function validatePhone(phone) {
    const regex = /^(?:9\d{8}|\+51\s?9\d{8})$/;
    return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copiado al portapapeles');
    }).catch(() => {
        console.error('Error al copiar');
    });
}

/**
 * Get URLParams
 */
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params);
}

/**
 * Delay function (promise)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get device type
 */
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 480) return 'mobile-small';
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

/**
 * Add multiple event listeners
 */
function addEventListeners(selector, event, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.addEventListener(event, handler));
}

/**
 * Toggle class on elements
 */
function toggleClass(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.classList.toggle(className));
}

/**
 * Add class to element
 */
function addClass(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.classList.add(className));
}

/**
 * Remove class from element
 */
function removeClass(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.classList.remove(className));
}

/**
 * Has class check
 */
function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Generate random ID
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Capitalize string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Local storage helpers
 */
const Storage = {
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.clear();
    }
};

/**
 * Console logger helper
 */
const Logger = {
    log: (message, data = null) => {
        console.log(`%c[LOG] ${message}`, 'color: #0066cc; font-weight: bold;', data || '');
    },
    warn: (message, data = null) => {
        console.warn(`%c[WARN] ${message}`, 'color: #ff9900; font-weight: bold;', data || '');
    },
    error: (message, data = null) => {
        console.error(`%c[ERROR] ${message}`, 'color: #cc0000; font-weight: bold;', data || '');
    },
    success: (message, data = null) => {
        console.log(`%c[SUCCESS] ${message}`, 'color: #00cc00; font-weight: bold;', data || '');
    }
};
