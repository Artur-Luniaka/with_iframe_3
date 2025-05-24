// News page functionality
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.endsWith("news.html")) {
    loadNewsContent();
  }
});

async function loadNewsContent() {
  try {
    const response = await fetch("data/news.json");
    const data = await response.json();

    // Update meta tags
    document.title = data.meta.title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", data.meta.description);

    // Populate page header
    document.getElementById("news-page-title").textContent = data.pageTitle;
    document.getElementById("news-page-subtitle").textContent =
      data.pageSubtitle;

    // Populate news grid
    populateNewsGrid(data.articles);
  } catch (error) {
    console.error("Error loading news content:", error);
    showNewsError();
  }
}

function populateNewsGrid(articles) {
  const newsGrid = document.getElementById("news-grid");

  if (newsGrid && articles) {
    newsGrid.innerHTML = "";

    articles.forEach((article, index) => {
      const newsCard = createNewsCard(article, index === 0);
      newsGrid.appendChild(newsCard);
    });

    // Initialize news animations
    initNewsAnimations();
  }
}

function createNewsCard(article, isFeatured = false) {
  const card = document.createElement("div");
  card.className = `news-card ${isFeatured ? "featured" : ""}`;

  const formattedDate = window.RotateToEscape.formatDate(article.date);

  card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="news-image" loading="lazy">
        <div class="news-content">
            <div class="news-text">
                <div class="news-meta">
                    <span class="news-category">${article.category}</span>
                    <span class="news-date">📅 ${formattedDate}</span>
                </div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.excerpt}</p>
            </div>
        </div>
    `;

  return card;
}

function initNewsAnimations() {
  const newsCards = document.querySelectorAll(".news-card");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation = "slideInUp 0.6s ease-out forwards";
        }, index * 100);
      }
    });
  }, observerOptions);

  newsCards.forEach((card) => {
    observer.observe(card);
  });
}

function showNewsError() {
  const newsGrid = document.getElementById("news-grid");
  if (newsGrid) {
    newsGrid.innerHTML = `
            <div class="news-empty">
                <h3>Unable to load news</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
  }
}
