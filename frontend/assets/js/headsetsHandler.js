import { createProductPurchaseCard } from "./rendredComponents/productCard.js";

document.addEventListener("DOMContentLoaded", async function () {
  const headsetsGrid = document.getElementById("headsets-grid");

  const brandSelect = document.getElementById("headsets-brand-filter");
  const priceRange = document.getElementById("headsets-price-range");
  const priceRangeValue = document.getElementById("headsets-price-range-value");
  const minPriceValue = document.getElementById(
    "headsets-price-min-range-value"
  );
  const maxPriceValue = document.getElementById(
    "headsets-price-max-range-value"
  );
  const sortByFilter = document.getElementById("headsets-sort-filter");

  let allProducts = [];
  let brands = [];

  async function fetchProducts() {
    try {
      const response = await fetch(
        "http://localhost/gadgetstoreapi/products/getProducts?category_id=3.php"
      );
      const data = await response.json();

      if (data.success) {
        allProducts = data.products;
        handleFiltering(allProducts);
        populateBrandFilter(brands);
        updatePriceRange();
        filterAndDisplayProducts();
      } else {
        console.error("Erreur API :", data.error);
      }
    } catch (error) {
      console.error("Erreur de chargement des produits :", error);
    }
  }

  function handleFiltering(products) {
    brands = [...new Set(products.map((product) => product.brand))];
  }

  function populateBrandFilter(brands) {
    brandSelect.innerHTML = '<option value="">All Brands</option>';
    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }

  function updatePriceRange() {
    const maxPrice = Math.max(...allProducts.map((p) => p.price_discounted));
    const minPrice = Math.min(...allProducts.map((p) => p.price_discounted));
    maxPriceValue.textContent = maxPrice;
    minPriceValue.textContent = minPrice;
    priceRange.max = maxPrice;
    priceRange.min = minPrice;
    priceRange.value = maxPrice;
    priceRangeValue.textContent = `max price: ${maxPrice} DZD`;
  }

  function filterAndDisplayProducts() {
    const selectedBrand = brandSelect.value;
    const selectedPrice = priceRange.value;
    const selectedSort = sortByFilter.value;

    let filteredProducts = allProducts.filter((product) => {
      return (
        (!selectedBrand || product.brand === selectedBrand) &&
        product.price_discounted <= selectedPrice
      );
    });

    // Appliquer le tri en fonction de selectedSort
    if (selectedSort.includes("Asc")) {
      filteredProducts.sort((a, b) => a.price_discounted - b.price_discounted);
    } else {
      filteredProducts.sort((a, b) => b.price_discounted - a.price_discounted);
    }

    displayProducts(filteredProducts);
  }

  function displayProducts(products) {
    headsetsGrid.innerHTML = "";
    if (products.length === 0) {
      let product = {
        id: 0,
        image:
          "https://stores.blackberrys.com/VendorpageTheme/Enterprise/EThemeForBlackberrys/images/product-not-found.jpg",
        name: "Aucun produit",
        description: "Aucun produit",
        price: 0,
        category_id: "Aucun produit",
      };

      headsetsGrid.appendChild(createProductPurchaseCard(product, "headsets"));
      return;
    }

    products.forEach((product) => {
      const productCard = createProductPurchaseCard(product, "headsets");
      headsetsGrid.appendChild(productCard);
    });
  }

  brandSelect.addEventListener("change", filterAndDisplayProducts);
  priceRange.addEventListener("input", () => {
    priceRangeValue.textContent = `current price : ${priceRange.value}`;
    filterAndDisplayProducts();
  });
  sortByFilter.addEventListener("change", () => {
    filterAndDisplayProducts();
    console.log("sorting by", sortByFilter.value);
  });

  const prevBtnheadsets = document.getElementById("prev-btn-headsets");
  const nextBtnheadsets = document.getElementById("next-btn-headsets");

  const left_Indicator_headsets = document.getElementById(
    "left-indecator-headsets"
  );
  const right_Indicator_headsets = document.getElementById(
    "right-indecator-headsets"
  );

  //scroll handling
  let scrollAmount = 0;
  const cardWidth = 300; // Largeur d'une carte + marge

  nextBtnheadsets.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_headsets.style.backgroundColor = "black";
    left_Indicator_headsets.style.backgroundColor = "white";

    if (scrollAmount > headsetsGrid.scrollWidth - headsetsGrid.clientWidth) {
      scrollAmount = headsetsGrid.scrollWidth - headsetsGrid.clientWidth;
    }
    headsetsGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnheadsets.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_headsets.style.backgroundColor = "black";
    right_Indicator_headsets.style.backgroundColor = "white";

    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_headsets.style.backgroundColor = "white";
    }
    headsetsGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  await fetchProducts();
});
