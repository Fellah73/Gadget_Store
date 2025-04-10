document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("user");

  if (token !=='null') {
    window.location.href = "shop.html";
  }

  fetch("components/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;

      // Re-attacher les événements après le chargement du navbar
      const mobileMenuButton = document.querySelector(
        '[aria-controls="mobile-menu"]'
      );
      const mobileMenu = document.getElementById("mobile-menu");

      if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }

      // Mettre à jour l'état du menu actif
      const currentNavbarLink = document.getElementById("shop");
      if (currentNavbarLink) {
        currentNavbarLink.style.color = "rgb(59, 130, 246)";
        currentNavbarLink.style.borderBottomColor = "rgb(147 197 253)";
      }

      // Update the mobile nav link
      const mobileNavbarLink = document.getElementById("mobile-shop-link");
      if (mobileNavbarLink) {
        mobileNavbarLink.style.color = "rgb(59, 130, 246)";
        mobileNavbarLink.style.backgroundColor = "rgb(249 250 251)";
      }
    })

    .catch((error) => console.error("Error loading navbar:", error));

  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("password-error");

  const SubmiterrorMessage = document.getElementById("register-error");

  const registerFunction = async (email, password) => {
    try {
      const response = await fetch(
        `http://localhost/gadgetstoreapi/auth/login.php?email=${email}&password=${password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("Login successful: ", data?.user);

        // update the local storage with the user data
        localStorage.setItem("user", `${data?.user.id}`);
        const expirationInMinutes = 10; // durée de session
        const expirationTime =
          new Date().getTime() + expirationInMinutes * 60 * 1000;

        // update the local storage with the user data
        localStorage.setItem("session_expiration", expirationTime.toString());
        window.location.href = "shop.html";
      } else {
        SubmiterrorMessage.textContent = data.message;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      SubmiterrorMessage.textContent = "An error occurred. Please try again.";
    }
  };

  SubmiterrorMessage.textContent = "";

  emailInput.addEventListener("input", () => {
    SubmiterrorMessage.textContent = "";
    if (emailInput.value.length == 0) {
      emailError.textContent = "";
      return;
    }
    const errorMessage = checkEmail(emailInput.value);
    if (errorMessage) {
      emailError.textContent = errorMessage;
    } else {
      emailError.textContent = "valid email!";
    }
  });

  passwordInput.addEventListener("input", () => {
    SubmiterrorMessage.textContent = "";
    if (passwordInput.value.length == 0) {
      passwordError.textContent = "";
      return;
    }
    const errorMessage = validatePassword(passwordInput.value);
    if (errorMessage) {
      passwordError.textContent = errorMessage;
    } else {
      passwordError.textContent = "strong password!";
    }
  });

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let errors = {};

    const emailErrorMessage = checkEmail(emailInput.value);
    if (emailErrorMessage) {
      errors.email = "email ";
    }

    const passwordErrorMessage = validatePassword(passwordInput.value);
    if (passwordErrorMessage) {
      errors.password = "password ";
    }

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.keys(errors).map((key) => errors[key]);
      SubmiterrorMessage.textContent = `check the ${errorMessages.join(
        ", "
      )} fields.`;
      return;
    }

    // register through the API
    await registerFunction(emailInput.value, passwordInput.value);
  });
});

const checkEmail = (email) => {
  if (!email) {
    return "Email is required.";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Invalid email format.";
  }
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!complexityRegex.test(password)) {
    return "Password must include uppercase, lowercase, and number.";
  }
};
