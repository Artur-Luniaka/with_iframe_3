// Index page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initIndexPage();
    }
});

function initIndexPage() {
    loadIndexContent();
    initHeroAnimations();
    initContentAnimations();
    initGameSection();
}

async function loadIndexContent() {
    try {
        // Load reviews data
        const reviewsResponse = await fetch('data/reviews.json');
        const reviewsData = await reviewsResponse.json();
        
        // Update page meta tags
        if (reviewsData.meta) {
            updateMetaTags(reviewsData.meta);
        }
        
        // Load reviews
        if (reviewsData.reviews) {
            loadReviews(reviewsData.reviews);
        }
        
    } catch (error) {
        console.error('Error loading index content:', error);
        loadFallbackReviews();
    }
}

function updateMetaTags(meta) {
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

function loadReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '';
    
    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.animationDelay = `${index * 0.2}s`;
        
        reviewCard.innerHTML = `
            <p class="review-text">${review.text}</p>
            <div class="review-author">${review.author}</div>
            <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
        `;
        
        reviewsContainer.appendChild(reviewCard);
    });
}

function loadFallbackReviews() {
    const fallbackReviews = [
        {
            text: "This game is absolutely mind-bending! The rotation mechanics are so smooth and the puzzles are incredibly challenging. I've been playing for hours!",
            author: "Alex Chen",
            rating: 5
        },
        {
            text: "Perfect combination of skill and strategy. The timer pressure really gets your heart racing. Best puzzle game I've played this year!",
            author: "Sarah Mitchell",
            rating: 5
        },
        {
            text: "The graphics are stunning and the gameplay is addictive. Each level brings new challenges that keep me coming back for more.",
            author: "Mike Rodriguez",
            rating: 4
        }
    ];
    
    loadReviews(fallbackReviews);
}

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
    
    // Add floating animation to hero content
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
    // Animate content items on scroll
    const contentItems = document.querySelectorAll('.content-item, .tactic-card, .trap-info');
    
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                itemObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    contentItems.forEach(item => {
        itemObserver.observe(item);
    });
    
    // Add hover sound effects (visual feedback)
    contentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initGameSection() {
    const gameIframe = document.querySelector('.game-container iframe');
    if (!gameIframe) return;
    
    // Add loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'game-loading';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading the ultimate escape challenge...</p>
    `;
    
    const gameContainer = document.querySelector('.game-container');
    gameContainer.insertBefore(loadingDiv, gameIframe);
    
    // Hide iframe initially
    gameIframe.style.opacity = '0';
    
    // Show iframe when loaded
    gameIframe.addEventListener('load', function() {
        loadingDiv.style.display = 'none';
        this.style.opacity = '1';
        this.style.transition = 'opacity 0.5s ease';
    });
    
    // Error handling
    gameIframe.addEventListener('error', function() {
        loadingDiv.innerHTML = `
            <div class="game-error">
                <h3>🎮 Game Temporarily Unavailable</h3>
                <p>The escape challenge is currently being updated with new levels and features. Please check back soon!</p>
                <button onclick="location.reload()" class="retry-button">Try Again</button>
            </div>
        `;
    });
    
    // Add fullscreen functionality
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.title = 'Fullscreen';
    
    fullscreenBtn.addEventListener('click', function() {
        if (gameIframe.requestFullscreen) {
            gameIframe.requestFullscreen();
        } else if (gameIframe.webkitRequestFullscreen) {
            gameIframe.webkitRequestFullscreen();
        } else if (gameIframe.msRequestFullscreen) {
            gameIframe.msRequestFullscreen();
        }
    });
    
    gameContainer.appendChild(fullscreenBtn);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        heroSection.style.transform = `translateY(${parallax}px)`;
    });
}

// Initialize parallax effect
setTimeout(initParallaxEffect, 1000);

// Smooth scroll to game section
window.scrollToGame = function() {
    const gameSection = document.getElementById('escape-challenge');
    if (gameSection) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
        const targetPosition = gameSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Add highlight effect
        gameSection.style.boxShadow = '0 0 30px rgba(255, 107, 53, 0.3)';
        setTimeout(() => {
            gameSection.style.boxShadow = '';
        }, 2000);
    }
};

// Add dynamic background particles
function addBackgroundParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: rgba(255, 210, 63, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite linear;
            pointer-events: none;
        `;
        
        heroSection.appendChild(particle);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize background particles
setTimeout(addBackgroundParticles, 2000);