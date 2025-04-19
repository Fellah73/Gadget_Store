document.addEventListener("DOMContentLoaded", async () => {
  console.log("checkout.js loaded");
  if (localStorage.getItem("user") == "null")
    window.location.href = "login.html";

  // enter the page only after chcking the items carts
  if(localStorage.getItem("canProceedToCheckout") == "false"){
    window.location.href = "cart.html";
  }

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

  // chekout part
  const checkoutForm = document.getElementById("checkout-form");
  const nameInput = document.getElementById("name-input");
  const emailInput = document.getElementById("email-input");
  const phoneNumberInput = document.getElementById("phone-number-input");
  const countrySelect = document.getElementById("country-select");
  const streetInput = document.getElementById("street-details-input");
  const homeInput = document.getElementById("home-details-input");
  const townInput = document.getElementById("town-input");
  const stateInput = document.getElementById("state-input");
  const zipInput = document.getElementById("zip-input");
  const paymentMethodSelect = document.getElementById("payment-method");
  const checkoutButton = document.getElementById("checkout-button");

  // Example usage: Add event listeners to validate inputs on blur
  nameInput.addEventListener("input", () => {
    if (!validateName(nameInput.value)) {
      document.getElementById("name-error").textContent =
        "Min 2 and Max 14 characters";
    } else {
      document.getElementById("name-error").textContent = "";
    }
  });

  emailInput.addEventListener("input", () => {
    if (!validateEmail(emailInput.value)) {
      document.getElementById("email-error").textContent =
        "email shoould contain @ and . ";
    } else {
      document.getElementById("email-error").textContent = "";
    }
  });

  phoneNumberInput.addEventListener("input", () => {
    if (!validatePhoneNumber(phoneNumberInput.value)) {
      document.getElementById("phone-number-error").textContent =
        "Only numbers allowed and Min 10 and Max 15";
    } else {
      document.getElementById("phone-number-error").textContent = "";
    }
  });

  streetInput.addEventListener("input", () => {
    if (!validateStreet(streetInput.value)) {
      document.getElementById("street-details-error").textContent =
        "Min 10 and Max 60 characters";
    } else {
      document.getElementById("street-details-error").textContent = "";
    }
  });

  homeInput.addEventListener("input", () => {
    if (!validateHome(homeInput.value)) {
      document.getElementById("home-details-error").textContent =
        "Min 5 and Max 30 characters";
    } else {
      document.getElementById("home-details-error").textContent = "";
    }
  });

  townInput.addEventListener("input", () => {
    if (!validateTown(townInput.value)) {
      document.getElementById("city-error").textContent =
        "Min 2 and Max 20 characters";
    } else {
      document.getElementById("city-error").textContent = "";
    }
  });

  stateInput.addEventListener("input", () => {
    if (!validateState(stateInput.value)) {
      document.getElementById("state-error").textContent =
        "Min 3 and Max 15 characters";
    } else {
      document.getElementById("state-error").textContent = "";
    }
  });

  zipInput.addEventListener("input", () => {
    if (!validateZip(zipInput.value)) {
      document.getElementById("zip-error").textContent =
        "Only numbers allowed and Min 4 and Max 10 characters";
    } else {
      document.getElementById("zip-error").textContent = "";
    }
  });

  const placeOrder = async () => {
    const userId = localStorage.getItem("user");

    if (userId == "null") return;

    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/order/placeOrder.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            full_name: nameInput.value,
            email: emailInput.value,
            phone: phoneNumberInput.value,
            country: countrySelect.value,
            street_address: streetInput.value,
            home_address: homeInput.value,
            city: townInput.value,
            state: stateInput.value,
            zip_code: zipInput.value,
            payment_method: paymentMethodSelect.value,
            total: cartItems
              ? cartItems.reduce(
                  (sum, item) => sum + parseFloat(item.subtotal),
                  0
                )
              : 0,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log(data.message);

        // add a small pop up message
        const popUpMessage = document.getElementById("order-success");
        popUpMessage.style.display = "flex";
        
        setTimeout(() => {
          window.location.href = "/frontend/shop.html";
        }, 4000);

        

      } else {
        console.log(data.message);
        {
          if (data.message.includes("not available now")) {
            window.location.href = "/frontend/cart.html";
          }
        }
        window.location.href = "/frontend/shop.html";
      }
    } catch (error) {
      console.error(error);
    }
  };

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    checkoutButton.disabled = true;
    let errors = {};

    if (!validateName(nameInput.value)) {
      errors.name = "name ";
    }

    if (!validateEmail(emailInput.value)) {
      errors.email = "email ";
    }

    if (!validatePhoneNumber(phoneNumberInput.value)) {
      errors.phone = "phone ";
    }

    if (!validateStreet(streetInput.value)) {
      errors.street = "street ";
    }

    if (!validateHome(homeInput.value)) {
      errors.home = "home ";
    }

    if (!validateTown(townInput.value)) {
      errors.town = "town ";
    }

    if (!validateState(stateInput.value)) {
      errors.state = "state ";
    }

    if (!validateZip(zipInput.value)) {
      errors.zip = "zip ";
    }

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.keys(errors).map((key) => errors[key]);
      document.getElementById(
        "payment-method-error"
      ).textContent = `check the ${errorMessages.join(", ")} fields.`;
      checkoutButton.disabled = false;
      return;
    }

    await placeOrder();
  });
});
const validateName = (name) => /^[a-zA-Z\s]{2,14}$/.test(name);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNumber = (phone) => /^\+?\d{10,15}$/.test(phone);
const validateStreet = (street) => /^[a-zA-Z0-9\s,.'-]{10,60}$/.test(street);
const validateHome = (home) => /^[a-zA-Z0-9\s,.'-]{5,30}$/.test(home);
const validateTown = (town) => /^[a-zA-Z\s]{2,20}$/.test(town);
const validateState = (state) => /^[a-zA-Z\s]{4,15}$/.test(state);
const validateZip = (zip) => /^\d{4,10}$/.test(zip);
