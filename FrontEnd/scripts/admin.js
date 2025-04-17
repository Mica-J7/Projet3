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

    const projetsAdmin = document.querySelector(".admin-project");
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

        loginLink.textContent = "Logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
        
        btnFiltres.forEach(btn => btn.style.display = "none");
        if (btnModifier) btnModifier.style.display = "flex";        
    }
}


export function displayModal() {
    const btnEdition = document.querySelector(".banniere-mode-edition");
    const btnModifier = document.querySelector(".btn-modifier");
    const modal = document.querySelector(".modal");
    const modalWrapper = document.querySelector(".modal-wrapper");
    const firstModal = document.querySelector(".first-modal");
    const secondModal = document.querySelector(".second-modal")
    const closeBtn = document.querySelector("#close-btn");

    btnEdition.addEventListener("click", () => {
        modal.style.display = "flex";
        firstModal.style.display ="flex";
        secondModal.style.display = "none";
    });
    btnModifier.addEventListener("click", () => {
        modal.style.display = "flex";
        firstModal.style.display ="flex";
        secondModal.style.display = "none";
    });
    modal.addEventListener("click", (e) => {
        if (!modalWrapper.contains(e.target)) {
            modal.style.display = "none";
        }
    });
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    })

    const addBtn = document.querySelector(".modal-switch-btn button");
    const backBtn = document.querySelector("#back-btn");

    addBtn.addEventListener("click", () => {
        firstModal.style.display = "none";
        secondModal.style.display = "flex";
    });

    backBtn.addEventListener("click", () => {
        firstModal.style.display ="flex";
        secondModal.style.display = "none";
    });
};


export function displayModalGallery(worksListe) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";

    worksListe.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const iconeTrash = document.createElement("button");
        iconeTrash.classList.add("fa-solid", "fa-trash-can");
        iconeTrash.setAttribute("data-id", work.id);

        figure.setAttribute("data-id", work.id);
        figure.appendChild(img);
        figure.appendChild(iconeTrash);
        modalGallery.appendChild(figure);
    });

    const deleteBtn = document.querySelectorAll(".modal-gallery figure button")
    deleteBtn.forEach (btn => {
        btn.addEventListener("click", async () => {
            const figure = btn.closest("figure");
            const workId = figure.getAttribute("data-id");

        try {
            await deleteWorkFromApi(workId);
            figure.remove();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
        });
    })
}


async function deleteWorkFromApi(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression du work');
    }

    // Si la suppression est réussie, on peut mettre à jour l'UI ou effectuer une autre action
    console.log(`Work avec l'id ${id} supprimé avec succès`);    
}
    
deleteWorkFromApi();