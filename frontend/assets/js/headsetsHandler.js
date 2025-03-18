import { createProductPurchaseCard } from "./rendredComponents/productCard.js";
import { productData } from "./static/stataicData.js";

console.log("✅ productsHandler.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
  // handle dynamic des differents scroll dus produits

  console.log("page loaded");
  //smartwatches
  const headsetsGrid = document.getElementById("headsets-grid");
  const loadMoreBtn = document.getElementById("load-more-headsets");
  let visibleProducts = 3;

  // Générer les cartes produits
  function displayProducts() {
    

    productData.slice(visibleProducts - 2, visibleProducts).forEach((product) => {
      const productCard = createProductPurchaseCard(product, "headsets");
      headsetsGrid.appendChild(productCard);
    });

    // Cacher le bouton si tous les produits sont affichés
    if (visibleProducts >= productData.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  // Charger les premiers produits
  displayProducts();

  // Gérer le clic sur "Voir plus"
  loadMoreBtn.addEventListener("click", () => {
    visibleProducts += 2;
    displayProducts();
  });

  //scroll handler

  const prevBtnHeadsets = document.getElementById("prev-btn-headsets");
  const nextBtnHeadsets = document.getElementById("next-btn-headsets");

  //smartwatches indicators
  const left_Indicator_headsets = document.getElementById(
    "left-indecator-headsets"
  );
  const right_Indicator_headsets = document.getElementById(
    "right-indecator-headsets"
  );
  let scrollAmount = 0;
  const cardWidth = 300; // Width of card + margin

  nextBtnHeadsets.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_headsets.style.backgroundColor = "black";
    left_Indicator_headsets.style.backgroundColor = "white";
    // Prevent scrolling too far
    if (scrollAmount > headsetsGrid.scrollWidth - headsetsGrid.clientWidth) {
      scrollAmount = headsetsGrid.scrollWidth - headsetsGrid.clientWidth;
    }
    headsetsGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnHeadsets.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_headsets.style.backgroundColor = "black";
    right_Indicator_headsets.style.backgroundColor = "white";
    // Prevent scrolling too far in reverse
    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_headsets.style.backgroundColor = "white";
    }
    headsetsGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });
});
