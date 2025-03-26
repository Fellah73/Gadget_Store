import { createProductPurchaseCard } from "./rendredComponents/productCard.js";

document.addEventListener("DOMContentLoaded", async function () {
  const consolesGrid = document.getElementById("consoles-grid");
  const loadMoreconsolesBtn = document.getElementById("load-more-consoles");
  const brandSelect = document.getElementById("consoles-brand-filter");
  let allProducts = [];
  let visibleProducts = 4;
   let brands= [];
  // Fetch des produits
  async function fetchProducts() {
    try {
      const response = await fetch(
        "http://localhost/gadgetstoreapi/products/getProducts?category_id=2.php"
      );
      const data = await response.json();

      if (data.success) {
        //set Products
        allProducts = data.products;
        
        // display products
        displayProducts(allProducts);

        // extract des brands depuis les products pour le filter
        extractAndPopulateBrands(allProducts);

        // afficher les brands
        populateBrandFilter(brands);
      } else {
        console.error("Erreur API :", data.error);
      }
    } catch (error) {
      console.error("Erreur de chargement des produits :", error);
    }
  }

 // avoir les brands 
  function extractAndPopulateBrands(products) {
    brands = [...new Set(products.map((product) => product.brand))]; // Suppression des doublons
    populateBrandFilter(brands);
  }


  // Remplir le select avec les marques
  function populateBrandFilter(brands) {
    brandSelect.innerHTML = '<option value="">Toutes les marques</option>';
    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }

  // Affichage des produits
  function displayProducts(products) {
    consolesGrid.innerHTML = "";
    products.slice(0, visibleProducts).forEach((product) => {
      const productCard = createProductPurchaseCard(product, "consoles");
      consolesGrid.appendChild(productCard);
    });

    // Gestion du bouton "Voir plus"
    loadMoreconsolesBtn.style.display =
      visibleProducts >= products.length ? "none" : "block";
  }

  // Filtrage des produits par marque
  function filterProductsByBrand(brand) {
    if (!brand) {
      displayProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(
        (product) => product.brand === brand
      );
      // le re-affichage des products filtrer
      displayProducts(filteredProducts);
    }
  }

  // filtrage par marque aprés le changement des etat des marques
  brandSelect.addEventListener("change", (event) => {
    filterProductsByBrand(event.target.value);
  });

  // Gestion du bouton display more
  loadMoreconsolesBtn.addEventListener("click", () => {
    visibleProducts += 4;
    displayProducts(allProducts);
  });
  const prevBtnconsoles = document.getElementById("prev-btn-consoles");
  const nextBtnconsoles = document.getElementById("next-btn-consoles");

  const left_Indicator_consoles = document.getElementById(
    "left-indecator-consoles"
  );
  const right_Indicator_consoles = document.getElementById(
    "right-indecator-consoles"
  );



  //scroll handling
  let scrollAmount = 0;
  const cardWidth = 300; // Largeur d'une carte + marge

  nextBtnconsoles.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_consoles.style.backgroundColor = "black";
    left_Indicator_consoles.style.backgroundColor = "white";

    if (scrollAmount > consolesGrid.scrollWidth - consolesGrid.clientWidth) {
      scrollAmount = consolesGrid.scrollWidth - consolesGrid.clientWidth;
    }
    consolesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnconsoles.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_consoles.style.backgroundColor = "black";
    right_Indicator_consoles.style.backgroundColor = "white";

    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_consoles.style.backgroundColor = "white";
    }
    consolesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  // Chargement initial
  await fetchProducts();

});
