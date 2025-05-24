// Import all JavaScript files
import "./header.js";
import "./footer.js";
import "./index.js";
import "./news.js";
import "./contacts.js";
import "./legal.js";

// Global utilities and initialization
document.addEventListener("DOMContentLoaded", function () {
  // Initialize smooth scrolling for anchor links
  initSmoothScrolling();

  // Initialize loading animations
  initLoadingAnimations();

  // Initialize responsive utilities
  initResponsiveUtils();
});

function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight =
          document.querySelector(".main-header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

function initLoadingAnimations() {
  // Add loading class to elements that will be populated by JSON
  const loadingElements = document.querySelectorAll(
    '[id*="title"], [id*="content"], [id*="description"]'
  );

  loadingElements.forEach((element) => {
    if (element.textContent === "Loading...") {
      element.classList.add("loading-text");
    }
  });
}

function initResponsiveUtils() {
  // Handle window resize events
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Trigger custom resize event for modules
      window.dispatchEvent(new CustomEvent("optimizedResize"));
    }, 250);
  });
}

// Utility functions
window.RotateToEscape = {
  // Format date utility
  formatDate: function (dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-AU", options);
  },

  // Create element utility
  createElement: function (tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  },

  // Show notification utility
  showNotification: function (message, type = "info") {
    const notification = this.createElement(
      "div",
      `notification notification-${type}`,
      message
    );
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const cookieBar = document.getElementById("cookieBar");
  const acceptBtn = document.getElementById("acceptCookies");

  if (!localStorage.getItem("cookiesAccepted")) {
    cookieBar.style.display = "flex";
  }

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBar.style.display = "none";
  });
});
