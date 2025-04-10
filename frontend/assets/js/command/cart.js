document.addEventListener("DOMContentLoaded", function () {
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

    
  });