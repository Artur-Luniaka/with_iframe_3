// Legal pages functionality
document.addEventListener("DOMContentLoaded", function () {
  const legalPages = ["disclaimer.html", "privacy.html", "cookie.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (legalPages.includes(currentPage)) {
    initLegalPage();
  }
});

function initLegalPage() {
  // Add smooth scrolling for legal page sections
  const headings = document.querySelectorAll(
    ".legal-content h2, .legal-content h3"
  );

  headings.forEach((heading) => {
    heading.style.cursor = "pointer";
    heading.addEventListener("click", function () {
      this.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Add reading progress indicator
  addReadingProgress();

  // Initialize print functionality
  initPrintFunctionality();
}

function addReadingProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress";
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-gradient);
        z-index: 9999;
        transition: width 0.3s ease;
    `;

  document.body.appendChild(progressBar);

  window.addEventListener("scroll", function () {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    progressBar.style.width = scrolled + "%";
  });
}
