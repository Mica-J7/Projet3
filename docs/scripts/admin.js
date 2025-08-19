import { fetchData } from "./main.js";
import { displayWorks } from "./main.js";

function adminElementsCreation() {
    const editionIcon = document.createElement("i");
    editionIcon.classList.add("fa-regular", "fa-pen-to-square");

    const editionSpan = document.createElement("span");
    editionSpan.innerText = "Mode édition";
    
    const editionBanner = document.createElement("button");
    editionBanner.appendChild(editionIcon);
    editionBanner.appendChild(editionSpan);
    editionBanner.classList.add("edition-mode-banner");

    const header = document.querySelector("header");
    header.prepend(editionBanner);

    const modifyIcon = document.createElement("i");
    modifyIcon.classList.add("fa-regular", "fa-pen-to-square");

    const modifyBtn = document.createElement("button");
    modifyBtn.innerText = "modifier";
    modifyBtn.prepend(modifyIcon);
    modifyBtn.classList.add("modify-btn");

    const adminProject = document.querySelector(".admin-project");
    adminProject.appendChild(modifyBtn);

    return { editionBanner, modifyBtn };
}


export function displayAdminMode() {
    const { editionBanner, modifyBtn } = adminElementsCreation();

    const loginLink = document.getElementById("login-link");
    const token = localStorage.getItem("token");
    const filtersBtn = document.querySelectorAll(".categories-filters button")

    if (token) {
        editionBanner.style.display = "flex";

        loginLink.textContent = "Logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
        
        filtersBtn.forEach(btn => btn.style.display = "none");
        if (modifyBtn) modifyBtn.style.display = "flex";        
    }
}


export function displayModal() {
    const editionBtn = document.querySelector(".edition-mode-banner");
    const modifyBtn = document.querySelector(".modify-btn");
    const modal = document.querySelector(".modal");
    const modalWrapper = document.querySelector(".modal-wrapper");
    const firstModal = document.querySelector(".first-modal");
    const secondModal = document.querySelector(".second-modal")
    const closeBtn = document.querySelector("#close-btn");
    const addForm = document.querySelector("#add-form");

    editionBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        firstModal.style.display ="flex";
        secondModal.style.display = "none";
    });
    modifyBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        firstModal.style.display ="flex";
        secondModal.style.display = "none";
    });
    modal.addEventListener("click", (e) => {
        if (!modalWrapper.contains(e.target)) {
            modal.style.display = "none";
            addForm.reset();
            resetImagePreview();
        }
    });
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        addForm.reset();
        resetImagePreview();
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


export function displayModalGallery(worksList) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";

    worksList.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const trashIcon = document.createElement("button");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        trashIcon.setAttribute("data-id", work.id);

        figure.setAttribute("data-id", work.id);
        figure.appendChild(img);
        figure.appendChild(trashIcon);
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
            const errorMsg = document.getElementById("delete-error");
            errorMsg.innerText = "Une erreur est survenue, veuillez réessayer plus tard.";
        }
        });
    });
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

    const { worksList } = await fetchData();
    const gallery = document.querySelector(".gallery")
    gallery.innerText = "";
    displayWorks(worksList);
}
    

function resetImagePreview() {
    const icon = document.querySelector("#picture-icon");
    const label = document.querySelector("label[for='add-file']");
    const formatSpan = document.querySelector(".modal-add-photo span");
    const fileInput = document.querySelector("#add-file");

    icon.style.display = "block";
    label.style.display = "flex";
    formatSpan.style.display = "block";

    const imagePreview = document.querySelector(".image-preview");
    if (imagePreview) {
        imagePreview.remove();
    }

    const backBtn =  document.querySelector(".preview-back-btn");
    if (backBtn) {
        backBtn.remove();
    }

    fileInput.value = "";
    checkFormCompletion()
}


function imagePreview() {
    const fileInput = document.querySelector("#add-file");
    const modalPhotoZone = document.querySelector(".modal-add-photo");
    const icon = document.querySelector("#picture-icon");
    const label = document.querySelector("label[for='add-file']");
    const formatSpan = modalPhotoZone.querySelector("span");

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            
            icon.style.display = "none";
            label.style.display = "none";
            formatSpan.style.display = "none";

            const imagePreview = document.createElement("img");
            imagePreview.src = e.target.result;
            imagePreview.classList.add("image-preview")
            const backBtn = document.createElement("button");
            backBtn.innerText = "Retour";
            backBtn.classList.add("preview-back-btn");
            const divPreview = document.createElement("div");
            divPreview.classList.add("modal-preview");
            divPreview.appendChild(imagePreview);
            divPreview.appendChild(backBtn);
            modalPhotoZone.appendChild(divPreview);

            backBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                resetImagePreview();
            });
        };
        reader.readAsDataURL(file);
    });
}


async function displayModalCategories() {
    const addCategory = document.querySelector("#add-category");

    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categoriesList = await categoriesResponse.json();
    const emptyOption = document.createElement("option");    
    emptyOption.innerText = ""
    addCategory.appendChild(emptyOption);
    categoriesList.forEach(category => {
        const categoryOption = document.createElement("option");
        categoryOption.value = category.id;
        categoryOption.innerText = category.name;
        addCategory.appendChild(categoryOption);
    });
}


function checkFormCompletion() {
    const fileInput = document.querySelector("#add-file");
    const titleInput = document.querySelector("#add-title");
    const categorySelect = document.querySelector("#add-category");
    const validateBtn = document.querySelector("#validate-btn");
    if (
        titleInput.value.trim() !== "" &&
        categorySelect.value !== "" &&
        fileInput.files.length > 0
    ) {
        validateBtn.style.backgroundColor = "#1D6154";
        validateBtn.display = true;
    } else {
        validateBtn.style.backgroundColor = "#A7A7A7";
        validateBtn.display = false;
    }
    titleInput.addEventListener("input", checkFormCompletion);
    categorySelect.addEventListener("change", checkFormCompletion);
    fileInput.addEventListener("change", checkFormCompletion);
}


export async function addWorks() {
    const addForm = document.querySelector("#add-form");
    addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData(addForm);
        
        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Échec de l'envoi");
            };

            const { worksList } = await fetchData();
            const modalGallery = document.querySelector(".modal-gallery")
            const gallery = document.querySelector(".gallery")
            modalGallery.innerText = "";
            gallery.innerText = "";
            displayWorks(worksList);
            displayModalGallery(worksList);

            addForm.reset();
            resetImagePreview();
            
        } catch (error) {
            document.getElementById("error-message").innerText = error.message;
        }
    });
}

imagePreview();
displayModalCategories();
checkFormCompletion();