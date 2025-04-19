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
        orders = data.orders;
        orderCount.textContent = orders.length;
        user.textContent = data.user;
        let total = data.orders.reduce((total, order) => total + parseFloat(order.total), 0);
        totalSpent.textContent = `${total.toFixed(2)} DZD`;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const displayOrders = async () => {
    await fetchOrders();
    orders_container.innerHTML = "";
    orders.forEach((order, key) => {
      const card = createOrderCard(key + 1, order);
      orders_container.appendChild(card);
    });
  };

  await displayOrders();
});

const createOrderCard = (key, order) => {
  // Créer le conteneur principal de la carte
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-2xl border border-blue-700 shadow-lg shadow-gray-500 overflow-hidden hover:-translate-y-2 transition-all duration-300";

  // Ajouter le contenu HTML de la carte
  card.innerHTML = `
    <div class="bg-blue-50 px-4 py-3 border-b border-blue-700">
      <div class="flex justify-between items-center px-2">
        <div class="flex flex-col gap-y-2">
          <h3 class="font-semibold text-lg text-blue-800">Order #${key}</h3>
          <p class="text-sm tracking-wide text-gray-600">Placed on ${
            formatOrderDate(order.created_at)
          }</p>
        </div>
        <span class="bg-green-50 text-green-700 border border-green-900 text-base px-4 py-3 rounded-full font-medium tracking-wide">
          Delivered
        </span>
      </div>
    </div>

    <div>
      <div class="overflow-x-auto border border-gray-600">
        <table class="size-full flex flex-col">
          <thead>
            <tr class="sticky top-0 mr-4 grid grid-cols-10 md:grid-cols-12 border-b border-gray-400 divide-x divide-gray-300 text-base tracking-wider text-gray-500 font-thin">
              <th class="py-2 col-span-5">Gadget</th>
              <th class="py-2 col-span-1 hidden md:block">Type</th>
              <th class="py-2 col-span-1 hidden md:block">Qte</th>
              <th class="py-2 col-span-2">Price</th>
              <th class="py-2 col-span-3">Subtotal</th>
            </tr>
          </thead>
          <tbody class="text-base text-black font-semibold text-center h-[200px] overflow-y-scroll">
            ${order.items
              .map(
                (item) => `
              <tr class="grid grid-cols-10 md:grid-cols-12 divide-x divide-gray-300 border border-gray-400">
                <td class="py-2 col-span-5 px-2 text-left truncate text-base">${item.name}</td>
                <td class="py-2 col-span-1 text-3xl hidden md:block">${generateCategEmoji(item.category_id)}</td>
                <td class="py-2 col-span-1 hidden md:block text-lg text-gray-600">${item.quantity}</td>
                <td class="py-2 col-span-2">${item.price}</td>
                <td class="py-2 col-span-3 px-3 text-right">${item.subtotal}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="mt-4 py-3 w-[90%] md:w-[70%] mx-auto">
        <div class="w-full flex justify-between items-center px-4 md:px-8 text-xl tracking-wider">
          <span class="font-semibold text-gray-800">Total :</span>
          <span class="font-bold text-blue-900">${order.total} DZD</span>
        </div>
        <div class="mt-4">
          <button class="w-full bg-amber-600 hover:bg-amber-700 transition-colors duration-200 text-white rounded-lg px-4 py-2 text-lg font-bold tracking-wider">
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

  const formatOrderDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
  
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleString("en-GB", options).replace(",", " at");
  }
  