document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("user");

  if (token) {
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

  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("name-error");

  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");

  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("password-error");

  const confirmPasswordInput = document.getElementById("confirm-password");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );
  const SubmiterrorMessage = document.getElementById("register-error");

  const registerFunction = async (name, email, password) => {
    try {
      const response = await fetch(
        "http://localhost/gadgetstoreapi/auth/register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("Registration successful: ", data?.user);

        // update the local storage with the user data
        localStorage.setItem("user", `${data?.user.email}`);

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

  nameInput.addEventListener("input", () => {
    SubmiterrorMessage.textContent = "";
    if (nameInput.value.length == 0) {
      nameError.textContent = "";
      return;
    }
    const errorMessage = checkName(nameInput.value);
    if (errorMessage) {
      nameError.textContent = errorMessage;
    } else {
      nameError.textContent = "nice name!";
    }
  });

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

  confirmPasswordInput.addEventListener("input", () => {
    SubmiterrorMessage.textContent = "";
    if (confirmPasswordInput.value.length == 0) {
      confirmPasswordError.textContent = "";
      return;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordError.textContent = "Passwords do not match.";
    } else {
      confirmPasswordError.textContent = "Passwords match!";
    }
  });

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let errors = {};

    const nameErrorMessage = checkName(nameInput.value);
    if (nameErrorMessage) {
      errors.name = "name ";
    }

    const emailErrorMessage = checkEmail(emailInput.value);
    if (emailErrorMessage) {
      errors.email = "email ";
    }

    const passwordErrorMessage = validatePassword(passwordInput.value);
    if (passwordErrorMessage) {
      errors.password = "password ";
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      errors.confirmPassword = "confirm password ";
    }

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.keys(errors).map((key) => errors[key]);
      SubmiterrorMessage.textContent = `check the ${errorMessages.join(
        ", "
      )} fields.`;
      return;
    }

    // register through the API
    await registerFunction(
      nameInput.value,
      emailInput.value,
      passwordInput.value
    );
  });
});

const checkName = (name) => {
  if (name.length < 5) {
    return "Name must be at least 5 characters long.";
  }

  const regex = /^[a-zA-Z\-]+$/;
  if (!regex.test(name)) {
    return "Name can only contain letters.";
  }
};

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
