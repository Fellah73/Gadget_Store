document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("user");

  if (token == "null") {
    window.location.href = "shop.html";
  }

  // Load navbar component
  fetch("components/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;

      // Re-attach navbar events after loading
      const mobileMenuButton = document.querySelector(
        '[aria-controls="mobile-menu"]'
      );
      const mobileMenu = document.getElementById("mobile-menu");

      if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }

      // Update active navbar items
      const cartNavItem = document.getElementById("cart");
      if (cartNavItem) {
        cartNavItem.style.color = "rgb(59, 130, 246)";
        cartNavItem.style.borderBottomColor = "rgb(59, 130, 246)";
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));

  
  fetch("components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-container").innerHTML = data;
      const backToTopButton = document.getElementById("back-to-top");

      backToTopButton.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    })
    .catch((error) => console.error("Error loading footer:", error));

  // handle orders
  const orderCount = document.getElementById("orders-count");
  const user = document.getElementById("username");
  const orders_container = document.getElementById("orders-container");
  const totalSpent = document.getElementById("total-spent");

  let orders = null;

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/order/getUserOrders.php?user_id=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        if (!data.orders) {
          orders = null;
        }
        orders = data.orders ? data.orders : null;
        orderCount.textContent = orders ? orders.length : 0;
        user.textContent = data.user;
        let total = !data.orders
          ? 0
          : data.orders.reduce(
              (total, order) => total + parseFloat(order.total),
              0
            );
        totalSpent.textContent = `${total.toFixed(2)} DZD`;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/order/cancelOrder.php?order_id=${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const displayOrders = async () => {
    await fetchOrders();
    orders_container.innerHTML = "";
    if (!orders) return;
    orders.forEach((order, key) => {
      const card = createOrderCard(key + 1, order);
      orders_container.appendChild(card);

      const cancelOrderButton = card.querySelector("#cancel-order");
      cancelOrderButton.addEventListener("click", async () => {
        await cancelOrder(order.id);
        await displayOrders();
      });
    });
  };

  await displayOrders();
});

const createOrderCard = (key, order) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "shipped":
        return "bg-blue-800 text-blue-100 border border-blue-400";
      case "delivered":
        return "bg-emerald-800 text-emerald-100 border border-emerald-400";
      case "cancelled":
        return "bg-red-800 text-red-100 border border-red-400";
      default:
        return "bg-amber-800 text-amber-100 border border-amber-400";
    }
  };

  // Créer le conteneur principal de la carte
  const card = document.createElement("div");
  card.className =
    "bg-blue-900/50 rounded-2xl border border-blue-300 shadow-lg shadow-blue-900/50 overflow-hidden hover:-translate-y-2 transition-all duration-300";

  // Ajouter le contenu HTML de la carte
  card.innerHTML = `
    <div class="bg-blue-950 px-4 py-3 border-b border-blue-400">
      <div class="flex justify-between items-center px-2">
        <div class="flex flex-col gap-y-2">
          <h3 class="font-semibold text-lg text-blue-100">Order #${key}</h3>
          <p class="text-sm tracking-wide text-blue-200">Placed on ${formatOrderDate(
            order.created_at
          )}</p>
        </div>
        <span class="${getStatusColor(
          order.status
        )} text-base px-4 py-3 rounded-full font-medium tracking-wide">
          ${order.status}
        </span>
      </div>
    </div>
    
    <div>
      <div class="overflow-x-auto border border-blue-700">
        <table class="size-full flex flex-col">
          <thead>
            <tr class="sticky top-0 mr-4 grid grid-cols-10 md:grid-cols-12 border-b border-blue-600 divide-x divide-blue-700 text-base tracking-wider text-blue-200 font-thin">
              <th class="py-2 col-span-5">Gadget</th>
              <th class="py-2 col-span-1 hidden md:block">Type</th>
              <th class="py-2 col-span-1 hidden md:block">Qte</th>
              <th class="py-2 col-span-2">Price</th>
              <th class="py-2 col-span-3">Subtotal</th>
            </tr>
          </thead>
          <tbody class="text-base text-blue-50 font-semibold text-center h-[200px] overflow-y-scroll">
            ${order.items
              .map(
                (item) => `
              <tr class="grid grid-cols-10 md:grid-cols-12 divide-x divide-blue-700 border border-blue-700 hover:bg-blue-800/90 transition-colors duration-200">
                <td class="py-2 col-span-5 px-2 text-left truncate text-base">${
                  item.name
                }</td>
                <td class="py-2 col-span-1 items-center justify-center hidden md:flex">${generateCategEmoji(
                  item.category_id
                )}</td>
                <td class="py-2 col-span-1 hidden md:block text-lg text-blue-300">${
                  item.quantity
                }</td>
                <td class="py-2 col-span-2">${item.price_discounted}</td>
                <td class="py-2 col-span-3 px-3 text-right">${
                  item.subtotal
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 py-3 w-[90%] md:w-[70%] mx-auto">
        <div class="w-full flex justify-between items-center px-4 md:px-8 text-xl tracking-wider">
          <span class="font-semibold text-blue-200">Total :</span>
          <span class="font-bold text-blue-100">${order.total} DZD</span>
        </div>
        <div class="mt-4">
          <button id="cancel-order" class="${
            order.status === "processing" ? "" : "hidden"
          } w-full bg-amber-600 hover:bg-amber-700 transition-colors duration-200 text-white rounded-lg px-4 py-2 text-lg font-bold tracking-wider">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  `;

  return card;
};

const generateCategEmoji = (category) => {
  switch (category) {
    case 1:
      return `<svg
            class="size-8 text-gray-200"
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
            class="size-8 text-gray-200"
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
            class="size-8 text-gray-200"
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
            class="size-8 text-gray-200"
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

const formatOrderDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = new Date(dateString.replace(" ", "T"));
  return date.toLocaleString("en-GB", options).replace(",", " at");
};
