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
    const response = await fetch("data/index.json");
    const data = await response.json();

    // Update meta tags
    document.title = data.meta.title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", data.meta.description);

    // Populate hero section
    document.getElementById("hero-title").textContent = data.hero.title;
    document.getElementById("hero-description").textContent =
      data.hero.description;

    // Populate sections
    populateSection("welcome", data.sections.welcome);
    populateSection("how-to-play", data.sections.howToPlay);
    populateSection("tactics", data.sections.rotationTactics);
    populateSection("traps", data.sections.trapsTimers);
    populateSection("challenge", data.sections.escapeChallenge);

    // Populate reviews
    populateReviews(data.reviews);

    // Set up game iframe
    document.getElementById("game-iframe").src = data.gameUrl;
  } catch (error) {
    console.error("Error loading index content:", error);
    showErrorMessage();
  }
}

function populateSection(sectionId, sectionData) {
  const titleElement = document.getElementById(`${sectionId}-title`);
  const contentElement = document.getElementById(`${sectionId}-content`);

  if (titleElement) titleElement.textContent = sectionData.title;
  if (contentElement) contentElement.innerHTML = sectionData.content;
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
