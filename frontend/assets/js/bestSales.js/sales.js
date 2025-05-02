import { createProductCard } from "../rendredComponents/productCard.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("sales.js loaded");

  setTimeout(async () => {
    const container = document.getElementById("products-container");
    
    let bestSellers = [];

    const fetchBestSellers = async () => {
      try {
        const response = await fetch(
          "http://localhost/gadgetstoreapi/products/getBestSales?limit=20.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          bestSellers = data.sales;
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };

    const displayBestSellers = async () => {
      container.innerHTML = "";
      await fetchBestSellers();
      bestSellers.forEach((product) => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
      });
    };

    await displayBestSellers();
  }, 500);
});
