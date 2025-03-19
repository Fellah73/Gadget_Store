import { createProductPurchaseCard } from "./rendredComponents/productCard.js";
import { productData } from "./static/stataicData.js";

console.log("✅ productsHandler.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
  // handle dynamic des differents scroll dus produits

  console.log("page loaded");
  //smartwatches
  const smartwatchesGrid = document.getElementById("smartwatches-grid");
  const loadMoreSmartwatchesBtn = document.getElementById(
    "load-more-smartwatches"
  );
  let visibleProducts = 2;

  function displayProducts() {
    productData
      .slice(visibleProducts - 2, visibleProducts)
      .forEach((product) => {
        const productCard = createProductPurchaseCard(product, "smartwatches");
        smartwatchesGrid.appendChild(productCard);
      });

    // Cacher le bouton si tous les produits sont affichés
    if (visibleProducts >= productData.length) {
      loadMoreSmartwatchesBtn.style.display = "none";
    }
  }

  displayProducts();
  loadMoreSmartwatchesBtn.addEventListener("click", () => {
    visibleProducts += 2;
    displayProducts();
  });

  //scroll handler

  const prevBtnSmartwatches = document.getElementById("prev-btn-smartwatches");
  const nextBtnSmartwatches = document.getElementById("next-btn-smartwatches");

  //smartwatches indicators
  const left_Indicator_smartwatches = document.getElementById(
    "left-indecator-smartwatches"
  );
  const right_Indicator_smartwatches = document.getElementById(
    "right-indecator-smartwatches"
  );
  let scrollAmount = 0;
  const cardWidth = 300; // Width of card + margin

  nextBtnSmartwatches.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_smartwatches.style.backgroundColor = "black";
    left_Indicator_smartwatches.style.backgroundColor = "white";
    // Prevent scrolling too far
    if (
      scrollAmount >
      smartwatchesGrid.scrollWidth - smartwatchesGrid.clientWidth
    ) {
      scrollAmount =
        smartwatchesGrid.scrollWidth - smartwatchesGrid.clientWidth;
    }
    smartwatchesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnSmartwatches.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_smartwatches.style.backgroundColor = "black";
    right_Indicator_smartwatches.style.backgroundColor = "white";
    // Prevent scrolling too far in reverse
    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_smartwatches.style.backgroundColor = "white";
    }
    smartwatchesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });
});
