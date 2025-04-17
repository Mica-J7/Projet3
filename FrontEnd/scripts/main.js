import { affichageModeAdmin } from "./admin.js";
import { displayModal } from "./admin.js";
import { displayModalGallery } from "./admin.js";

export async function fetchData() {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const worksListe = await worksResponse.json();

    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const filtresListe = await categoriesResponse.json();

    return {worksListe, filtresListe};
}


function affichageWorks(worksListe) {
    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = "";
    worksListe.forEach(work => {
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;
        
        const workTitle = document.createElement("h3");
        workTitle.innerText = work.title;

        const figure = document.createElement("figure");
        figure.appendChild(workImage);
        figure.appendChild(workTitle);
        figure.setAttribute("data-category", work.category.id);
        
        workGallery.appendChild(figure);
    });
}


async function affichageFiltres(worksListe, filtresListe) {
    const categoriesFiltres = document.querySelector(".categories-filters");

    const filtreTous = document.createElement("button");
    filtreTous.innerText = "Tous";
    filtreTous.addEventListener("click", () => {
        const allBtn = document.querySelectorAll(".categories-filters button");
        allBtn.forEach(btn => btn.classList.remove("selected")); 
        filtreTous.classList.add("selected");
        affichageWorks(worksListe);
    });
    categoriesFiltres.appendChild(filtreTous);
    
    filtresListe.forEach(filtre => {
        const btnFiltres = document.createElement("button");
        btnFiltres.innerText = filtre.name;
        btnFiltres.setAttribute("data-category", filtre.id);

        btnFiltres.addEventListener("click", () => {
            const worksFiltres = worksListe.filter(work => work.category.id === filtre.id);
            affichageWorks(worksFiltres);

            const allBtn = document.querySelectorAll(".categories-filters button");
            allBtn.forEach(btn => btn.classList.remove("selected"));
            
            btnFiltres.classList.add("selected");
        });

        categoriesFiltres.appendChild(btnFiltres);
    });
}


async function init() {
    const { worksListe, filtresListe } = await fetchData();
    affichageWorks(worksListe);
    affichageFiltres(worksListe, filtresListe);
    affichageModeAdmin();
    displayModal();
    displayModalGallery(worksListe);
}

init();

