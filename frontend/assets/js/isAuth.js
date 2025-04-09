document.addEventListener("DOMContentLoaded", () => {
  console.log("isAuth.js loaded");

  const checkAuthLink = () => {
    const authLink = document.getElementById("register");
    const authLink2 = document.getElementById("login");
    if (authLink) {
      const token = localStorage.getItem("user");
      console.log("Token: ", token);
      if (token) {
        authLink.textContent = "Logout";

        authLink.onclick = () => {
          localStorage.removeItem("user");
          window.location.href = "shop.html";
        };
        authLink2.style.display = "none";
        
      } else {
        authLink.textContent = "Register";
        authLink.href = "register.html";
        authLink2.style.display = "block";
        authLink2.textContent = "Login";
        authLink2.href = "login.html";
      }

      clearInterval(intervalId); // Arrêter l'intervalle une fois l'élément trouvé
    }
  };

  // Vérifier toutes les 100ms si l'élément existe
  const intervalId = setInterval(checkAuthLink, 100);
});
