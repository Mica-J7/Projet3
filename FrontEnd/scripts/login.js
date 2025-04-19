function loginUser() {
    const loginForm = document.querySelector("#login form");
    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");
    const errorMsg = document.getElementById("error-message");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailValue = inputEmail.value.trim();
        const passwordValue = inputPassword.value.trim();

        if (emailValue === "" || passwordValue === "") {
            errorMsg.innerText = "Veuillez remplir tous les champs";
            return;
        }

        const formData = {
            email: emailValue,
            password: passwordValue,
        };

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "index.html";
            } else {
                errorMsg.innerText = "Erreur dans l'identifiant ou le mot de passe";
            }
        } catch (error) {
            errorMsg.innerText = "Une erreur est survenue, réessayez plus tard";
        }
    });
}


loginUser();