import { createProductPurchaseCard } from "./rendredComponents/productCard.js";
import { productData } from "./static/stataicData.js";

console.log("✅ productsHandler.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
  // handle dynamic des differents scroll dus produits

  console.log("page loaded");
  //smartwatches
  const phonesGrid = document.getElementById("phones-grid");
  const loadMoreBtn = document.getElementById("load-more-phones");
  let visibleProducts = 2;

  function displayProducts() {
    productData
      .slice(visibleProducts - 2, visibleProducts)
      .forEach((product) => {
        const productCard = createProductPurchaseCard(product, "phones");
        phonesGrid.appendChild(productCard);
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

  const prevBtnphones = document.getElementById("prev-btn-phones");
  const nextBtnphones = document.getElementById("next-btn-phones");

  //smartwatches indicators
  const left_Indicator_phones = document.getElementById(
    "left-indecator-phones"
  );
  const right_Indicator_phones = document.getElementById(
    "right-indecator-phones"
  );
  let scrollAmount = 0;
  const cardWidth = 300; // Width of card + margin

  nextBtnphones.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_phones.style.backgroundColor = "black";
    left_Indicator_phones.style.backgroundColor = "white";
    // Prevent scrolling too far
    if (scrollAmount > phonesGrid.scrollWidth - phonesGrid.clientWidth) {
      scrollAmount = phonesGrid.scrollWidth - phonesGrid.clientWidth;
    }
    phonesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnphones.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_phones.style.backgroundColor = "black";
    right_Indicator_phones.style.backgroundColor = "white";
    // Prevent scrolling too far in reverse
    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_phones.style.backgroundColor = "white";
    }
    phonesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });
});
