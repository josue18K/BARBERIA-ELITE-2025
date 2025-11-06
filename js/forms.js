// =============================================
// FORM HANDLER - RESERVATIONS
// =============================================

class FormHandler {
    constructor() {
        this.form = document.getElementById('reservationForm');
        this.formSuccess = document.getElementById('formSuccess');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            Logger.warn('Formulario no válido');
            return;
        }

        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Log data
        Logger.log('Formulario enviado', data);

        // Store in local storage
        Storage.set('lastReservation', {
            ...data,
            timestamp: new Date().toISOString()
        });

        // Show success message
        this.showSuccessMessage();

        // Reset form
        this.form.reset();

        // Send to server (uncomment when ready)
        // this.sendToServer(data);
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;

        // Required validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email validation
        if (type === 'email' && value && !validateEmail(value)) {
            isValid = false;
        }

        // Phone validation
        if (name === 'telefono' && value && !validatePhone(value)) {
            isValid = false;
        }

        // Date validation (must be future date)
        if (name === 'fecha' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                isValid = false;
            }
        }

        // Update field styling
        this.updateFieldStyle(input, isValid);

        return isValid;
    }

    updateFieldStyle(input, isValid) {
        if (isValid) {
            input.style.borderColor = 'var(--primary)';
        } else {
            input.style.borderColor = '#cc0000';
        }
    }

    showSuccessMessage() {
        this.form.style.display = 'none';
        this.formSuccess.style.display = 'flex';

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }

    resetForm() {
        this.form.style.display = 'block';
        this.formSuccess.style.display = 'none';
        this.form.reset();
    }

    async sendToServer(data) {
        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Logger.success('Reserva enviada correctamente');
            } else {
                Logger.error('Error al enviar la reserva');
            }
        } catch (error) {
            Logger.error('Error de conexión', error);
        }
    }
}

// =============================================
// DATE INPUT - MIN DATE (TODAY)
// =============================================

function setMinDate() {
    const dateInput = document.getElementById('fecha');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// =============================================
// SERVICE FILTER
// =============================================

class ServiceFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.serviceCards = document.querySelectorAll('.service-card');
        if (this.filterBtns.length > 0) {
            this.init();
        }
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    handleFilter(e) {
        const filterValue = e.target.dataset.filter;

        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter cards
        this.serviceCards.forEach(card => {
            const category = card.dataset.category;
            
            if (filterValue === 'all' || category.includes(filterValue)) {
                card.style.display = '';
                card.classList.add('fade-in-up');
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
    new ServiceFilter();
    setMinDate();
});

// Expose resetForm globally
function resetForm() {
    const formHandler = new FormHandler();
    formHandler.resetForm();
}
