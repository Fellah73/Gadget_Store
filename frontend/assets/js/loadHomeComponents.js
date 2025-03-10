import { createProductCard } from "./rendredComponents/productCard.js";
import { products } from "./static/stataicData.js";


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
      .catch((error) => console.error("Error loading hero section:", error));
  }

  // Then load the categoriesGrid section
  fetch("components/categoriesGrid.html")
    .then((response) => response.text())
    .then((data) => {
      // Replace the existing content with the categoriesGrid section
      const mainContent = document.getElementById("categoriesGrid-container");
      if (mainContent) {
        mainContent.innerHTML = data;
      } else {
        console.error("Main content container not found");
      }
    })
    .catch((error) =>
      console.error("Error loading categoriesGrid section:", error)
    );



  // Then load the bestSellers section
  fetch("components/homeComponents/bestSellers.html")
    .then((response) => response.text())
    .then((data) => {
      // Replace the existing content with the bestSellers section
      const mainContent = document.getElementById("bestSellers-container");
      if (mainContent) {
        mainContent.innerHTML = data;
        

        console.log("Best Sellers loaded");
        // Simple carousel logic
        const container = document.getElementById("products-container");
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        let scrollAmount = 0;
        const cardWidth = 300; // Width of card + margin

        nextBtn.addEventListener("click", () => {
          scrollAmount += cardWidth;
          // Prevent scrolling too far
          if (scrollAmount > container.scrollWidth - container.clientWidth) {
            scrollAmount = container.scrollWidth - container.clientWidth;
          }
          container.style.transform = `translateX(-${scrollAmount}px)`;
        });

        prevBtn.addEventListener("click", () => {
          scrollAmount -= cardWidth;
          // Prevent scrolling too far in reverse
          if (scrollAmount < 0) {
            scrollAmount = 0;
          }
          container.style.transform = `translateX(-${scrollAmount}px)`;
        });


        if(products){
 
          products.forEach((product) => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
          });

        }



      } else {
        console.error("Main content container not found");
      }
    })
    .catch((error) =>
      console.error("Error loading bestSellers section:", error)
    );
});
