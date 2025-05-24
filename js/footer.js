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
    }
}

function initFooterAnimations() {
    // Animate footer sections on scroll
    const footerSections = document.querySelectorAll('.footer-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    footerSections.forEach(section => {
        observer.observe(section);
    });
}