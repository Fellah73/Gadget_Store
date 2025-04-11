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

      // Update active navbar item
      const cartNavItem = document.getElementById("cart");
      if (cartNavItem) {
        cartNavItem.style.color = "rgb(59, 130, 246)";
        cartNavItem.style.borderBottomColor = "rgb(59, 130, 246)";
      }
    })
    .catch((error) => console.error("Error loading navbar:", error));

  const cartContainer = document.getElementById("cart-items");
  const titleContainer = document.getElementById("cart-title");
  const tableContainer=document.getElementById('cart-table');
  let cartItems = null;
  const fetchCartItems = async (userId) => {
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
        console.log(data.cart_items);
        cartItems = data.cart_items;
        titleContainer.textContent = `${data.user} Here is your cart 🛒`;
      } else {
          titleContainer.textContent = `${data.user} your cart is empty 🛒`;
          tableContainer.style.display="none";
          console.log(data.message)
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const deleteItemDB = async (item) => {
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/cart/removeFromCart.php`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: item.id,
            product_id: item.product_id,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log(`data after deleting item ${item.name}`,data.message);
      } else {
        console.error("Error fetching cart items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const deleteItem = async (item) => {
    cartItems = cartItems.filter((i) => i.product_id !== item.product_id);
    console.log("item deleted", item.product_id);
    await deleteItemDB(item);

  
      await displayCartItems();
  
  };

  const displayCartItems = async () => {
    await fetchCartItems(localStorage.getItem("user"));
    if (!cartItems) {
      console.log("cartItems not found");
      return;
    }
     cartContainer.innerHTML=""
    cartItems.forEach((item) => {
      const cartItem = createCartItem(item);

      const removeButton = cartItem.querySelector("#remove-from-cart");
      removeButton.addEventListener("click", async () => {
        console.log(`... deleting ${item.name} which id is ${item.product_id} and cartId is ${item.id}`);
        await deleteItem(item);
      });
      cartContainer.appendChild(cartItem);
    });
  };

  await displayCartItems();
});

function createCartItem(cardItem) {
  const container = document.createElement("div");
  container.className =
    "flex flex-col md:grid md:grid-cols-12 items-center border-b border-gray-200";
  container.id = `item-container`;
  container.innerHTML = `
    <div  class="col-span-1 p-4 flex items-center justify-center">
      <button  
        id="remove-from-cart"
       class=" text-red-800 rounded-full hover:scale-150 font-bold text-4xl"
       data-id="${cardItem.product_id}">
       &times;
      </button>
    </div>
    <div class="hidden md:block col-span-2 p-4">
      <a href="product.html?id=${cardItem.product_id}">
       <img
        src="${cardItem.image}"
        alt="${cardItem.name}"
        class="w-24 h-24 object-contain"
       />
      </a>
    </div>
    <div class="col-span-4 p-4 flex flex-col justify-center items-end md:items-start">
      <h3 class="font-bold text-gray-800">${cardItem.name}</h3>
      <p class="text-gray-700 text-lg">${cardItem.categ} ${categEmoji(cardItem.categ)}</p>
    </div>
    <div class="p-4 text-right md:col-span-2 md:flex md:items-center md:justify-center text-gray-800 font-semibold">
      ${cardItem.product_price}
    </div>
    <div class="col-span-2 p-4 flex justify-start items-center md:justify-center md:items-center">
      <button
       class="decrement-btn size-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl text-center font-bold"
       data-id="${cardItem.id}">
       -
      </button>
      <input
       type="text"
       value="${cardItem.quantity}"
       class="mx-2 w-20 p-2 text-center border border-gray-300 rounded-2xl"
       data-id="${cardItem.id}"
      />
      <button
       class="increment-btn size-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-2xl text-center font-bold"
       data-id="${cardItem.id}">
       +
      </button>
    </div>
    <div class="p-4 text-right md:flex md:col-span-1 md:items-center md:justify-center text-gray-800 font-semibold">
      ${cardItem.subtotal}
    </div>
   `;

  return container;
}
const categEmoji = (category) => {
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
