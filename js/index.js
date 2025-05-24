// Index page functionality
document.addEventListener("DOMContentLoaded", function () {
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    loadIndexContent();
    initIndexAnimations();
  }
});

async function loadIndexContent() {
  try {
    const response = await fetch(`data/index.json?v=${Date.now()}`);
    const data = await response.json();

    // Обновляем meta
    document.title = data.meta.title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", data.meta.description);

    // Hero
    document.getElementById("hero-title").textContent = data.hero.title;
    document.getElementById("hero-description").textContent =
      data.hero.description;

    // Маппинг ключей JSON -> id HTML (без "-title" и "-content")
    const sectionIdMap = {
      welcome: "welcome",
      howToPlay: "how-to-play",
      rotationTactics: "tactics",
      trapsTimers: "traps",
      escapeChallenge: "challenge",
    };

    // Функция заполнения секции
    function populateSection(jsonKey, sectionData) {
      const htmlId = sectionIdMap[jsonKey];
      if (!htmlId) {
        console.warn(`No matching HTML id for section key "${jsonKey}"`);
        return;
      }
      const titleEl = document.getElementById(`${htmlId}-title`);
      const contentEl = document.getElementById(`${htmlId}-content`);
      if (titleEl) titleEl.textContent = sectionData.title;
      if (contentEl) contentEl.innerHTML = sectionData.content;
    }

    // Заполняем секции
    for (const key in data.sections) {
      populateSection(key, data.sections[key]);
    }

    // Заполняем отзывы
    populateReviews(data.reviews);

    // Загружаем игру
    document.getElementById("game-iframe").src = data.gameUrl;
  } catch (error) {
    console.error("Error loading index content:", error);
    showErrorMessage();
  }
}

function populateReviews(reviews) {
  const reviewsContainer = document.getElementById("reviews-container");
  const feedbackTitle = document.getElementById("feedback-title");

  if (feedbackTitle) feedbackTitle.textContent = "Player Feedback";

  if (reviewsContainer && reviews) {
    reviewsContainer.innerHTML = "";

    reviews.forEach((review) => {
      const reviewCard = createReviewCard(review);
      reviewsContainer.appendChild(reviewCard);
    });
  }
}

function createReviewCard(review) {
  const card = document.createElement("div");
  card.className = "review-card";

  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

  card.innerHTML = `
        <div class="review-header">
            <div class="review-avatar">${review.name.charAt(0)}</div>
            <div class="review-info">
                <h4>${review.name}</h4>
                <div class="review-rating">${stars}</div>
            </div>
        </div>
        <p class="review-text">"${review.text}"</p>
    `;

  return card;
}

function initIndexAnimations() {
  // Hero button animation
  const heroButton = document.getElementById("hero-button");
  if (heroButton) {
    heroButton.addEventListener("click", function () {
      document.getElementById("escape-challenge").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  // Animate sections on scroll
  const sections = document.querySelectorAll(".content-section");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "slideInUp 0.8s ease-out forwards";
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function showErrorMessage() {
  const main = document.querySelector("main");
  if (main) {
    main.innerHTML = `
            <section class="content-section">
                <div class="container">
                    <div class="error-message">
                        <h2>Oops! Something went wrong</h2>
                        <p>We're having trouble loading the content. Please try refreshing the page.</p>
                    </div>
                </div>
            </section>
        `;
  }
}
