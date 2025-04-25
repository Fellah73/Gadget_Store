document.addEventListener("DOMContentLoaded", () => {
  console.log("addProduct.js loaded");

  setTimeout(() => {
    const imageUrlInput = document.getElementById("imageUrl-input");
    const previewImg = document.getElementById("preview");
    const placeholder = document.getElementById("placeholder");
    const productForm = document.getElementById("add-product-form");
    const name = document.getElementById("name-input");
    const priceInput = document.getElementById("price-input");
    const discountInput = document.getElementById("discount-input");
    const stockInput = document.getElementById("stock-input");
    const categorySelect = document.getElementById("category-select");
    const brand = document.getElementById("brand-input");
    const description = document.getElementById("description-input");
    const resetButton = document.getElementById("reset-form");
    const nameError = document.getElementById("name-error");
    const brandError = document.getElementById("brand-error");
    const descriptionError = document.getElementById("description-error");
    const fromError = document.getElementById("add-product-form-error");
    const popUp = document.getElementById("add-product-success-popup");
    name.addEventListener("input", () => {
      if (!isValidName(name.value)) {
        nameError.textContent =
          "begin with a letter and max length 40 characters";
      } else {
        nameError.textContent = "";
      }
    });

    brand.addEventListener("input", () => {
      if (!isValidBrand(brand.value)) {
        brandError.textContent =
          "First letter must be capital and max length 20 characters";
      } else {
        brandError.textContent = "";
      }
    });

    description.addEventListener("input", () => {
      if (!isValidDescription(description.value)) {
        descriptionError.textContent = "max length 100 characters";
      } else {
        descriptionError.textContent = "";
      }
    });

    const resetForm = () => {
      productForm.querySelectorAll("input").forEach((input) => {
        input.value = "";
      });
      description.value = "";
      previewImg.src = "";
      categorySelect.value = "";
      nameError.textContent = "";
      brandError.textContent = "";
      descriptionError.textContent = "";
      fromError.textContent = "";
    };

    resetButton.addEventListener("click", resetForm);

    if (imageUrlInput && previewImg && placeholder) {
      imageUrlInput.addEventListener("change", function () {
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
    const addProduct = async () => {
      try {
        const response = await fetch(
          "http://localhost/gadgetstoreapi/products/addProduct.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              price: priceInput.value,
              discount: discountInput.value,
              quantity: stockInput.value,
              category_id: categorySelect.value,
              brand: brand.value,
              description: description.value,
              image: imageUrlInput.value,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          console.log(data.message);
          popUp.style.display = "block";
          setTimeout(() => {
            popUp.style.display = "none";
          }, 3000);
        } else {
          console.log(data.message ?? data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    productForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      productForm.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
      let errors = {};

      if (!isValidName(name.value)) {
        errors.name = "name ";
      }

      if (!isValidBrand(brand.value)) {
        errors.brand = "brand ";
      }

      if (!isValidDescription(description.value)) {
        errors.description = "description ";
      }

      if (stockInput.value == 0) {
        errors.stock = "stock ";
      }

      if (priceInput.value == 0) {
        errors.price = "price ";
      }

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.keys(errors).map((key) => errors[key]);
        fromError.textContent = `check the ${errorMessages.join(", ")} fields.`;

        productForm.querySelectorAll("button").forEach((button) => {
          button.disabled = false;
        });
        return;
      }

      console.log("Form submitted");
      await addProduct();
      resetForm();
      productForm.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
      });
    });
  }, 1000);
});
const isValidName = (name) => /^[a-zA-Z][a-zA-Z0-9\s]{0,39}$/.test(name);

const isValidDescription = (description) => description.length <= 150;

const isValidBrand = (brand) => /^[A-Z][a-zA-Z0-9\s]{0,19}$/.test(brand);
