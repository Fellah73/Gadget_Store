document.addEventListener("DOMContentLoaded", async () => {
  // load navbar
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

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let product = null;
  async function fetchProducts() {
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/products/getSingleProduct.php?product_id=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        product = data.product;
      } else {
        console.error("Erreur API :", data.message);
      }
    } catch (error) {
      console.error("Erreur de chargement des produits :", error);
    }
  }

  const updateProductDetails = () => {
    // update image
    const productImage = document.getElementById("product-image");
    productImage.src = product[0].image;

    // update category
    const categoryElement = document.getElementById("category");
    categoryElement.innerHTML = generateCategEmoji(product[0].categ);

    //update title
    const titleElement = document.getElementById("product-title");
    titleElement.textContent = product[0].name;

    //update discount
    const discountElement = document.getElementById("product-discount");
    discountElement.textContent = `${product[0].discount}%`;
    let badgeColor = "bg-amber-500";
    if (product[0].discount >= 30 && product[0].discount < 50)
      badgeColor = "bg-blue-950";
    if (product[0].discount >= 50) badgeColor = "bg-gray-600";
    document.getElementById("product-promo").classList.add(badgeColor);

    //update price
    const priceElement = document.getElementById("product-price");
    priceElement.textContent = product[0].price;

    //update old price
    const newPriceElement = document.getElementById("product-price-discounted");
    newPriceElement.textContent = `${product[0].price_discounted} DZD`;

    //update description
    const descriptionElement = document.getElementById("product-description");

    descriptionElement.textContent = product[0].description
      ? product[0].description
      : `Designed to offer an exceptional user experience,
    It incorporates the latest technologies to guarantee advanced performance.
    Ideal for those looking for superior quality, the ${product[0].name} of ${product[0].brand} is
    An essential choice for enthusiasts`;

    //update brand
    const productBrand = document.getElementById("product-brand");
    productBrand.textContent = product[0].brand;

    //update extra info

    if (!product[0].extra_info) {
      return;
    }

    const extraInfoElement = document.getElementById("product-extra-info");
    const extraInfo = JSON.parse(product[0].extra_info);
    Object.entries(extraInfo).forEach(([key, value]) => {
      const infoElementKey = document.createElement("p");
      infoElementKey.classList.add("text-cyan-50", "text-base", "font-bold");
      infoElementKey.textContent = key.replace("_", " ");

      const infoElementValue = document.createElement("p");
      infoElementValue.classList.add("text-gray-300", "text-base", "truncate");
      infoElementValue.textContent = value;

      extraInfoElement.appendChild(infoElementKey);
      extraInfoElement.appendChild(infoElementValue);
    });

    const footerElement = document.getElementById("footer-container");
    fetch("components/footer.html")
      .then((response) => response.text())
      .then((data) => {
        footerElement.innerHTML = data;
        const backToTopButton = document.getElementById("back-to-top");

        backToTopButton.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      })
      .catch((error) => console.error("Error loading footer:", error));
  };

  const generateCategEmoji = (category) => {
    switch (category) {
      case "Smartphones":
        return `<svg
              class="size-14 mr-2 text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>`;
      case "Gaming Consoles":
        return `
        <svg
              class="size-14 mr-2 text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="6" y1="11" x2="10" y2="11"></line>
              <line x1="8" y1="9" x2="8" y2="13"></line>
              <line x1="15" y1="12" x2="15.01" y2="12"></line>
              <line x1="18" y1="10" x2="18.01" y2="10"></line>
              <path
                d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.152A4 4 0 0 0 17.32 5z"
              ></path>
            </svg>
          `;
      case "Smartwatches":
        return `
        <svg
              class="size-14 mr-2 text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="7"></circle>
              <polyline points="12 9 12 12 13.5 13.5"></polyline>
              <path
                d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"
              ></path>
            </svg>
            `;
      default:
        return `
        <svg
              class="size-14 mr-2 text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path
                d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
              ></path>
            </svg>
        `;
    }
  };

  // quantity hadling
  let quantity = 1; // default quantitys
  const quantityInput = document.getElementById("product-qte");
  quantityInput.textContent = quantity;
  const increaseQuantity = () => {
    if (quantity < 10) {
      quantity++;
      quantityInput.textContent = quantity;
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      quantity--;

      quantityInput.textContent = quantity;
    }
  };

  const inreaseBtn = document.getElementById("incremente-qte");
  const decreaseBtn = document.getElementById("decremente-qte");
  const addToCartButton = document.getElementById("add-to-cart");
  // get the product
  await fetchProducts();

  if (!product) {
    const productContainer = document.getElementById("product-container");
    productContainer.classList.add(
      "flex",
      "justify-center",
      "items-center",
      "h-screen",
      "w-full",
      "bg-white",
      "text-6xl",
      "text-black",
      "font-bold",
      "text-center"
    );
    productContainer.textContent = "Produit introuvable";

    const existingProductDiv = document.getElementById(
      "existing-product-container"
    );
    existingProductDiv.style.display = "none";
  }

  // update the product details
  updateProductDetails();

  inreaseBtn.addEventListener("click", increaseQuantity);
  decreaseBtn.addEventListener("click", decreaseQuantity);

  if (addToCartButton && product[0] && productId) {
    addToCartButton.addEventListener("click", async () => {
      await addToCart(product[0], quantity, productId);

      quantity = 1;
      quantityInput.textContent = quantity;
    });
  }
});

const addToCart = async (product, quantity, productId) => {
  if (!product) return;

  const user = localStorage.getItem("user");
  const isAuth = user == "null" ? false : true;

  if (!isAuth) {
    const popUp = document.getElementById("login-popup");

    popUp.textContent = `Login or Register to add to cart 🛒`;
    popUp.style.display = "block";

    setTimeout(() => {
      popUp.style.display = "none";
    }, 5000);
    return;
  }

  await addToCartSend(product, quantity, user, productId);
};

const addToCartSend = async (product, quantity, id, productId) => {
  try {
    const response = await fetch(
      "http://localhost/gadgetstoreapi/cart/addToCart.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
          price: product.price_discounted,
          user_id: id,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      const popUp = document.getElementById("login-popup");
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
        const popUp = document.getElementById("login-popup");
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
    console.error(err);
  }
};
