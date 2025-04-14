import { createProductPurchaseCard } from "./rendredComponents/productCard.js";

document.addEventListener("DOMContentLoaded", async function () {
  const phonesGrid = document.getElementById("phones-grid");

  const brandSelect = document.getElementById("phones-brand-filter");
  const priceRange = document.getElementById("phones-price-range");
  const priceRangeValue = document.getElementById("phones-price-range-value");
  const minPriceValue = document.getElementById("phones-price-min-range-value");
  const maxPriceValue = document.getElementById("phones-price-max-range-value");
  const sortByFilter = document.getElementById("phones-sort-filter");

  let allProducts = [];
  let brands = [];

  async function fetchProducts() {
    try {
      const response = await fetch(
        "http://localhost/gadgetstoreapi/products/getProducts?category_id=1.php"
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
    phonesGrid.innerHTML = "";
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

      phonesGrid.appendChild(createProductPurchaseCard(product, "phones"));
      return;
    }

    products.forEach((product) => {
      const productCard = createProductPurchaseCard(product, "phones");
      const buyButton = productCard.querySelector("button");

      buyButton.addEventListener("click", async () => {
        console.log("buying process ....");
        await addToCart(product);
      });
      phonesGrid.appendChild(productCard);
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

  const prevBtnphones = document.getElementById("prev-btn-phones");
  const nextBtnphones = document.getElementById("next-btn-phones");

  const left_Indicator_phones = document.getElementById(
    "left-indecator-phones"
  );
  const right_Indicator_phones = document.getElementById(
    "right-indecator-phones"
  );

  //scroll handling
  let scrollAmount = 0;
  const cardWidth = 300; // Largeur d'une carte + marge

  nextBtnphones.addEventListener("click", () => {
    scrollAmount += cardWidth;
    right_Indicator_phones.style.backgroundColor = "black";
    left_Indicator_phones.style.backgroundColor = "white";

    if (scrollAmount > phonesGrid.scrollWidth - phonesGrid.clientWidth) {
      scrollAmount = phonesGrid.scrollWidth - phonesGrid.clientWidth;
    }
    phonesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  prevBtnphones.addEventListener("click", () => {
    scrollAmount -= cardWidth;
    left_Indicator_phones.style.backgroundColor = "black";
    right_Indicator_phones.style.backgroundColor = "white";

    if (scrollAmount < 0) {
      scrollAmount = 0;
      left_Indicator_phones.style.backgroundColor = "white";
    }
    phonesGrid.style.transform = `translateX(-${scrollAmount}px)`;
  });

  await fetchProducts();
});

const addToCart = async (product) => {
  if (!product) return;

  const user = localStorage.getItem("user");
  const isAuth = user == "null" ? false : true;

  if (!isAuth) {
    const popUp = document.getElementById("phones-popup");

    popUp.textContent = `Login or Register to add to cart 🛒`;
    popUp.style.display = "block";

    setTimeout(() => {
      popUp.style.display = "none";
    }, 5000);
    return;
  }

  await addToCartSend(product, user);
};

const addToCartSend = async (product, id) => {
  try {
    const response = await fetch(
      "http://localhost/gadgetstoreapi/cart/addToCart.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          price: product.price_discounted,
          user_id: id,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      const popUp = document.getElementById("phones-popup");
      if (data.message.includes("Quantité")) {
        popUp.textContent = `${product.name} quantite updated 🎉`;
      } else {
        popUp.textContent = `${product.name} added to cart 🎉`;
      }
      document.getElementById("cart-items-number").textContent =
        parseInt(document.getElementById("cart-items-number").textContent) + 1;

      setTimeout(() => {
        popUp.style.display = "block";
      }, 1000);

      setTimeout(() => {
        popUp.style.display = "none";
      }, 5000);

      return;
    }

    if (!data.success) {
      if (data.message.includes("rupture de stock")) {
        const popUp = document.getElementById("phones-popup");
        popUp.textContent = `Produit en rupture de stock ❌`;
        popUp.style.backgroundColor = "rgb(156, 63, 48)";
        setTimeout(() => {
          popUp.style.display = "block";
        }, 1000);

        setTimeout(() => {
          popUp.style.display = "none";
        }, 5000);
      }
      console.error(data.message);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};
