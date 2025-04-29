document.addEventListener("DOMContentLoaded", function () {
  fetch("components/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;

      // Re-attacher les événements après le chargement du navbar
      const mobileMenuButton = document.querySelector(
        '[aria-controls="mobile-menu"]'
      );
      const mobileMenu = document.getElementById("mobile-menu");

      if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }

      // Mettre à jour l'état du menu actif
      const currentNavbarLink = document.getElementById("shop");
      if (currentNavbarLink) {
        currentNavbarLink.style.color = "rgb(30 64 175)";
        currentNavbarLink.style.borderBottomColor = "rgb(30 64 175)";
      }

      // Update the mobile nav link
      const mobileNavbarLink = document.getElementById("mobile-shop-link");
      if (mobileNavbarLink) {
        mobileNavbarLink.style.color = "rgb(30 64 175)";
        mobileNavbarLink.style.backgroundColor = "rgb(30 64 175)";
      }
    })

    .catch((error) => console.error("Error loading navbar:", error));

  // Load categoriesGrid section
  fetch("components/shopComponents/shopGrid.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("categoriesGrid-container").innerHTML = data;
    })
    .catch((error) =>
      console.error("Error loading categoriesGrid section:", error)
    );

  //animation des section
  const sections = document.querySelectorAll(".hidden-animate-fadeIn");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
          entry.target.classList.remove("hidden-animate-fadeIn");
          observer.unobserve(entry.target); // On stoppe l'observation une fois animée
        }
      });
    },
    { threshold: 0.2 } // Déclenchement quand 20% de la section est visible
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  //load smartWatch_banner
  fetch("components/shopComponents/banners/smartWatchBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("smarwatches-banner").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

  // load phone banner
  fetch("components/shopComponents/banners/phoneBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("phone-banner").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

  // load console banner
  fetch("components/shopComponents/banners/consoleBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("consoles-container").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));

  // load headset banner
  fetch("components/shopComponents/banners/headsetBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("headsets-container").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));
  // load footer
  fetch("components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      // Replace the existing content with the footer section
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
