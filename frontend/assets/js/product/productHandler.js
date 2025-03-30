document.addEventListener("DOMContentLoaded", async () => {
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
        console.log(data.product);
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
    priceElement.textContent = `${product[0].price} DZD`;

    //update old price
    const newPriceElement = document.getElementById("product-discount-price");
    newPriceElement.textContent = product[0].price_discounted;

    //update description
    const descriptionElement = document.getElementById("product-description");

    let descriptionText;
    for (let i = 0; i < 8; i++) {
      descriptionText += product[0].name + " ";
    }

    descriptionElement.textContent = descriptionText;

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
});
