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
        currentNavbarLink.style.color = "rgb(59, 130, 246)";
        currentNavbarLink.style.borderBottomColor = "rgb(147 197 253)";
      }

      // Update the mobile nav link
      const mobileNavbarLink = document.getElementById("mobile-shop-link");
      if (mobileNavbarLink) {
        mobileNavbarLink.style.color = "rgb(59, 130, 246)";
        mobileNavbarLink.style.backgroundColor = "rgb(249 250 251)";
      }
    })

    .catch((error) => console.error("Error loading navbar:", error));

  // Load heroShop section
  fetch("components/shopComponents/shopHero.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("heroShop-container").innerHTML = data;
    })
    .catch((error) => console.error("Error loading heroShop section:", error));

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

  //load banner
  fetch("components/shopComponents/shopBanner.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("banners-container").innerHTML = data;
    })
    .catch((error) => console.error("Error loading banner:", error));


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
