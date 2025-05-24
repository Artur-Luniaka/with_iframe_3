// Footer functionality
document.addEventListener('DOMContentLoaded', function() {
    loadFooter();
});

async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const footerHTML = await response.text();
        document.getElementById('footer-container').innerHTML = footerHTML;
        
        // Initialize footer animations
        initFooterAnimations();
        
    } catch (error) {
        console.error('Error loading footer:', error);
        // Fallback footer
        document.getElementById('footer-container').innerHTML = `
            <footer class="main-footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <div class="footer-logo">
                                <span class="logo-icon">🔄</span>
                                <span class="logo-text">Rotate to Escape</span>
                            </div>
                            <p class="footer-description">Master the ultimate spinning challenge and escape the impossible.</p>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Quick Links</h3>
                            <ul class="footer-links">
                                <li><a href="privacy.html">Privacy Policy</a></li>
                                <li><a href="cookie.html">Cookie Policy</a></li>
                                <li><a href="disclaimer.html">Disclaimer</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3>Contact Info</h3>
                            <div class="contact-info">
                                <p>123 Rotation Street<br>Sydney NSW 2000<br>Australia</p>
                                <p>Phone: +61 2 9876 5432</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; 2024 Rotate to Escape. All rights reserved. Made with ❤️ in Australia.</p>
                    </div>
                </div>
            </footer>
        `;
        initFooterAnimations();
    }
}

function initFooterAnimations() {
    // Animate footer elements when they come into view
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe footer sections
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach(section => {
        footerObserver.observe(section);
    });
    
    // Add hover effects to footer links
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Animate copyright text
    const copyrightText = document.querySelector('.footer-bottom p');
    if (copyrightText) {
        const currentYear = new Date().getFullYear();
        copyrightText.innerHTML = copyrightText.innerHTML.replace('2024', currentYear);
    }
}

// Footer scroll-to-top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-gradient);
        color: white;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
        this.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
    });
}

// Initialize scroll-to-top button
setTimeout(addScrollToTop, 1000);