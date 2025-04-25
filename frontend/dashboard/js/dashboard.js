document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("user");

  if (token == "null") {
    window.location.href = "index.html";
  }

  const getUserRole = async () => {
    if (token == "null") return;
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/auth/getUserRole.php?user_id=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        const role = data.role;
        if (role === "user") {
          window.location.href = "shop.html";
        } else {
          document.getElementById("admin-name").textContent = `${data.name} 👨🏻‍💻`;
        }
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  await getUserRole();

  console.log("dashboard.js loaded");

  const totlalDashboard = document.getElementById("total-dashboard");

  fetch("dashboard/components/globalDashboard.html")
    .then((response) => response.text())
    .then((data) => {
      totlalDashboard.innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar:", error));

  const totalProduct = document.getElementById("stock");

  fetch("dashboard/components/globalProducts.html")
    .then((response) => response.text())
    .then((data) => {
      totalProduct.innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar:", error));

  const addProductSection = document.getElementById("add-product");
  fetch("dashboard/components/addProduct.html")
    .then((response) => response.text())
    .then((data) => {
      addProductSection.innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar:", error));

  const orderSection = document.getElementById("orders");
  fetch("dashboard/components/orders.html")
    .then((response) => response.text())
    .then((data) => {
      orderSection.innerHTML = data;
    })
    .catch((error) => console.error("Error loading navbar:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  const expiration_session = localStorage.getItem("session_expiration");
  const now = Date.now();

  // si session expire
  if (expiration_session < now) {
    localStorage.setItem("user", "null");
    localStorage.setItem("session_expiration", "null");
    window.location.href = "index.html";
  }
});
