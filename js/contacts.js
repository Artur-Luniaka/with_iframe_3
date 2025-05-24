// Contacts page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('contacts.html')) {
        loadContactsContent();
        initContactForm();
    }
});

async function loadContactsContent() {
    try {
        const response = await fetch('data/contacts.json');
        const data = await response.json();
        
        // Update meta tags
        document.title = data.meta.title;
        document.querySelector('meta[name="description"]').setAttribute('content', data.meta.description);
        
        // Populate page content
        document.getElementById('contact-title').textContent = data.pageTitle;
        document.getElementById('contact-subtitle').textContent = data.pageSubtitle;
        document.getElementById('form-title').textContent = data.formTitle;
        
    } catch (error) {
        console.error('Error loading contacts content:', error);
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('.cta-button');
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    form.classList.add('form-loading');
    
    try {
        // Simulate form submission (replace with actual endpoint)
        await simulateFormSubmission(formData);
        
        // Show success message
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
        form.classList.remove('form-loading');
    }
}

function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-${type}`;
    messageDiv.textContent = message;
    
    // Insert message at the top of the form
    const form = document.getElementById('contact-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Form validation
document.addEventListener('input', function(e) {
    if (e.target.matches('#contact-form input, #contact-form textarea')) {
        validateField(e.target);
    }
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'text':
            isValid = value.length >= 2;
            break;
        default:
            isValid = value.length >= 10;
    }
    
    // Apply error styling if invalid
    if (!isValid && value.length > 0) {
        field.classList.add('error');
    }
    
    return isValid;
}