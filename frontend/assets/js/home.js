
document.addEventListener("DOMContentLoaded", function () {
  fetch("components/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;

      const mobileMenuButton = document.querySelector(
        '[aria-controls="mobile-menu"]'
      );
      const mobileMenu = document.getElementById("mobile-menu");

      if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }

      const currentNavbar = document.getElementById("home");
      if (currentNavbar) {
        currentNavbar.style.color = "rgb(30 64 175)";
        currentNavbar.style.borderBottomColor = "rgb(30 64 175)";
      }

      const mobileNavbarLink = document.getElementById("mobile-home-link");
      if (mobileNavbarLink) {
        mobileNavbarLink.style.color = "rgb(30 64 175)";
        mobileNavbarLink.style.backgroundColor = "white";
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));

  {
    fetch("components/hero.html")
      .then((response) => response.text())
      .then((data) => {
        const mainContent = document.getElementById("hero-container");
        if (mainContent) {
          mainContent.innerHTML = data;
        } else {
          console.error("Main content container not found");
        }
      })
      .catch((error) => console.error("Error loading hero section:", error));
  }

  fetch("components/homeComponents/bestSellers.html")
    .then((response) => response.text())
    .then((data) => {
      const mainContent = document.getElementById("bestSellers-container");
      if (mainContent) {
        mainContent.innerHTML = data;

        console.log("Best Sellers loaded");

        const container = document.getElementById("products-container");
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        const leftIndicator = document.getElementById("indicator-to-left");
        const rightIndicator = document.getElementById("indicator-to-right");
        let scrollAmount = 0;
        const cardWidth = 300;

        nextBtn.addEventListener("click", () => {
          scrollAmount += cardWidth;
          leftIndicator.style.backgroundColor = "white";
          rightIndicator.style.backgroundColor = "rgb(30 58 138)";

          if (scrollAmount > container.scrollWidth - container.clientWidth) {
            scrollAmount = container.scrollWidth - container.clientWidth;
          }
          container.style.transform = `translateX(-${scrollAmount}px)`;
        });

        prevBtn.addEventListener("click", () => {
          scrollAmount -= cardWidth;
          rightIndicator.style.backgroundColor = "white";
          leftIndicator.style.backgroundColor = "rgb(30 58 138)";

          if (scrollAmount < 0) {
            scrollAmount = 0;
            leftIndicator.style.backgroundColor = "white";
          }
          container.style.transform = `translateX(-${scrollAmount}px)`;
        });

      } else {
        console.error("Main content container not found");
      }

      fetch("components/homeComponents/benefits.html")
        .then((response) => response.text())
        .then((data) => {
          const mainContent = document.getElementById("benefits-container");
          if (mainContent) {
            mainContent.innerHTML = data;
          } else {
            console.error("Main content container not found");
          }
        })
        .catch((error) =>
          console.error("Error loading benefits section:", error)
        );
    })
    .catch((error) =>
      console.error("Error loading bestSellers section:", error)
    );

  fetch("components/homeComponents/testimonials.html")
    .then((response) => response.text())
    .then((data) => {
      const mainContent = document.getElementById("testimonials-container");
      if (mainContent) {
        mainContent.innerHTML = data;
      } else {
        console.error("Main content container not found");
      }
    })
    .catch((error) =>
      console.error("Error loading testimonials section:", error)
    );

  fetch("components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      const mainContent = document.getElementById("footer-container");
      if (mainContent) {
        mainContent.innerHTML = data;

        const backToTopButton = document.getElementById("back-to-top");

        backToTopButton.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      } else {
        console.error("Main content container not found");
      }
    })
    .catch((error) => console.error("Error loading footer section:", error));
});
