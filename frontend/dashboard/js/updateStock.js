document.addEventListener("DOMContentLoaded", () => {
  console.log("updateStock.js loaded");
  setTimeout(async () => {
    let stockItems = [];
    let stockItemsByCategory = [];
    const stockProductsContainer = document.getElementById(
      "stock-products-container"
    );
    const categoryFilter = document.getElementById("category-filter");
    const fetchStockItems = async () => {
      try {
        const response = await fetch(
          "http://localhost/gadgetstoreapi/products/getProducts?category_id=0.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          stockItems = data.products;
          stockItemsByCategory = data.products
            .map((item) => ({
              ...item,
            }))
            .filter(
              (item) => item.category_id === parseInt(categoryFilter.value)
            );
          document.getElementById(
            "stock-items-count"
          ).textContent = `We Have ${stockItems.length} item`;

          document.getElementById("stock-items-qte").textContent =
            stockItems.reduce((count, item) => count + item.qte, 0);
        }
      } catch (error) {
        console.error("Error fetching stock items:", error);
      }
    };

    const updateItemStock = async (itemId, quantity) => {
      try {
        const response = await fetch(
          `http://localhost/gadgetstoreapi/products/updateStock.php`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product_id: itemId,
              quantity: quantity,
            }),
          }
        );
        const data = await response.json();
        if (!data.success) {
          console.error(data.message ?? data.error);
        }
      } catch (error) {
        console.error("Error updating cart items:", error);
      }
    };

    const displayStockItems = async () => {
      if (stockItems.length === 0) {
        await fetchStockItems();
      }
      stockProductsContainer.innerHTML = "";
      stockItemsByCategory.forEach((item) => {
        const stockItem = document.createElement("tr");
        stockItem.classList.add("stock-item");
        stockItem.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <img
              src=${item.image}
              alt="Product Image"
              class="h-10 w-10 rounded-md"
            />
            <div class="ml-4">
              <div class="text-sm font-medium truncate text-gray-900">
                ${item.name}
              </div>
            </div>
          </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-3xl">${generateCategEmoji(item.category_id)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-xl text-gray-900">${item.qte}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-lg text-gray-900">${
            item.price_discounted
          }<span class="ml-4 text-sm tracking-wide text-gray-500">DZD</span> </div>
              </td>

              <td
          class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
          <input
            placeholder="0" min="0" max="9" type="number" class="text-black text-lg mr-4 pl-3 size-12 bg-cyan-100 rounded-full text-center"
          />
          <button id="update-btn" 
            class="text-blue-600 hover:text-blue-900 p-4 bg-blue-200 rounded-full"
          >
            <li class="fas w-6 fa-arrow-right"></li>
          </button>
          </td>  
        `;
        stockProductsContainer.appendChild(stockItem);
        const updateButton = stockItem.querySelector("#update-btn");
        const updateInput = stockItem.querySelector("input");

        updateButton.addEventListener("click", async () => {
          const updatedQuantity = updateInput.value;
          if (updatedQuantity == 0) return;
          await updateItemStock(item.id, updatedQuantity);
          await fetchStockItems();
          await displayStockItems();
        });
      });
    };

    categoryFilter.addEventListener("change", async () => {
      stockItemsByCategory = stockItems.filter(
        (item) => item.category_id === parseInt(categoryFilter.value)
      );
      await displayStockItems();
    });
    await displayStockItems();
  }, 1000);
});

const generateCategEmoji = (category) => {
  switch (category) {
    case 1:
      return "📱";
    case 2:
      return "🎮";
    case 4:
      return "⌚";
    case 3:
      return "🎧";
    default:
      return "🛍️";
  }
};
