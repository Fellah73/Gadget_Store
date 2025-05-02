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
            )
            .sort((itemA, itemB) => itemA.qte - itemB.qte);
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
        stockItem.classList.add(
          "bg-blue-700/50,text-black",
          "hover:text-white"
        );
        stockItem.classList.add("hover:bg-blue-900/50", "cursor-pointer");
        stockItem.classList.add("transition", "duration-300", "ease-in-out");
        stockItem.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <img
              src=${item.image}
              alt="Product Image"
              class="size-14 rounded-md"
            />
            <div class="ml-4">
              <div class="text-base font-medium truncate ">
                ${item.name}
              </div>
            </div>
          </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-3xl">${generateCategEmoji(item.category_id)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-xl ">${item.qte}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-lg tracking-wide ">${
            item.price_discounted
          }<span class="ml-2 text-sm tracking-wider ">DZD</span> </div>
              </td>

              <td
          class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
          <input
            placeholder="0" min="0" max="9" type="number" class="text-white border-2 border-white font-bold text-lg mr-4 pl-3 size-12 bg-gray-700 rounded-full text-center"
          />
          <button id="update-btn" 
            class="text-white bg-blue-950 hover:bg-blue-200 hover:text-blue-950 transition-colors duration-200 ease-in-out p-4  rounded-full"
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
      stockItemsByCategory = stockItems
        .filter((item) => item.category_id === parseInt(categoryFilter.value))
        .sort((itemA, itemB) => itemA.qte - itemB.qte);
      await displayStockItems();
    });
    await displayStockItems();
  }, 1000);
});

const generateCategEmoji = (category) => {
  switch (category) {
    case 1:
      return `<svg
            class="size-14 mr-2 text-blue-900"
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
    case 2:
      return `
      <svg
            class="size-14 mr-2 text-blue-900"
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
    case 3:
      return `
      <svg
            class="size-14 mr-2 text-blue-900"
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
            class="size-14 mr-2 text-blue-900"
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
