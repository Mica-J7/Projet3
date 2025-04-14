function loginUtilisateur() {
    const loginForm = document.querySelector("#login form");
    const inputEmail = document.getElementById("email");
    const inputMdp = document.getElementById("mot-de-passe");
    const errorMsg = document.getElementById("error-message");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailValue = inputEmail.value.trim();
        const mdpValue = inputMdp.value.trim();

        if (emailValue === "" || mdpValue === "") {
            errorMsg.innerText = "Veuillez remplir tous les champs";
            return;
        }

        const chargeUtile = {
            email: emailValue,
            password: mdpValue,
        };

        try {
            const reponse = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chargeUtile),
            });

            const data = await reponse.json();

            if (reponse.ok && data.token) {
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

loginUtilisateur();

