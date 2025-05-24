// News page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('news.html')) {
        initNewsPage();
    }
});

function initNewsPage() {
    loadNewsContent();
    initNewsAnimations();
}

async function loadNewsContent() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    // Show loading state
    showNewsLoading(newsContainer);
    
    try {
        const response = await fetch('data/news.json');
        const newsData = await response.json();
        
        // Update page meta tags
        if (newsData.meta) {
            updateNewsMetaTags(newsData.meta);
        }
        
        // Load news articles
        if (newsData.articles && newsData.articles.length > 0) {
            loadNewsArticles(newsData.articles, newsContainer);
        } else {
            showEmptyNews(newsContainer);
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        loadFallbackNews(newsContainer);
    }
}

function showNewsLoading(container) {
    container.innerHTML = `
        <div class="news-loading">
            <div class="loading"></div>
            <h3>Loading Latest Rotation Chronicles...</h3>
            <p>Fetching the newest escape stories and updates</p>
        </div>
    `;
}

function updateNewsMetaTags(meta) {
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

function loadNewsArticles(articles, container) {
    container.innerHTML = '';
    
    articles.forEach((article, index) => {
        const newsCard = createNewsCard(article, index);
        container.appendChild(newsCard);
    });
    
    // Initialize card animations
    setTimeout(() => {
        const cards = container.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 200);
        });
    }, 100);
}

function createNewsCard(article, index) {
    const newsCard = document.createElement('article');
    newsCard.className = `news-card ${article.featured ? 'featured' : ''}`;
    newsCard.style.opacity = '0';
    newsCard.style.transform = 'translateY(30px)';
    
    const formattedDate = formatDate(article.date);
    const imageUrl = article.image || '/placeholder.svg?height=250&width=400';
    
    newsCard.innerHTML = `
        <img src="${imageUrl}" alt="${article.title}" class="news-image" loading="lazy">
        <div class="news-content">
            <div class="news-meta">
                <span class="news-date">${formattedDate}</span>
                <span class="news-category">${article.category}</span>
            </div>
            <h2 class="news-title">${article.title}</h2>
            <p class="news-excerpt">${article.excerpt}</p>
            <a href="${article.link || '#'}" class="read-more">
                Continue Reading
            </a>
        </div>
    `;
    
    // Add click tracking
    newsCard.addEventListener('click', function(e) {
        if (!e.target.classList.contains('read-more')) {
            const readMoreLink = this.querySelector('.read-more');
            if (readMoreLink) {
                readMoreLink.click();
            }
        }
        
        // Track article click
        trackNewsClick(article.title, article.category);
    });
    
    return newsCard;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-AU', options);
}

function loadFallbackNews(container) {
    const fallbackArticles = [
        {
            title: "New Rotation Mechanics Unveiled",
            excerpt: "Discover the latest rotation techniques that will revolutionize your escape strategies. Master these advanced moves to conquer even the most challenging levels.",
            date: "2024-01-15",
            category: "Updates",
            image: "/placeholder.svg?height=250&width=400",
            featured: true,
            link: "#"
        },
        {
            title: "Player Spotlight: Record-Breaking Escape",
            excerpt: "Meet the player who achieved the impossible - completing the Nightmare Mode in under 60 seconds. Learn their secrets and techniques.",
            date: "2024-01-10",
            category: "Community",
            image: "/placeholder.svg?height=250&width=400",
            link: "#"
        },
        {
            title: "Upcoming Tournament: Global Rotation Championship",
            excerpt: "The biggest Rotate to Escape tournament is coming! Register now to compete against the world's best players for amazing prizes.",
            date: "2024-01-05",
            category: "Events",
            image: "/placeholder.svg?height=250&width=400",
            link: "#"
        },
        {
            title: "Behind the Scenes: Level Design Process",
            excerpt: "Ever wondered how our mind-bending levels are created? Take a peek behind the curtain and see the creative process in action.",
            date: "2024-01-01",
            category: "Development",
            image: "/placeholder.svg?height=250&width=400",
            link: "#"
        }
    ];
    
    loadNewsArticles(fallbackArticles, container);
}

function showEmptyNews(container) {
    container.innerHTML = `
        <div class="news-empty">
            <h3>🔄 No News Yet</h3>
            <p>We're working on exciting new content! Check back soon for the latest rotation chronicles and escape stories.</p>
            <a href="index.html" class="btn btn-primary">Return to Game</a>
        </div>
    `;
}

function initNewsAnimations() {
    // Animate news cards on scroll
    const newsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                newsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe news cards as they're added
    const observeNewsCards = () => {
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            newsObserver.observe(card);
        });
    };
    
    // Initial observation
    setTimeout(observeNewsCards, 500);
    
    // Re-observe when new content is loaded
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        const containerObserver = new MutationObserver(observeNewsCards);
        containerObserver.observe(newsContainer, { childList: true });
    }
}

function trackNewsClick(title, category) {
    // Analytics tracking (placeholder)
    console.log(`News clicked: ${title} (${category})`);
    
    // You can integrate with analytics services here
    // Example: gtag('event', 'news_click', { title, category });
}

// Search functionality for news
function initNewsSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search rotation chronicles...';
    searchInput.className = 'news-search';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'news-search-container';
    searchContainer.appendChild(searchInput);
    
    const pageHero = document.querySelector('.page-hero .container');
    if (pageHero) {
        pageHero.appendChild(searchContainer);
    }
    
    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterNews(this.value.toLowerCase());
        }, 300);
    });
}
