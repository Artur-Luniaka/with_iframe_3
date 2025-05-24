// Contacts page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contacts.html')) {
        initContactsPage();
    }
});

function initContactsPage() {
    loadContactsContent();
    initContactForm();
    initContactAnimations();
}

async function loadContactsContent() {
    try {
        const response = await fetch('data/contacts.json');
        const contactsData = await response.json();
        
        // Update page meta tags
        if (contactsData.meta) {
            updateContactsMetaTags(contactsData.meta);
        }
        
        // Update contact information
        if (contactsData.contact) {
            updateContactInfo(contactsData.contact);
        }
        
    } catch (error) {
        console.error('Error loading contacts content:', error);
        // Use default content already in HTML
    }
}

function updateContactsMetaTags(meta) {
    if (meta.title) {
        document.title = meta.title;
    }
    
    if (meta.description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', meta.description);
        }
    }
}

function updateContactInfo(contact) {
    // Update address
    const addressElement = document.querySelector('.contact-info .info-item p');
    if (addressElement && contact.address) {
        addressElement.innerHTML = `${contact.address.street}<br>${contact.address.city} ${contact.address.state} ${contact.address.postcode}<br>${contact.address.country}`;
    }
    
    // Update phone
    const phoneElements = document.querySelectorAll('.contact-info p');
    phoneElements.forEach(el => {
        if (el.textContent.includes('Phone:') && contact.phone) {
            el.innerHTML = `<strong>Phone:</strong><br>${contact.phone}`;
        }
    });
    
    // Update map if coordinates provided
    if (contact.coordinates) {
        updateMap(contact.coordinates);
    }
}

function updateMap(coordinates) {
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe && coordinates.lat && coordinates.lng) {
        const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.7!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${coordinates.lat}%2C${coordinates.lng}!5e0!3m2!1sen!2sau!4v1234567890`;
        mapIframe.src = mapUrl;
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Form validation
    const formFields = {
        name: contactForm.querySelector('#name'),
        email: contactForm.querySelector('#email'),
        message: contactForm.querySelector('#message')
    };
    
    // Add real-time validation
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(field, fieldName));
            field.addEventListener('input', () => clearFieldError(field));
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, formFields);
    });
    
    // Add floating label effect
    Object.values(formFields).forEach(field => {
        if (field) {
            addFloatingLabelEffect(field);
        }
    });
}

function validateField(field, fieldName) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    // Remove existing error states
    formGroup.classList.remove('error', 'success');
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(formGroup, errorMessage);
    } else {
        showFieldSuccess(formGroup);
    }
    
    return isValid;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function showFieldSuccess(formGroup) {
    formGroup.classList.add('success');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function addFloatingLabelEffect(field) {
    const label = field.previousElementSibling;
    if (!label || label.tagName !== 'LABEL') return;
    
    // Check if field has value on load
    if (field.value.trim()) {
        label.classList.add('floating');
    }
    
    field.addEventListener('focus', () => {
        label.classList.add('floating');
    });
    
    field.addEventListener('blur', () => {
        if (!field.value.trim()) {
            label.classList.remove('floating');
        }
    });
}

async function handleFormSubmission(form, fields) {
    // Validate all fields
    let isFormValid = true;
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field && !validateField(field, fieldName)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showFormError('Please correct the errors above');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Launching Message...';
    submitButton.disabled = true;
    
    try {
        // Simulate form submission (replace with actual endpoint)
        await simulateFormSubmission({
            name: fields.name.value,
            email: fields.email.value,
            message: fields.message.value
        });
        
        showFormSuccess();
        form.reset();
        
        // Reset floating labels
        Object.values(fields).forEach(field => {
            const label = field.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.remove('floating');
            }
        });
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormError('Failed to send message. Please try again.');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% chance)
            if (Math.random() > 0.1) {
                console.log('Form submitted:', formData);
                resolve();
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

function showFormSuccess() {
    const form = document.getElementById('contact-form');
    let successMessage = document.querySelector('.success-message');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        form.parentNode.insertBefore(successMessage, form);
    }
    
    successMessage.innerHTML = `
        <strong>🚀 Message Launched Successfully!</strong><br>
        Thanks for reaching out! We'll spin back to you within 24 hours.
    `;
    successMessage.classList.add('show');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showFormError(message) {
    const form = document.getElementById('contact-form');
    let errorMessage = document.querySelector('.form-error-message');
    
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
        `;
        form.parentNode.insertBefore(errorMessage, form);
    }
    
    errorMessage.textContent = message;
    
    // Hide error message after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 5000);
}

function initContactAnimations() {
    // Animate contact sections
    const contactSections = document.querySelectorAll('.contact-form-section, .contact-info-section');
    
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                contactObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    contactSections.forEach(section => {
        contactObserver.observe(section);
    });
    
    // Animate form fields
    const formFields = document.querySelectorAll('.form-group');
    formFields.forEach((field, index) => {
        field.style.opacity = '0';
        field.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            field.style.transition = 'all 0.5s ease-out';
            field.style.opacity = '1';
            field.style.transform = 'translateX(0)';
        }, index * 200 + 500);
    });
    
    // Animate contact info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200 + 700);
    });
    
    // Map animation
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.style.opacity = '0';
        mapContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            mapContainer.style.transition = 'all 0.6s ease-out';
            mapContainer.style.opacity = '1';
            mapContainer.style.transform = 'scale(1)';
        }, 1000);
    }
}

// Add character counter for message field
function addCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: #666;
        margin-top: 0.25rem;
    `;
    
    const formGroup = messageField.closest('.form-group');
    formGroup.appendChild(counter);
    
    function updateCounter() {
        const length = messageField.value.length;
        const minLength = 10;
        const maxLength = 500;
        
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length < minLength) {
            counter.style.color = '#dc3545';
        } else if (length > maxLength * 0.9) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = '#28a745';
        }
        
        // Prevent typing beyond max length
        if (length >= maxLength) {
            messageField.value = messageField.value.substring(0, maxLength);
            counter.textContent = `${maxLength}/${maxLength} characters (limit reached)`;
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter(); // Initial count
}

// Initialize character counter
setTimeout(addCharacterCounter, 1000);