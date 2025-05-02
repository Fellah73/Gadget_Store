export const products = [
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/iphone.webp",
    oldPrice: 1249,
    discount: 20,
    rating: 4,
    reviews: 129,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/headphones.webp",
    oldPrice: 1249,
    discount: 71,
    rating: 4,
    reviews: 149,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/smartwatch.webp",
    oldPrice: 1249,
    discount: 45,
    rating: 3,
    reviews: 49,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/gamingConsole.webp",
    oldPrice: 1249,
    discount: 10,
    rating: 5,
    reviews: 147,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/iphone.webp",
    oldPrice: 1249,
    discount: 20,
    rating: 4,
    reviews: 129,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/headphones.webp",
    oldPrice: 1249,
    discount: 71,
    rating: 4,
    reviews: 149,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/smartwatch.webp",
    oldPrice: 1249,
    discount: 45,
    rating: 2,
    reviews: 49,
  },
  {
    name: "iPhone 14 Pro Max",
    category: "Smartphones",
    image: "assets/images/heroSection/gamingConsole.webp",
    oldPrice: 1249,
    discount: 10,
    rating: 5,
    reviews: 147,
  }
];

function getRandomImageUrl() {
  const imageUrls = [
    "assets/images/heroSection/iphone.webp",
    "assets/images/heroSection/headphones.webp",
    "assets/images/heroSection/smartwatch.webp",
    "assets/images/heroSection/gamingConsole.webp",
    "assets/images/heroSection/iphoneWhite.jpg",
    "https://smartshop.re/19822-superlarge_default/apple-iphone-16e.jpg",
    
  ];
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

export const productData = [
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    discount: 50,
    detailsUrl: "product.html?id=1",
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    detailsUrl: "product.html?id=1",
    price : 100,
    discount : 40
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    detailsUrl: "product.html?id=1",
    price : 100,
    discount : 30
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    detailsUrl: "product.html?id=1",
    price : 100,
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    detailsUrl: "product.html?id=1",
    price : 100,
    discount : 20
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    detailsUrl: "product.html?id=1",
    price : 100,
    discount : 20
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    discount: 20,
    detailsUrl: "product.html?id=1",
    price : 100,
    discount : 70
  },
  {
    id: 1,
    image: getRandomImageUrl(),
    title: "Gaming Pro X1",
    description:
      "Puissant processeur, carte graphique RTX et écran haute fréquence pour une expérience gaming immersive.",
    rating: 5,
    reviews: 128,
    detailsUrl: "product.html?id=1",
    price : 100,
    discount : 20
  },
];
