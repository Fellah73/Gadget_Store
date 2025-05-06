document.addEventListener("DOMContentLoaded", () => {
  console.log("search.js loaded");

  let results = [];
  const searchResults = async (name) => {
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/products/search.php?name=${name}`
      );

      const data = await response.json();

      if (!data.success) {
        console.log(data.error);
        return;
      }

      results = data.products;
    } catch (error) {
      console.log(error);
    }
  };

  document.addEventListener("input", (event) => {
    const searchInput = event.target;

    if (searchInput.id !== "search-Input") {
      console.log("Not the search input");
      return;
    }

    const searchResultsContainer = document.getElementById("search-results");

    if (searchInput.value === "") {
      searchResultsContainer.style.display = "none";
      return;
    }

    const displayResults = (results) => {
      searchResultsContainer.innerHTML = "";
      searchResultsContainer.style.display = "flex";

      const closeButton = document.createElement("button");
      closeButton.className =
        "flex justify-between items-center w-full px-8 text-black active:scale-100 active:rounded-full active:bg-gray-300";
      closeButton.innerHTML = `
      <span class="text-xl tracking-wide text-black">Results for " ${searchInput.value} "</span> 
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>`;

      closeButton.addEventListener("click", () => {
        searchResultsContainer.innerHTML = "";
        searchResultsContainer.style.display = "none";
        searchInput.value = "";
      });

      searchResultsContainer.appendChild(closeButton);

      if (results.length === 0) {
        searchResultsContainer.innerHTML =
          "<p class='text-center text-black'>Aucun produit</p>";
        return;
      }

      results.forEach((result) => {
        const resultItem = createProductCard(result);
        searchResultsContainer.appendChild(resultItem);
      });
    };

    const startSearching = async () => {
      await searchResults(searchInput.value);
      displayResults(results);
    };

    
    if (searchInput.value.length >= 4) {
      startSearching();
    } else {
      searchResultsContainer.style.display = "none";
    }

    
    const searchButton = document.getElementById("search-btn");

    searchButton.addEventListener("click", async () => {
      await searchResults(searchInput.value); // ✅ Attendre la réponse avant d'effacer l'input
      displayResults(results);
    });
  });
});

const generateCategEmoji = (category) => {
  switch (category) {
    case 1:
      return "📱";
    case 2:
      return "🎮";
    case 3:
      return "⌚";
    case 4:
      return "🎧";
    default:
      return "🛍️";
  }
};

const createProductCard = (result) => {
  const categories = [1, 3, 2, 4];
  const backgroundColors = [
    "from-gray-700 to-gray-900",
    "from-neutral-500 to-neutral-700",
    "from-blue-600 to-blue-800",
    "from-gray-400 to-gray-600",
  ];

  const backgroundColor =
    backgroundColors[categories.indexOf(result.category_id)];
  const card = document.createElement("a");
  card.className = `w-full h-80 flex flex-row items-center justify-between p-1 rounded-lg bg-gradient-to-br ${backgroundColor} hover:shadow-lg transition-shadow duration-300`;

  
  card.href = `/frontend/product.html?id=${result.id}`;

  card.innerHTML = `
      <div class="w-full relative flex items-center space-x-4">
        <div class="w-1/4 size-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
          <img 
            src="${result.image || "/placeholder-image.jpg"}" 
            alt="${result.name}" 
            class="w-full h-full object-contain"
            onerror="this.src='/placeholder-image.jpg'; this.onerror=null;"
          >
        </div>
        <div class="w-1/2 flex flex-col space-y-2">
          <h3 class="font-bold text-white tracking-wide text-base truncate max-w-[200px]">${
            result.name
          }</h3>
          <p class="font-bold text-center text-white text-lg">${
            result.price_discounted
          } 💲</p>
        </div>
        <span class="absolute inset-y-0  right-3 w-1/4 flex items-center justify-center px-2 py-1 text-3xl">
            ${generateCategEmoji(result.category_id) || "Non catégorisé"}
        </span>
    </div>
    `;

  return card;
};



document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user");

  const updateCartCount = async (userId) => {
    if (userId == "null") return;

    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/cart/getCart.php?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        document.querySelector("#cart-items-number").textContent =
          data.cart_items.length;
      } else {
        document.querySelector("#cart-items-number").textContent = "0";
        
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  await updateCartCount(userId);
});



document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user");

  const updateCartCount = async (userId) => {
    if (userId == "null") return;

    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/order/getUserOrders.php?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        document.querySelector("#order-count").textContent =
          data.length;
      } else {
        document.querySelector("#order-count").textContent = "0";
        
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  await updateCartCount(userId);
});
