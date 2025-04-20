document.addEventListener("DOMContentLoaded", () => {
  console.log("isAuth.js loaded");

  const checkAuthLink = () => {
    const authLink = document.getElementById("register");
    const authLink2 = document.getElementById("login");
    const cartLink = document.getElementById("cart-link");
    const ordersLink = document.getElementById("order-link");

    if (authLink) {
      const token = localStorage.getItem("user");
      const expiration_session = localStorage.getItem("session_expiration");
      const now = Date.now();

      // si session pas encore expiré
      if (expiration_session > now && expiration_session !== "null") {
        authLink.textContent = "Logout";
        cartLink.style.display = "block";
        ordersLink.style.display = "block";

        authLink.onclick = () => {
          localStorage.setItem("user", "null");
          localStorage.setItem("session_expiration", "null");
          window.location.href = "shop.html";
        };

        if (authLink2) authLink2.style.display = "none";
      } else {
        // Supprimer si session expiré
        localStorage.setItem("user", "null");
        localStorage.setItem("session_expiration", "null");

        authLink.textContent = "Register";
        authLink.href = "register.html";

        cartLink.style.display = "none";
        ordersLink.style.display = "none";

        if (authLink2) {
          authLink2.style.display = "block";
          authLink2.textContent = "Login";
          authLink2.href = "login.html";
        }
      }

      clearInterval(intervalId);
    }
  };

  const intervalId = setInterval(checkAuthLink, 100);
});
