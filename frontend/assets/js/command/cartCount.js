export const updateCartCount = async (userId) => {
  if (userId == "null") return;
  const cartItemNumber = document.getElementById("cart-items-number");
  console.log(cartItemNumber ?? 'not found');
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
      cartItemNumber.textContent = data.cart_items.length;
    } else {
      cartItemNumber.textContent = "0";
      console.log(data.message);
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};
