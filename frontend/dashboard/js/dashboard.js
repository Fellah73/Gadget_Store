document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("user");

  if (token == "null") {
    window.location.href = "index.html";
  }
 console.log("dashboard.js loaded");
 
 
 const totlalDashboard = document.getElementById("total-dashboard");

 fetch("dashboard/components/globalDashboard.html")
   .then((response) => response.text())
   .then((data) => {
     totlalDashboard.innerHTML = data;
   })
   .catch((error) => console.error("Error loading navbar:", error));

const totalProduct = document.getElementById("total-products");

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
