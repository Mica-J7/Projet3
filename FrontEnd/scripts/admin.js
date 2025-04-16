function creationDOMAdmin() {
    const iconeEdition = document.createElement("i");
    iconeEdition.classList.add("fa-regular", "fa-pen-to-square");

    const spanEdition = document.createElement("span");
    spanEdition.innerText = "Mode édition";
    
    const banniereEdition = document.createElement("button");
    banniereEdition.appendChild(iconeEdition);
    banniereEdition.appendChild(spanEdition);
    banniereEdition.classList.add("banniere-mode-edition");

    const header = document.querySelector("header");
    header.prepend(banniereEdition);

    const iconeModifier = document.createElement("i");
    iconeModifier.classList.add("fa-regular", "fa-pen-to-square");

    const btnModifier = document.createElement("button");
    btnModifier.innerText = "modifier";
    btnModifier.prepend(iconeModifier);
    btnModifier.classList.add("btn-modifier");

    const projetsAdmin = document.querySelector(".projets-admin");
    projetsAdmin.appendChild(btnModifier);

    return { banniereEdition, btnModifier };
}


export function affichageModeAdmin() {
    const { banniereEdition, btnModifier } = creationDOMAdmin();

    const loginLink = document.getElementById("login-link");
    const token = localStorage.getItem("token");
    const btnFiltres = document.querySelectorAll(".categories-filters button")

    if (token) {
        banniereEdition.style.display = "flex";

        // Utilisateur connecté changement de login en "Logout"
        loginLink.textContent = "Logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload(); // Recharge la page
        });
        
        //filtreTous.style.display = "none";
        btnFiltres.forEach(btn => btn.style.display = "none");
        if (btnModifier) btnModifier.style.display = "flex";        
    }
}


export function openModal() {
    const btnEdition = document.querySelector(".banniere-mode-edition");
    const modal = document.querySelector(".modal");

    btnEdition.addEventListener("click", () => {
        modal.style.display = "flex";
    });
}

