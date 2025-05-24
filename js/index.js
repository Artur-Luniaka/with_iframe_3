// Main index.js - optimized version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize appropriate page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initIndexPage();
    } else if (window.location.pathname.includes('news.html')) {
        initNewsPage();
    }
});

// ========== INDEX PAGE FUNCTIONALITY ==========
function initIndexPage() {
    loadIndexContent();
    initHeroAnimations();
    initContentAnimations();
    initGameSection();
    initParallaxEffect();
    setTimeout(addBackgroundParticles, 2000);
}

async function loadIndexContent() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) {
        console.error('Reviews container not found');
        return;
    }

    // Show loading state
    reviewsContainer.innerHTML = `
        <div class="loading-reviews">
            <div class="loading-spinner"></div>
            <p>Loading player reviews...</p>
        </div>
    `;

    try {
        const response = await fetch('data/reviews.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update meta tags if available
        if (data.meta) {
            updateMetaTags(data.meta);
        }
        
        // Load reviews if available
        if (data.reviews?.length > 0) {
            loadReviews(data.reviews);
        } else {
            showEmptyReviews();
        }
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        loadFallbackReviews();
        
        // Show error message to user
        const errorElement = document.createElement('div');
        errorElement.className = 'load-error';
        errorElement.innerHTML = `
            <p>⚠️ Couldn't load reviews. Showing sample data.</p>
        `;
        reviewsContainer.prepend(errorElement);
    }
}

function updateMetaTags(meta) {
    if (meta.title) {
        document.title = meta.title;
    }
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && meta.description) {
        metaDesc.setAttribute('content', meta.description);
    }
}

function loadReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    reviewsContainer.innerHTML = '';
    
    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.opacity = '0';
        reviewCard.style.transform = 'translateY(20px)';
        
        reviewCard.innerHTML = `
            <p class="review-text">"${review.text}"</p>
            <div class="review-footer">
                <span class="review-author">— ${review.author}</span>
                <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
            </div>
        `;
        
        reviewsContainer.appendChild(reviewCard);
        
        // Animate card appearance
        setTimeout(() => {
            reviewCard.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            reviewCard.style.opacity = '1';
            reviewCard.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function showEmptyReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-reviews">
            <p>No reviews yet. Be the first to share your experience!</p>
            <button class="btn-review" onclick="location.href='#review-form'">
                Write a Review
            </button>
        </div>
    `;
}

function loadFallbackReviews() {
    const fallbackData = [
        {
            text: "This game changed my perspective on puzzle games. The rotation mechanics are genius!",
            author: "Alex C.",
            rating: 5
        },
        {
            text: "Challenging but fair. Each level teaches you something new about spatial reasoning.",
            author: "Sam R.",
            rating: 4
        },
        {
            text: "I've played through all levels three times and still discovering new strategies!",
            author: "Taylor M.",
            rating: 5
        }
    ];
    
    loadReviews(fallbackData);
}

// ========== ANIMATIONS ==========
function initHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-button');
    
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 300 + 500);
    });
    
    // Floating animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setInterval(() => {
            heroContent.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                heroContent.style.transform = 'translateY(0)';
            }, 2000);
        }, 4000);
    }
}

function initContentAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.content-item, .tactic-card').forEach(item => {
        observer.observe(item);
    });
}

// ========== GAME SECTION ==========
function initGameSection() {
    const gameIframe = document.querySelector('.game-container iframe');
    if (!gameIframe) return;
    
    // Loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'game-loading';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading the ultimate escape challenge...</p>
    `;
    
    gameIframe.parentNode.insertBefore(loadingDiv, gameIframe);
    gameIframe.style.opacity = '0';
    
    // When loaded
    gameIframe.addEventListener('load', function() {
        loadingDiv.style.opacity = '0';
        setTimeout(() => {
            loadingDiv.remove();
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.5s ease';
        }, 500);
    });
    
    // Error handling
    gameIframe.addEventListener('error', function() {
        loadingDiv.innerHTML = `
            <div class="game-error">
                <h3>🎮 Game Updating</h3>
                <p>We're adding new levels! Check back soon.</p>
                <button class="retry-btn" onclick="location.reload()">
                    Refresh
                </button>
            </div>
        `;
    });
    
    // Fullscreen button
    const fsBtn = document.createElement('button');
    fsBtn.className = 'fullscreen-btn';
    fsBtn.innerHTML = '⛶';
    fsBtn.title = 'Fullscreen';
    fsBtn.addEventListener('click', () => {
        gameIframe.requestFullscreen?.() || 
        gameIframe.webkitRequestFullscreen?.();
    });
    gameIframe.parentNode.appendChild(fsBtn);
}

// ========== PARALLAX & EFFECTS ==========
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const parallax = window.pageYOffset * 0.5;
        heroSection.style.transform = `translateY(${parallax}px)`;
    });
}

function addBackgroundParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.style.cssText = `
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 10 + 10}s;
            animation-delay: ${Math.random() * 5}s;
        `;
        heroSection.appendChild(particle);
    }
}

// ========== NEWS PAGE FUNCTIONALITY ==========
function initNewsPage() {
    loadNewsContent();
    initNewsAnimations();
    initNewsSearch();
}

// ... [Rest of your news page code remains unchanged] ...

// ========== UTILITY FUNCTIONS ==========
window.scrollToGame = function() {
    const gameSection = document.getElementById('escape-challenge');
    if (gameSection) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
        window.scrollTo({
            top: gameSection.offsetTop - headerHeight - 20,
            behavior: 'smooth'
        });
        
        // Highlight pulse
        gameSection.style.boxShadow = '0 0 30px rgba(255, 107, 53, 0.3)';
        setTimeout(() => gameSection.style.boxShadow = '', 2000);
    }
};