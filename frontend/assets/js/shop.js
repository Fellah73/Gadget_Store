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

      const currentNavbarLink = document.getElementById("shop");
      if (currentNavbarLink) {
        currentNavbarLink.style.color = "rgb(30 64 175)";
        currentNavbarLink.style.borderBottomColor = "rgb(30 64 175)";
      }

      const mobileNavbarLink = document.getElementById("mobile-shop-link");
      if (mobileNavbarLink) {
        mobileNavbarLink.style.color = "rgb(30 64 175)";
        mobileNavbarLink.style.backgroundColor = "white";
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));

  fetch("components/shopComponents/shopGrid.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("categoriesGrid-container").innerHTML = data;
    })
    .catch((error) =>
      console.error("Error loading categoriesGrid section:", error)
    );

  const sections = document.querySelectorAll(".hidden-animate-fadeIn");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
          entry.target.classList.remove("hidden-animate-fadeIn");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  fetch("components/shopComponents/banners/smartWatchBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("smarwatches-banner").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

  fetch("components/shopComponents/banners/phoneBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("phone-banner").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

  fetch("components/shopComponents/banners/consoleBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("consoles-banner").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

  fetch("components/shopComponents/banners/headsetBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("headsets-banner").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

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
