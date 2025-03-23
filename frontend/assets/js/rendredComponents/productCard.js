export function createProductCard(data) {
  // Créer un élément div pour la carte produit
  const card = document.createElement("div");
  card.className =
    "flex-shrink-0 w-64 md:w-72 bg-neutral-100 rounded-2xl shadow-md hover:shadow-gray-700 hover:shadow-xl transition-all duration-300 group animate-fade-in";
  card.style.animationDelay = "0.1s";

  // Remplir la carte avec le contenu HTML
  card.innerHTML = `
        <div class="relative overflow-hidden rounded-xl">
            <!-- Badges -->
            <div class="absolute top-3 left-3 z-10 flex flex-col space-y-2">
                <span class="px-3 py-4 bg-zinc-600 text-white text-lg font-semibold rounded-full">
                    ${data.discount ? `-${data.discount}%` : ""}
                </span>
            </div>

            <!-- Product Image -->
            <div class="h-full bg-neutral-300 flex px-5 transition-transform duration-500 group-hover:scale-125">
                <img src="${data.image}" alt="${
    data.name
  }" class="h-full object-contain group-hover:animate-float" />
            </div>

            <!-- Add to cart overlay -->
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button class="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black hover:text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2 11h14l2-7H5"></path>
                    </svg>
                    <span>Ajouter au panier</span>
                </button>
            </div>
        </div>

        <div class="p-5">
            <!-- Category -->
            <p class="text-base text-gray-500 tracking-wider mb-1">${
              data.category
            }</p>

            <!-- Product Name -->
            <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-blue transition-colors">
                ${data.name}
            </h3>

            <!-- Rating -->
            <div class="flex items-center mb-2">
                <div class="flex text-yellow-400">
                    ${generateStars(data.rating)}
                </div>
                <span class="text-sm text-gray-500 ml-2">(${
                  data.reviews
                })</span>
            </div>

            <!-- Price -->
            <div class="flex items-center space-x-2 mb-3">
                <span class="text-lg font-bold text-primary-blue">${genreateNewProductCard(
                  data
                )}€</span>
                ${
                  data.oldPrice
                    ? `<span class="text-sm text-gray-500 line-through">${data.oldPrice}€</span>`
                    : ""
                }
            </div>

            <!-- View Product Button -->
            <a href="#" class="block w-full py-2 text-center border-2 border-primary-blue text-primary-blue font-medium rounded-lg hover:bg-primary-blue hover:text-white transition-colors duration-300 relative overflow-hidden group">
                <span class="relative z-10">Voir le produit</span>
                <span class="absolute inset-0 w-0 bg-gradient-to-r from-primary-blue to-secondary-blue group-hover:w-full transition-all duration-300 -z-0"></span>
            </a>
        </div>
    `;

  return card;
}

// Fonction pour générer les étoiles en fonction du rating
function generateStars(rating) {
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      // Étoile pleine
      stars += `<svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.065 5.81 1.435 8.269L12 18.896l-7.37 4.489 1.435-8.269-6.065-5.81 8.332-1.151z"/>
                      </svg>`;
    } else if (i - rating < 1) {
      // Étoile à moitié remplie
      stars += `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.065 5.81 1.435 8.269L12 18.896V.587z"/>
                      </svg>`;
    } else {
      // Étoile vide
      stars += `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5  text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>`;
    }
  }
  return stars;
}

function genreateNewProductCard(data) {
  return (data.oldPrice - data.oldPrice * (data.discount / 100)).toFixed(2);
}

export function createProductPurchaseCard(product,category) {

  const categories = [
    "phones",
    "headsets",
    "consoles",
    "smartwatches",]

  const colors = [
    "from-gray-700 to-gray-400",
    "from-neutral-100 to-neutral-600",
    "from-cyan-600 to-cyan-100",
    "from-white to-gray-400",
  ];

  const bgColor = colors[categories.indexOf(category)];
  console.log(bgColor);


  // Déterminer la couleur du badge en fonction du discount
  let badgeColor;
  if (product.discount < 30) {
    badgeColor = "bg-amber-600";
  } else if (product.discount < 50) {
    badgeColor = "bg-green-400";
  } else if (product.discount == 0 || product.discount == null) {
    badgeColor = "hidden";
  } else {
    badgeColor = "bg-violet-800";
  }

  // Créer l'élément principal de la carte
  const card = document.createElement("div");
  card.className =
    `relative flex-shrink-0 w-64 md:w-80 h-full shadow-lg shadow-gray-600/50 overflow-hidden bg-gradient-to-br ${bgColor} border-2 border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fadeIn`;

  // Structure HTML interne avec animations et logo promotionnel
  card.innerHTML = `
      <!-- Promotional Badge avec couleur dynamique -->
      <div class="absolute top-2 left-2 ${badgeColor} z-20 text-white text-lg font-bold px-3 py-1 rounded-full shadow-md transform rotate-6 animate-pulse-rotated visible-always"">
        -${product.discount ? product.discount : ""} off
      </div>

      <div class="h-36 md:h-48 overflow-hidden hover:scale-105 transition-transform duration-500 ease-out border-b-2 border-gray-800">
        <img src="${product.image || "default-image.jpg"}" alt="${
    product.title || "Product"
  }" class="h-full w-full object-cover  duration-300" />
      </div>

      <div class="px-6 py-4 flex flex-col items-center text-center space-y-2">
        <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-2 animate-slideIn">
          ${product.title || "Gaming Pro X1"}
        </h3>
        <p class="text-base md:text-lg text-gray-600 font-medium mb-4 animate-fadeInDelay">
          ${product.description?.split(",")[0] || "Puissant processeur"}
        </p>
        <p class="text-gray-900 text-base font-bold tracking-wide bg-gray-300 px-2 py-1 rounded-lg animate-popIn">
          From ${
            product.price
              ? (product.price / 12).toFixed(2)
              : (Math.floor(Math.random() * 1000) / 12).toFixed(2)
          } €/month or 
          ${product.price ? product.price : Math.floor(Math.random() * 1000)} €
        </p>
      </div>
      <div class="flex flex-row space-x-2 px-2 md:px-8 mb-2 ">
          <a href="${
            product.detailsUrl
          }" class="bg-gradient-to-br from-blue-900 to-blue-600 text-white rounded-3xl flex-1 text-center items-center justify-center px-2 py-2 hover:scale-105">
            See More
          </a>
          <button class="bg-black hover:bg-gray-800 rounded-3xl text-white flex flex-row gap-x-2 justify-center w-[50%] text-center items-center px-2 py-2 transition-transform hover:scale-105">
          <span class="text-base font-semibold">
          Add to cart<span class="text-lg font-bold"> > </span>
          </span>   
          </button>
        </div>
    `;

  // Add animation keyframes via CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInLeft {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes popIn {
      0% { transform: scale(0.9); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes fadeInDelay {
      0% { opacity: 0; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes pulse-rotated {
      0%, 100% { transform: rotate(6deg) scale(1); }
      50% { transform: rotate(6deg) scale(1.05); }
    }
    .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
    .animate-slideIn { animation: slideIn 0.6s ease-out; }
    .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
    .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
    .animate-popIn { animation: popIn 0.6s ease-out; }
    .animate-fadeInDelay { animation: fadeInDelay 0.8s ease-out; }
    .animate-pulse-rotated { animation: pulse-rotated 2s infinite; }
    
  `;
  document.head.appendChild(style);

  return card;
}
