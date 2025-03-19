import { createProductPurchaseCard } from "./rendredComponents/productCard.js";
import { productData } from "./static/stataicData.js";

console.log("✅ productsHandler.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
  // handle dynamic des differents scroll dus produits

  console.log("page loaded");
  //smartwatches
  const consolesGrid = document.getElementById("consoles-grid");
  const loadMoreconsolesBtn = document.getElementById("load-more-consoles");
  let visibleProducts = 2;

  function displayProducts() {
    productData
      .slice(visibleProducts - 2, visibleProducts)
      .forEach((product) => {
        const productCard = createProductPurchaseCard(product, "consoles");
        consolesGrid.appendChild(productCard);
      });

    // Cacher le bouton si tous les produits sont affichés
    if (visibleProducts >= productData.length) {
      loadMoreconsolesBtn.style.display = "none";
    }
  }

  // Charger les premiers produits
  displayProducts();

  // Gérer le clic sur "Voir plus"
  loadMoreconsolesBtn.addEventListener("click", () => {
    visibleProducts += 2;
    displayProducts();
  });

  //scroll handler

  const prevBtnconsoles = document.getElementById("prev-btn-consoles");
  const nextBtnconsoles = document.getElementById("next-btn-consoles");

  //smartwatches indicators
  const left_Indicator_consoles = document.getElementById(
    "left-indecator-consoles"
  );
  const right_Indicator_consoles = document.getElementById(
    "right-indecator-consoles"
  );
  let scrollAmount = 0;
  const cardWidth = 300; // Width of card + margin

  nextBtnconsoles.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_consoles.style.backgroundColor = "black";
    left_Indicator_consoles.style.backgroundColor = "white";
    // Prevent scrolling too far
    if (scrollAmount > consolesGrid.scrollWidth - consolesGrid.clientWidth) {
      scrollAmount = consolesGrid.scrollWidth - consolesGrid.clientWidth;
    }
    consolesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnconsoles.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_consoles.style.backgroundColor = "black";
    right_Indicator_consoles.style.backgroundColor = "white";
    // Prevent scrolling too far in reverse
    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_consoles.style.backgroundColor = "white";
    }
    consolesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });
});
