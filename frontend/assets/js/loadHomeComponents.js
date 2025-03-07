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
        const currentNavbar = document.getElementById("home");
        if (currentNavbar) {
          currentNavbar.style.color = "rgb(59, 130, 246)";
          currentNavbar.style.borderBottomColor = "rgb(59, 130, 246)";
        }
      })
      .catch((error) => console.error("Error loading navbar:", error));

    {
      // Then load the hero section
      fetch("components/hero.html")
        .then((response) => response.text())
        .then((data) => {
          // Replace the existing content with the hero section
          const mainContent = document.getElementById("hero-container");
          if (mainContent) {
            mainContent.innerHTML = data;
          } else {
            console.error("Main content container not found");
          }
        })
        .catch((error) =>
          console.error("Error loading hero section:", error)
        );
    }
  });