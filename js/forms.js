// =============================================
// ADVANCED FORM HANDLER
// =============================================

class AdvancedFormHandler {
    constructor() {
        this.reservationForm = document.getElementById('reservationForm');
        this.contactForm = document.getElementById('contactForm');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.faqItems = document.querySelectorAll('.faq-item');
        
        this.init();
    }

    init() {
        this.setupFormListeners();
        this.setupFAQ();
        this.setMinDate();
        this.setupCharCounters();
    }

    setupFormListeners() {
        if (this.reservationForm) {
            this.reservationForm.addEventListener('submit', (e) => this.handleReservation(e));
            this.setupReservationValidation();
        }

        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
            this.setupContactValidation();
        }

        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletter(e));
        }
    }

    setupReservationValidation() {
        const inputs = this.reservationForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.validateField(input));
        });
    }

    setupContactValidation() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.validateField(input));
        });
    }

    validateField(input) {
        let isValid = true;
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;

        // Required validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email validation
        if (type === 'email' && value && !this.validateEmail(value)) {
            isValid = false;
        }

        // Phone validation
        if (name === 'telefono' && value && !this.validatePhone(value)) {
            isValid = false;
        }

        // Date validation
        if (name === 'fecha' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                isValid = false;
            }
        }

        // Min length validation
        if (input.hasAttribute('minlength')) {
            const minLength = parseInt(input.getAttribute('minlength'));
            if (value.length < minLength && value.length > 0) {
                isValid = false;
            }
        }

        this.updateFieldStyle(input, isValid);
        return isValid;
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validatePhone(phone) {
        const regex = /^[0-9\s\-\+\(\)]{9,}$/;
        return regex.test(phone.replace(/\s/g, ''));
    }

    updateFieldStyle(input, isValid) {
        if (isValid || input.value === '') {
            input.style.borderColor = 'var(--border-light)';
        } else {
            input.style.borderColor = '#ff6b6b';
        }
    }

    handleReservation(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.reservationForm.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            Logger.warn('Formulario de reserva no válido');
            this.showFieldError('Por favor completa todos los campos correctamente');
            return;
        }

        // Collect data
        const formData = new FormData(this.reservationForm);
        const data = Object.fromEntries(formData);

        Logger.success('Reserva enviada', data);
        Storage.set('lastReservation', { ...data, timestamp: new Date().toISOString() });

        this.showSuccess(this.reservationForm, 'formSuccess');
    }

    handleContactForm(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            Logger.warn('Formulario de contacto no válido');
            this.showFieldError('Por favor completa todos los campos correctamente');
            return;
        }

        // Collect data
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);

        Logger.success('Mensaje enviado', data);
        Storage.set('lastMessage', { ...data, timestamp: new Date().toISOString() });

        this.showSuccess(this.contactForm, 'contactFormSuccess');
    }

    handleNewsletter(e) {
        e.preventDefault();

        const form = e.target;
        const input = form.querySelector('input[type="email"]');
        const email = input.value.trim();

        if (!this.validateEmail(email)) {
            Logger.warn('Email inválido para newsletter');
            input.style.borderColor = '#ff6b6b';
            return;
        }

        Logger.success('Suscrito al newsletter', { email });
        Storage.set('newsletter', { email, timestamp: new Date().toISOString() });

        // Show success
        const button = form.querySelector('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="material-icons-round">check_circle</i><span>¡Suscrito!</span>';
        button.style.background = '#00cc00';

        // Reset
        setTimeout(() => {
            form.reset();
            button.innerHTML = originalText;
            button.style.background = '';
            input.style.borderColor = '';
        }, 3000);
    }

    showSuccess(form, successElementId) {
        const successElement = document.getElementById(successElementId);
        form.style.display = 'none';
        successElement.style.display = 'flex';

        setTimeout(() => {
            this.resetForm(form, successElementId);
        }, 5000);
    }

    resetForm(form, successElementId) {
        const successElement = document.getElementById(successElementId);
        form.style.display = 'block';
        successElement.style.display = 'none';
        form.reset();
    }

    showFieldError(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    setMinDate() {
        const dateInput = document.getElementById('fecha');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    setupCharCounters() {
        const mensaje = document.getElementById('mensaje');
        const charCount = document.getElementById('charCount');
        const contactMensaje = document.getElementById('contact-mensaje');
        const contactCharCount = document.getElementById('contactCharCount');

        if (mensaje && charCount) {
            mensaje.addEventListener('input', () => {
                charCount.textContent = mensaje.value.length;
            });
        }

        if (contactMensaje && contactCharCount) {
            contactMensaje.addEventListener('input', () => {
                contactCharCount.textContent = contactMensaje.value.length;
            });
        }
    }

    setupFAQ() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other items
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedFormHandler();
});

// Global functions
function resetReservationForm() {
    const form = document.getElementById('reservationForm');
    const success = document.getElementById('formSuccess');
    const handler = new AdvancedFormHandler();
    handler.resetForm(form, 'formSuccess');
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('contactFormSuccess');
    const handler = new AdvancedFormHandler();
    handler.resetForm(form, 'contactFormSuccess');
}
