document.addEventListener("DOMContentLoaded", () => {
  console.log("overview.js loaded");
  setTimeout(async () => {
    const user_id = localStorage.getItem("user");
    const totalOrders = document.getElementById("total-orders");
    const totalSales = document.getElementById("total-sales");
    const totalUsers = document.getElementById("total-users");
    const ordersContainer = document.getElementById("orders-container");
    const outOfStockItemsContainer = document.getElementById(
      "out-of-stock-items-container"
    );

    let orders = null;
    let outOfStockItems = null;

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost/gadgetstoreapi//order/getUserOrders.php?user_id=${user_id}&all=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          orders = data.orders
            .filter((order) => order.status)
            .sort(
              (orderOne, orderTwo) =>
                new Date(orderTwo.created_at) - new Date(orderOne.created_at)
            );
          totalOrders.textContent = orders.filter(
            (order) => order.status
          ).length;
          totalSales.textContent = orders
            .filter(
              (order) =>
                order.status == "delivered" || order.status == "shipped"
            )
            .reduce((total, order) => total + parseFloat(order.total), 0)
            .toFixed(2);
          const uniqueUserIds = new Set(orders.map((order) => order.user_id));
          totalUsers.textContent = uniqueUserIds.size;
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const displayOrders = async () => {
      await fetchOrders();
      if (!orders) return;
      ordersContainer.innerHTML = "";

      orders.slice(0, 6).forEach((order, key) => {
        const row = document.createElement("tr");
        row.classList.add(`${key % 2 === 1 ? "bg-blue-100" : "bg-blue-200"}`);
        row.classList.add("border-t");
        row.classList.add("border-gray-100");
        row.classList.add("text-blue-900");
        row.innerHTML = `
                  <td class="px-4 py-3 text-sm text-blue-900 font-semibold">#ORD-${order.created_at
                    .split(" ")[0]
                    .replaceAll("-", "")}-${order.id}</td>
                  <td class="px-4 py-3 font-bold">${order.full_name}</td>
                  <td class="px-4 py-3">
                    <span
                      class="px-4 py-2 ${getStatusColorOverview(
                        order.status
                      )} rounded-full text-xs tracking-wider font-semibold"
                      >${order.status ?? "cancelled"}</span
                    >
                  </td>
                  <td class="px-4 py-3 text-base -tracking-tight text-blue-800">${formatOrderDateOverview(
                    order.created_at
                  )}</td>
                  <td class="px-4 py-3">${
                    order.total
                  }  <span class="text-blue-700 text-xs">DZD</span> </td>
                `;
        ordersContainer.appendChild(row);
      });
    };

    const fetchOutOfStockItems = async () => {
      try {
        const response = await fetch(
          "http://localhost/gadgetstoreapi/products/getProducts?category_id=0.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          console.log("data.products");
          outOfStockItems = data.products
            .filter((item) => item.qte <= 5)
            .sort((a, b) => a.qte - b.qte);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const displayOutOfStockItems = async () => {
      await fetchOutOfStockItems();
      if (!outOfStockItems) return;
      outOfStockItemsContainer.innerHTML = "";
      outOfStockItems.forEach((item) => {
        const row = document.createElement("li");
        row.classList.add("flex");
        row.classList.add("items-center");
        row.classList.add(item.qte <= 2 ? "bg-blue-200" : "bg-blue-100");
        row.classList.add(item.qte <= 2 ? "text-blue-950" : "text-blue-900");
        row.innerHTML = `
          <img src="${item.image}" alt="Product Image" class="size-10 bg-gray-200 rounded-md"/>
          <div class="ml-3">
            <p class="text-sm font-medium">${item.name}</p>
            <p class="text-xs font-bold">${item.qte} units</p>
          </div>
        `;
        outOfStockItemsContainer.appendChild(row);
      });
    };

    await displayOrders();

    await displayOutOfStockItems();
  }, 1000);
});

const formatOrderDateOverview = (dateString) => {
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

const getStatusColorOverview = (status) => {
  switch (status) {
    case "shipped":
      return "bg-blue-100 text-blue-700 border border-blue-900";
    case "delivered":
      return "bg-green-50 text-green-700 border border-green-900";
    case "processing":
      return "bg-yellow-50 text-yellow-700 border border-yellow-900";
    default:
      return "bg-red-50 text-red-700 border border-red-900";
  }
};
