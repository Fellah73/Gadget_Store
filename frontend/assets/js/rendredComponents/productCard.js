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

export function createProductPurchaseCard(product) {
  // Créer l'élément principal de la carte
  const card = document.createElement("div");
  card.className =
    "flex-shrink-0 w-64 md:w-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-400 bg-opacity-80 backdrop-blur hover:scale-105 transition-all duration-300 hover:translate-y-2 group";

  // Structure HTML interne
  card.innerHTML = `
      <div class="image-container h-36 md:h-48  hover:scale-y-105">
        <img src="${product.image}" alt="${
    product.title
  }" class="w-full h-full object-cover" />
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2 text-white">${product.title}</h3>
        <p class="text-gray-200 font-semibold mb-4">${product.description}</p>
        <p class="text-gray-900 text-xl md:text-3xl font-bold tracking-wide mb-4">${
          product.price ? product.price : Math.floor(Math.random() * 1000)
        } €</p>
        <div class="flex items-center mb-2">
          <div class="text-yellow-400">${"⭐".repeat(product.rating)}</div>
        </div>
        <div class="flex space-x-2">
          <a href="${
            product.detailsUrl
          }" class="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex-1 text-center">
            Voir détails
          </a>
          <button class="bg-black hover:bg-gray-800 text-white px-2 py-2 rounded-md transition-transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div> 
      </div>
    `;

  return card;
}
