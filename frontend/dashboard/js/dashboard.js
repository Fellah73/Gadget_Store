document.addEventListener("DOMContentLoaded", async () => {
  const userRole = document.getElementById("user-role");

  const overviewsLinks = document.querySelectorAll("a[href='#overview']");
  const overviewDiv = document.getElementById("overview");

  const ordersLinks = document.querySelectorAll("a[href='#orders']");
  const ordersDiv = document.getElementById("orders");

  const usersLinks = document.querySelectorAll("a[href='#users']");
  const usersDiv = document.getElementById("users");

  const token = localStorage.getItem("user");

  if (token == "null") {
    window.location.href = "index.html";
  }
  let role;

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
        role = data.role;
        if (role != "user") {
          document.getElementById("admin-name").textContent = `${data.name} `;
        }
        role = data.role;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  await getUserRole();

  if (role == "user") {
    window.location.href = "shop.html";
  }

  userRole.textContent = role
    .replace("_", " ")
    .replace(/^./, (char) => char.toUpperCase());
  console.log("dashboard.js loaded");

  // handle a tags
  if (role == "stock_manager") {
    // hide the overview link and div
    overviewsLinks.forEach((overview) => {
      overview.style.display = "none";
    });
    overviewDiv.style.display = "none";

    // hide the orders link and div
    ordersLinks.forEach((order) => {
      order.style.display = "none";
    });
    ordersDiv.style.display = "none";
  }

  if (role != "super_admin") {
    usersLinks.forEach((user) => {
      user.style.display = "none";
    });
    usersDiv.style.display = "none";
  }

  const totlalDashboard = document.getElementById("overview");

  // only admin can see the dashboard overview
  if (role == "super_admin" || role == "admin") {
    fetch("dashboard/components/dashboardOverview.html")
      .then((response) => response.text())
      .then((data) => {
        totlalDashboard.innerHTML = data;
      })
      .catch((error) => console.error("Error loading navbar:", error));
  }

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

  // only admin can see the orders section
  if (role == "admin" || role == "super_admin") {
    fetch("dashboard/components/orders.html")
      .then((response) => response.text())
      .then((data) => {
        orderSection.innerHTML = data;
      })
      .catch((error) => console.error("Error loading navbar:", error));
  }

  const userSection = document.getElementById("users");

  // only super admin can see the users section
  if (role == "super_admin") {
    fetch("dashboard/components/users.html")
      .then((response) => response.text())
      .then((data) => {
        userSection.innerHTML = data;
      })
      .catch((error) => console.error("Error loading navbar:", error));
  }
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
