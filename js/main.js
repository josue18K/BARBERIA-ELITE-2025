// =============================================
// MAIN APPLICATION
// =============================================

class BarberiaEliteApp {
    constructor() {
        this.init();
    }

    init() {
        Logger.success('Barbería Elite App Iniciada');
        this.setupGlobalListeners();
        this.customizeForDevice();
    }

    setupGlobalListeners() {
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Logger.log('Página oculta');
            } else {
                Logger.log('Página visible');
            }
        });
    }

    customizeForDevice() {
        const deviceType = getDeviceType();
        Logger.log('Device Type:', deviceType);

        // Add device class to body
        document.body.classList.add(`device-${deviceType}`);
    }

    handleResize() {
        const newDeviceType = getDeviceType();
        Logger.log('Window resized. New device:', newDeviceType);
    }
}

// =============================================
// SMOOTH SCROLL BEHAVIOR
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            smoothScroll(href);
        }
    });
});

// =============================================
// LOAD ANIMATIONS
// =============================================

window.addEventListener('load', () => {
    Logger.success('Página completamente cargada');
    document.body.classList.add('loaded');
});

// =============================================
// APP INITIALIZATION
// =============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new BarberiaEliteApp();
});

// Handle service card clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.service-preview-card')) {
        const card = e.target.closest('.service-preview-card');
        Logger.log('Servicio seleccionado', card);
    }
});

// =============================================
// PERFOMANCE MONITORING
// =============================================

window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        Logger.log(`Tiempo de carga: ${pageLoadTime}ms`);
    }
});

// =============================================
// ERROR HANDLING
// =============================================

window.addEventListener('error', (event) => {
    Logger.error('Error Global', event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    Logger.error('Promise Rejection', event.reason);
});
