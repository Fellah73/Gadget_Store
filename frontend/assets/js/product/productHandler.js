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
    categoryElement.textContent = generateCategEmoji(product[0].categ);

    //update title
    const titleElement = document.getElementById("product-title");
    titleElement.textContent = product[0].name;

    //update discount
    const discountElement = document.getElementById("product-discount");
    discountElement.textContent = `${product[0].discount}%`;

    //update price
    const priceElement = document.getElementById("product-price");
    priceElement.textContent = product[0].price;

    //update old price
    const newPriceElement = document.getElementById("product-price-discounted");
    newPriceElement.textContent = `${product[0].price_discounted} DZD`;

    //update description
    const descriptionElement = document.getElementById("product-description");

    descriptionElement.textContent = `Conçue pour offrir une expérience utilisateur exceptionnelle,
     elle intègre les dernières technologies pour garantir des performances avancées.
       Idéale pour ceux qui recherchent une qualité supérieure, la ${product[0].name} de ${product[0].brand} est 
       un choix incontournable pour les passionnés`;

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
      infoElementKey.classList.add("text-blue-950", "text-base", "font-bold");
      infoElementKey.textContent = key;

      const infoElementValue = document.createElement("p");
      infoElementValue.classList.add("text-gray-700", "text-base", "truncate");
      infoElementValue.textContent = value;

      extraInfoElement.appendChild(infoElementKey);
      extraInfoElement.appendChild(infoElementValue);
    });
  };

  const generateCategEmoji = (category) => {
    switch (category) {
      case "Smartphones":
        return "📱";
      case "Gaming Consoles":
        return "🎮";
      case "Smartwatches":
        return "⌚";
      case "Headsets":
        return "🎧";
      default:
        return "🛍️";
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
