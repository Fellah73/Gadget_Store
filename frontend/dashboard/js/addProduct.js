document.addEventListener("DOMContentLoaded", () => {
  console.log("addProduct.js loaded");

  const initializeImagePreview = () => {
    const imageUrlInput = document.getElementById("imageUrl");
    const previewImg = document.getElementById("preview");
    const placeholder = document.getElementById("placeholder");

    if (imageUrlInput && previewImg && placeholder) {
      clearInterval(interval);

      // Add event listener for image preview functionality
      imageUrlInput.addEventListener("input", function () {
        const url = this.value.trim();
        if (url) {
          previewImg.src = url;
          previewImg.classList.remove("hidden");
          placeholder.classList.add("hidden");

          // Handle image load error
          previewImg.onerror = function () {
            previewImg.classList.add("hidden");
            placeholder.classList.remove("hidden");
            placeholder.textContent = "Invalid image URL";
          };
        } else {
          previewImg.classList.add("hidden");
          placeholder.classList.remove("hidden");
          placeholder.textContent = "Image preview will appear here";
        }
      });
    }
  };

  
  const interval = setInterval(initializeImagePreview, 100);
});
