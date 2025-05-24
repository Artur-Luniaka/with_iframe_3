// Header functionality
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    initMobileMenu();
});

async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const headerHTML = await response.text();
        document.getElementById('header-container').innerHTML = headerHTML;
        
        // Initialize mobile menu after header is loaded
        setTimeout(initMobileMenu, 100);
        
        // Set active navigation link
        setActiveNavLink();
        
    } catch (error) {
        console.error('Error loading header:', error);
        // Fallback header
        document.getElementById('header-container').innerHTML = `
            <header class="main-header">
                <div class="container">
                    <div class="header-content">
                        <div class="logo">
                            <a href="index.html">
                                <span class="logo-icon">🔄</span>
                                <span class="logo-text">Rotate to Escape</span>
                            </a>
                        </div>
                        <nav class="main-nav">
                            <ul class="nav-list">
                                <li><a href="index.html" class="nav-link">Home</a></li>
                                <li><a href="index.html#how-to-play" class="nav-link">How to Play</a></li>
                                <li><a href="news.html" class="nav-link">News</a></li>
                                <li><a href="contacts.html" class="nav-link">Contact</a></li>
                                <li><a href="disclaimer.html" class="nav-link">Disclaimer</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        `;
        setTimeout(initMobileMenu, 100);
        setActiveNavLink();
    }
}

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileToggle || !mobileMenu) return;
    
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Header scroll effects
let lastScrollY = 0;
const header = document.querySelector('.main-header');

function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header?.classList.add('hidden');
    } else {
        header?.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
}

// Throttle scroll events for better performance
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            handleHeaderScroll();
            ticking = false;
        });
        ticking = true;
    }
});