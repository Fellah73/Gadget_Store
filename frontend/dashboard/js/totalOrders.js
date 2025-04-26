document.addEventListener("DOMContentLoaded", () => {
  console.log("totalOrders.js loaded");

  setTimeout(async () => {
    const totalOrdersContainter = document.getElementById("orders-table");
    const statusFilter = document.getElementById("status-filter");
    const ordersCount = document.getElementById("orders-count");

    let totalOrders = null;
    let filtredOrders = [];
    const userId = localStorage.getItem("user");
    const fetchToatalOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost/gadgetstoreapi/order/getUserOrders.php?user_id=${userId}&all=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          totalOrders = data.orders;
          filtredOrders = totalOrders.filter(
            (order) => order.status == statusFilter.value
          );
          ordersCount.textContent = totalOrders.filter(
            (order) => order.status == "processing"
          ).length;
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const approveOrder = async (orderId) => {
      try {
        const response = await fetch(
          `http://localhost/gadgetstoreapi/order/updateOrderStatus.php`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: orderId,
              user_id: userId,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          console.log(data.message);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const displayOrders = async () => {
      if (!totalOrders) {
        await fetchToatalOrders();
      }
      totalOrdersContainter.innerHTML = "";
      filtredOrders.forEach((order, index) => {
        const row = document.createElement("tr");
        row.classList.add(`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`);

        row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-blue-800 text-left ">
              ORD-${order.created_at.split(" ")[0].replaceAll("-", "")}-${order.id}	
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-left text-black text-base tracking-wide truncate">${
              order.full_name
            }</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
             class="${getStatusColor(
               order.status
             )} px-5 py-2 text-base rounded-full font-medium tracking-wide"
            >${order.status ?? "cancelled"}</span
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-start">
              <span class="text-gray-500 px-4 py-2 text-base font-semibold">
            ${formatOrderDate(order.created_at.split(" ")[0])} 
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-start">
              <span class="text-gray-800 px-4 py-2 text-base md:text-lg font-semibold">
            ${order.total.toLocaleString()} DZD
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button id="approve-order" class="text-blue-600 hover:text-blue-900 text-2xl pointer-events-none ${
                order.status == "processing" && "pointer-events-auto"
              }">
            ${order.status == "processing" ? "✅" : "🚫"} 
              </button>
            </td>
        `;
        totalOrdersContainter.appendChild(row);

        const approveButton = row.querySelector("#approve-order");

        approveButton.addEventListener("click", async () => {
          await approveOrder(order.id);
          totalOrders = null;
          await displayOrders();
        });
      });
    };

    statusFilter.addEventListener("change", async () => {
      if (statusFilter.value !== "cancelled") {
        filtredOrders = totalOrders.filter(
          (order) => order.status == statusFilter.value
        );
      } else {
        filtredOrders = totalOrders.filter((order) => !order.status);
      }

      await displayOrders();
    });

    await displayOrders();
  }, 1000);
});

const getStatusColor = (status) => {
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

const formatOrderDate = (dateString) => {
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
  