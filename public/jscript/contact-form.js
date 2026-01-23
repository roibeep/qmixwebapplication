/**
 * Contact Form Handler with EmailJS Integration
 * 
 * Usage:
 * 1. Include EmailJS library in your HTML: <script src="https://cdn.emailjs.com/npm/@emailjs/browser@3/dist/email.min.js"></script>
 * 2. Include this file: <script src="contact-form.js"></script>
 * 3. Update the EMAIL_CONFIG object below with your EmailJS credentials
 * 4. Make sure your HTML form has the correct IDs (see README section below)
 */

// Configuration - REPLACE WITH YOUR EMAILJS DETAILS
const EMAIL_CONFIG = {
    serviceId: 'service_3irdylo',        // Replace with your EmailJS service ID
    templateId: 'template_7rql2td',      // Replace with your EmailJS template ID
    publicKey: 'lmJdVccIklS_hezDE',        // Replace with your EmailJS public key
    toEmail: 'qmixitsdepartment@gmail.com'      // Replace with your email address
};

/**
 * HTML FORM REQUIREMENTS:
 * Your HTML form must have these IDs:
 * 
 * <form id="contactForm">
 *     <input type="text" id="name" required>
 *     <input type="email" id="email" required>
 *     <input type="tel" id="phone"> <!-- optional -->
 *     <input type="text" id="subject"> <!-- optional -->
 *     <textarea id="message" required></textarea>
 *     <button type="submit">Send Message</button>
 *     <div id="formMessage"></div> <!-- for displaying success/error messages -->
 * </form>
 */

class ContactFormHandler {
    constructor(config = EMAIL_CONFIG) {
        this.config = config;
        this.init();
    }

    init() {
        // Initialize EmailJS when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.config.publicKey);
        } else {
            console.error('EmailJS library not found. Please include EmailJS script before this file.');
            return;
        }

        // Set up form event listener
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        } else {
            console.warn('Contact form with ID "contactForm" not found.');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        const formMessage = document.getElementById('formMessage');
        
        if (!this.validateForm(formData, formMessage)) {
            return;
        }
        
        this.setLoadingState(true);
        
        try {
            await this.sendEmail(formData);
            this.showMessage(formMessage, 'Message sent successfully! We will get back to you soon.', 'success');
            document.getElementById('contactForm').reset();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            this.showMessage(formMessage, 'Failed to send message. Please try again or contact us directly.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    getFormData() {
        return {
            name: document.getElementById('name')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            subject: document.getElementById('subject')?.value.trim() || 'Contact Form Submission',
            message: document.getElementById('message')?.value.trim() || ''
        };
    }

    validateForm(formData, messageElement) {
        if (!formData.name || !formData.email || !formData.message) {
            this.showMessage(messageElement, 'Please fill in all required fields!', 'error');
            return false;
        }
        
        if (!this.validateEmail(formData.email)) {
            this.showMessage(messageElement, 'Please enter a valid email address!', 'error');
            return false;
        }
        
        if (formData.name.length < 2) {
            this.showMessage(messageElement, 'Name must be at least 2 characters long!', 'error');
            return false;
        }
        
        if (formData.message.length < 10) {
            this.showMessage(messageElement, 'Message must be at least 10 characters long!', 'error');
            return false;
        }
        
        return true;
    }

    async sendEmail(formData) {
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || 'Not provided',
            subject: formData.subject,
            message: formData.message,
            to_email: this.config.toEmail
        };
        
        return emailjs.send(this.config.serviceId, this.config.templateId, templateParams);
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    showMessage(messageElement, message, type) {
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        messageElement.style.padding = '15px';
        messageElement.style.borderRadius = '10px';
        messageElement.style.marginBottom = '20px';
        messageElement.style.fontWeight = 'bold';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#d4edda';
            messageElement.style.color = '#155724';
            messageElement.style.border = '1px solid #c3e6cb';
            
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        } else {
            messageElement.style.backgroundColor = '#f8d7da';
            messageElement.style.color = '#721c24';
            messageElement.style.border = '1px solid #f5c6cb';
        }
    }

    setLoadingState(isLoading) {
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        
        if (submitBtn) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending...';
                submitBtn.style.opacity = '0.7';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
                submitBtn.style.opacity = '1';
            }
        }
    }

    // Public method to update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.config.publicKey);
        }
    }
}

// Initialize the contact form handler
const contactFormHandler = new ContactFormHandler();

// Export for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
}