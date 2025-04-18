document.addEventListener("DOMContentLoaded", async () => {
  console.log("checkout.js loaded");
  if (localStorage.getItem("user") == "null")
    window.location.href = "shop.html";

  // enter the page only after chcking the items carts
  if (localStorage.getItem("canProceedToCheckout") == "false")
    window.location.href = "cart.html";

  localStorage.setItem("canProceedToCheckout", "false");
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

      // Update active navbar item
      const cartNavItem = document.getElementById("cart");
      if (cartNavItem) {
        cartNavItem.style.color = "rgb(59, 130, 246)";
        cartNavItem.style.borderBottomColor = "rgb(59, 130, 246)";
      }
    })

    .catch((error) => console.error("Error loading navbar:", error));

  let cartItems = null;
  const fetchOrderItems = async (userId) => {
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
        cartItems = data.cart_items;
        console.log(data.cart_items);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userId = localStorage.getItem("user");
  const orderItemsConatiner = document.getElementById("order-items");

  const displayOrderItems = async () => {
    if (userId == "null") return;
    await fetchOrderItems(userId);

    if (cartItems == null) return;
    orderItemsConatiner.innerHTML = "";
    cartItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "grid grid-cols-8 border-t border-gray-200";
      card.innerHTML = ` <div class="p-4 col-span-4 truncate text-blue-950 font-bold border-gray-200 border-y border-l">
              ${item.name}
            </div>
             <div class="text-sm py-5 col-span-1 text-blue-950 font-extrabold tracking-wider border-gray-200 border-y border-r">
              X <span class="text-base">${item.quantity}</span>
            </div>
            <div
              class="p-4 col-span-3 text-blue-950 text-left tracking-wide text-base border-gray-200 border-y border-r"
            > 
              ${item.subtotal} DZD
            </div>`;

      orderItemsConatiner.appendChild(card);
    });

    const subtotalPrice = document.getElementById("subtotal");
    const totalPrice = document.getElementById("total");
    let total = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );
    subtotalPrice.textContent = `${total.toFixed(2)} DZD`;
    totalPrice.textContent = `${(total.toFixed(2) * 1.1).toFixed(2)} DZD`;
  };
  await displayOrderItems();
});
