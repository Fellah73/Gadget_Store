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

export function createProductPurchaseCard(product, category) {
  // Configuration des catégories et couleurs de fond
  const categories = ["phones", "headsets", "consoles", "smartwatches"];
  const colors = [
    "from-gray-700 to-gray-900",
    "from-neutral-500 to-neutral-700",
    "from-blue-500 to-blue-700",
    "from-gray-400 to-gray-600",
  ];

  // Générer un badge de réduction dynamique
  const generateDiscountBadge = (discount) => {
    if (!discount || discount === 0) return "";

    let badgeColor = "bg-amber-600";
    if (discount >= 30 && discount < 50) badgeColor = "bg-green-500";
    if (discount >= 50) badgeColor = "bg-violet-800";

    return `
      <div class="absolute top-2 left-2 ${badgeColor} text-white text-sm font-bold px-2 py-1 rounded-full shadow-lg z-10">
        -${discount}%
      </div>
    `;
  };

  // Calculer le prix après réduction
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price * (1 - discount / 100)).toFixed(2);
  };

  // Générer des étoiles de notation
  const generateRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    let starsHTML = "";

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML += `<span class="text-yellow-500">★</span>`;
      } else if (i === fullStars && halfStar) {
        starsHTML += `<span class="text-yellow-500">½</span>`;
      } else {
        starsHTML += `<span class="text-gray-300">★</span>`;
      }
    }
    return starsHTML;
  };

  // Sélectionner le fond de couleur en fonction de la catégorie
  const bgColor = colors[categories.indexOf(category)] || colors[0];

  const rating = Math.floor(Math.random() * 5) + 1;
  const reviews = Math.floor(Math.random() * 100) + 1;
  const discount = Math.floor(Math.random() * 51);
  // Créer l'élément de la carte
  const card = document.createElement("div");
  card.className = `
    relative flex-shrink-0 w-64 md:w-[320px] h-[475px] 
    bg-gradient-to-br ${bgColor} 
    text-white rounded-2xl 
    shadow-2xl overflow-hidden 
    transform transition-all duration-300 
    hover:scale-105 hover:shadow-xl
  `;

  // Contenu HTML de la carte
  card.innerHTML = `
    <div class="relative h-full flex flex-col">
      ${generateDiscountBadge(discount)}
      
      <div class="h-[55%] w-full overflow-hidden relative">
        <img 
          src="${product.image || "default-image.jpg"}" 
          alt="${product.name}" 
          class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div class="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold mb-2 truncate">${product.name}</h3>
          
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              ${generateRatingStars(rating || 0)}
              <span class="text-sm ml-2 text-gray-200">
                (${reviews || 0} avis)
              </span>
            </div>
            
            <span class="text-sm bg-white/20 px-2 py-1 text-center rounded-full">
              ${category || "Product"}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-2xl font-bold">
                ${product.price} DZD
              </span>
              ${
                discount || true
                  ? `<span class="text-sm line-through text-gray-300">
                   ${product.price} DZD
                 </span>`
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
    <button class="
        w-1/2 bg-white text-black 
        py-2 rounded-lg font-semibold 
        hover:bg-opacity-90 
        transition-colors duration-300 
        flex items-center justify-center
        ">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        Add to Cart
    </button>
    <a href="#" class="
        w-1/2 bg-transparent border-2 border-white text-white
        py-2 rounded-lg font-semibold 
        hover:bg-white hover:text-black
        transition-colors duration-300 
        flex items-center justify-center
        ">
        View Product
    </a>
</div>
</div>
</div>
        
         
  `;

  return card;
}
