document.addEventListener("DOMContentLoaded", () => {
  console.log("users.js loaded");

  setTimeout(async () => {
    const user_id = localStorage.getItem("user");
    const allUsers = document.getElementById("all-users-span");
    const adminUsers = document.getElementById("total-admins");
    const usersContainer = document.getElementById("users-container");
    const selectRole = document.getElementById("users-role-filter");
    const isFounder = document.getElementById("is-founder");

    selectRole.addEventListener("change", async () => {
      filtredUsers = users.filter(
        (user) =>
          user.role ===
          (selectRole.value == "All Roles"
            ? user.role
            : selectRole.value == "Admin"
            ? "super_admin" || "admin"
            : selectRole.value.toLowerCase().replace(" ", "_"))
      );
      await displayUsers();
    });

    let users = [];
    let filtredUsers = [];
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost/gadgetstoreapi/user/getUsers.php?user_id=${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          if (data.founder) {
            isFounder.style.display = "block";
            users = data.users.filter(
              (user) => user.role != "user" && user.id != user_id
            );
          } else {
            users = data.users.filter(
              (user) => user.role != "super_admin" && user.role != "user"
            );
          }

          filtredUsers = users;
          allUsers.textContent = data.length;
          adminUsers.textContent = data.users.filter(
            (user) => user.role === "super_admin"
          ).length;
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const updateRole = async (promoted_user_id, action) => {
      try {
        const response = await fetch(
          `http://localhost/gadgetstoreapi/user/updateRole.php`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user_id,
              promoted_user_id: promoted_user_id,
              action: action,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          console.log(data.message);
          await fetchUsers();
          await displayUsers();
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const displayUsers = async () => {
      if (users.length === 0) {
        await fetchUsers();
      }
      usersContainer.innerHTML = "";
      if (users.length === 0) return;
      filtredUsers.forEach((user) => {
        const userCard = document.createElement("tr");
        userCard.classList.add("border-b", "border-gray-200");
        userCard.innerHTML = `
            <td class="py-3 px-4">
         <div class="flex items-center">
           <span class="font-medium text-gray-800">${user.name}</span>
         </div>
            </td>
            <td class="py-3 px-4 text-gray-600">${user.email}</td>
            <td class="py-3 px-4">
         <span
           class="inline-flex items-center px-4 py-2 rounded-full text-base tracking-wide font-medium ${
             user.role === "admin"
               ? "bg-purple-100 text-purple-800 border border-purple-800"
               : user.role === "stock_manager"
               ? "bg-emerald-200 text-emerald-800 border border-emerald-800"
               : "bg-amber-100 text-amber-800 border border-amber-800"
           }"
         >
           ${user.role.toLowerCase().replace("_", " ")}
         </span>
            </td>
            <td class="py-3 px-4 text-gray-600">${new Date(
              user.createdAt
            ).toLocaleDateString()}</td>
            <td class="py-3 px-4">
         <div class="flex gap-2 font-bold tracking-wide">
           <button id="promote"
             class="${
               user.role === "super_admin" && "hidden"
             } bg-blue-700 hover:bg-blue-900 hover:transition-colors hover:duration-300 text-white px-4 py-2 rounded-lg text-base"
           >
             Promote
           </button>
           <button id="demote"
             class="bg-amber-600 hover:bg-amber-700 hover:transition-colors hover:duration-300 text-white px-4 py-2 rounded-lg text-base hover-transition"
           >
             Demote
           </button>
         </div>
            </td>`;
        usersContainer.appendChild(userCard);

        const promoteButton = userCard.querySelector("#promote");
        const demoteButton = userCard.querySelector("#demote");
        promoteButton.addEventListener("click", async () => {
          await updateRole(user.id, "promote");
        });

        demoteButton.addEventListener("click", async () => {
          await updateRole(user.id, "demote");
        });
      });
    };

    await displayUsers();
  }, 500);
});
