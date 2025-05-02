export function createProductCard(data) {
  const generateDiscountBadge = (discount) => {
    if (!discount || discount === 0) return "";

    let badgeColor = "bg-amber-500";
    if (discount >= 30 && discount < 50) badgeColor = "bg-blue-950";
    if (discount >= 50) badgeColor = "bg-gray-600";

    return `
      <div class="absolute flex items-center justify-center top-2 left-2 ${badgeColor} text-white text-center text-lg tracking-wide font-bold size-16 rounded-full shadow-lg z-10">
        -${discount}%
      </div>
    `;
  };

  const generateCategoryName = (categoryId) => {
    switch (categoryId) {
      case 1:
        return "Smartphones";
      case 2:
        return "Gaming Consoles";
      case 3:
        return "Headsets";
      default:
        return "Smartwatches";
    }
  };

  // Créer un élément div pour la carte produit
  const card = document.createElement("div");
  card.className =
    "realative flex-shrink-0 w-64 md:w-[310px]  h-[470px] bg-gradient-to-r from-blue-950/80  to-blue-900/50 rounded-2xl transition-transform duration-300 hover:-translate-y-4";
  card.style.animationDelay = "0.1s";

  // Remplir la carte avec le contenu HTML
  card.innerHTML = `
    <div class="relative overflow-hidden  rounded-t-2xl h-1/2 w-full group">
      ${data.discount ? `-${generateDiscountBadge(data.discount)}%` : ""}

      <!-- Product Image -->
      <div class="h-full bg-neutral-300 flex px-5 scale-125">
        <img src="${data.image}" alt="${
    data.name
  }" class="w-full h-[200px]  object-contain" />
      </div>
    </div>

    <div class="p-5 mt-2">
      <!-- Category -->
      <div class="flex items-center justify-between pr-4 w-full"> 
        <p class="text-lg text-gray-200 tracking-wider">${generateCategoryName(
          data.category_id
        )}</p>
        <span class="text-xl font-bold text-gray-200 tracking-wider">
          ${data.total_sold} <span class="text-2xl">🏷️</span>
        </span>
      </div>

      <!-- Product Name -->
      <h3 class="text-lg font-semibold truncate text-gray-100 mb-2 group-hover:text-primary-blue transition-colors">
        ${data.name}
      </h3>

      <!-- Rating -->
      <div class="flex items-center mb-2">
        <div class="flex text-yellow-400">
          ${generateStars(Math.floor(Math.random() * 5) + 1)}
        </div>
      </div>

      <!-- Price -->
      <div class="flex items-center space-x-2 mb-3">
        <span class="text-lg font-bold text-white">${
          data.price_discounted
        } DZD</span>
        ${
          data.price
            ? `<span class="text-base text-gray-400 line-through">${data.price} DZD</span>`
            : ""
        }
      </div>

      <!-- View Product Button -->
      <a href="product.html?id=${
        data.id
      }" class="block w-full py-2 text-center tracking-wide border-2 border-blue-950 text-blue-950 bg-gray-200 font-medium rounded-lg hover:bg-primary-blue hover:text-white transition-colors duration-300 relative overflow-hidden group">
        <span class="relative z-10">View Product</span>
        <span class="absolute inset-0 w-0 bg-gradient-to-r from-blue-950 to-blue-800/50 group-hover:w-full transition-all duration-300 -z-0"></span>
      </a>
    </div>
  `;

  return card;
}

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
    "from-blue-900/50 to-blue-600/50",
    "from-blue-500/90 to-blue-400/40",
    "from-blue-800/50 via-gray-900/50 to-gray-600/50",
    "from-blue-600/50 to-blue-400/50",
  ];

  const generateDiscountBadge = (discount) => {
    if (!discount || discount === 0) return "";

    let badgeColor = "bg-amber-500";
    if (discount >= 30 && discount < 50) badgeColor = "bg-blue-950";
    if (discount >= 50) badgeColor = "bg-gray-600";

    return `
      <div class="absolute flex items-center justify-center top-2 left-2 ${badgeColor} text-white text-center text-lg tracking-wide font-bold size-16 rounded-full shadow-lg z-10">
        -${discount}%
      </div>
    `;
  };

  const bgColor = colors[categories.indexOf(category)] || colors[0];
  const discount = Math.floor(Math.random() * 51);

  const card = document.createElement("div");
  card.className = `
    relative flex-shrink-0 w-[300px] h-[450px] md:w-[350px] 
    bg-gradient-to-br ${bgColor} 
    text-white rounded-xl 
    shadow-2xl overflow-hidden 
    transform transition-all duration-300 
    hover:scale-105 hover:shadow-xl
  `;

  card.innerHTML = `
    <div class="relative h-full flex flex-col">
      ${generateDiscountBadge(product.discount)}
      
      <div class="h-[55%] w-full overflow-hidden relative">
        <img 
          src="${product.image || "default-image.jpg"}" 
          alt="${product.name}" 
          class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div class="p-4 gap-y-2 flex flex-col">
        
          <h3 class="text-xl font-bold mb-2 truncate">${product.name}</h3>
          
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center space-x-2">
              <span class="text-2xl font-bold">
                ${product.price_discounted} DZD
              </span>
              ${
                discount || true
                  ? `<span class="text-sm line-through text-gray-300">
                      ${product.price} DZD
                    </span>`
                  : ""
              }
            </div>
            <span class="text-sm bg-white/20 px-2 py-1 text-center rounded-full">
              ${category || "Product"}
            </span>
          </div>
        
        
        <div class="mt-8 flex space-x-2">
          <button id="buy" class="
              w-1/2 bg-white text-black 
              py-2 rounded-sm font-semibold 
              hover:bg-transparent hover:text-white hover:border-white hover:border-2 hover:rounded-lg
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
          <a href="product.html?id=${product.id}" class="
              w-1/2 bg-transparent border-2 border-white text-white
              py-2 rounded-sm font-semibold 
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

export const recommendationCard = (product) => {
  const card = document.createElement("div");
  card.className =
    "hover:scale-95 hover:shadow-2xl hover:shadow-blue-900 flex-shrink-0 h-96 md:h-80 w-64 snap-start bg-blue-50 shadow-md overflow-hidden border border-gray-500 rounded-[30px] transition-transform duration-300";

  const getDiscountBgColor = (discount) => {
    if (!discount || discount === 0) return "";

    let badgeColor = "bg-amber-500";
    if (discount >= 30 && discount < 50) badgeColor = "bg-blue-950";
    if (discount >= 50) badgeColor = "bg-gray-600";

    return badgeColor;
  };

  card.innerHTML = `
     <div class="product-card p-4 w-full relative">
       <!-- Discount Badge -->
       <div class="absolute top-2 left-2">
         <div class="size-12 rounded-full flex items-center justify-center text-white font-bold ${getDiscountBgColor(
           product.discount
         )}">${product.discount}%</div>
       </div>
       <!-- Action Icons -->
       <div class="absolute top-1 right-2 flex flex-col space-y-4">
         <a href="product.html?id=${
           product.id
         }" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
           <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
         </a>
       </div>
       
       <div class="flex justify-center items-center py-2">
         <img src="${product.image}" alt="${
    product.name
  }" class="h-48 object-contain" />
       </div>
       
       <div class="mt-8 md:mt-1 w-full flex flex-col items-start justify-center p-2">
         <h3 class="text-2xl md:text-xl truncate font-bold text-blue-900">${
           product.name
         }</h3>
       
         <div class="mt-2 flex items-center gap-x-6">
           <span class="text-gray-700 line-through mr-2 text-xl md:text-base">${
             product.price
           }</span>
           <span class="text-2xl md:text-xl font-bold">${
             product.price_discounted
           }<span class="text-base ml-1">DZD</span></span>
         </div>
       </div>
     </div>
   `;

  return card;
};
