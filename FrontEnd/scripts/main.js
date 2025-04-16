import { affichageModeAdmin } from "./admin.js";
import { openModal } from "./admin.js";

async function appelApi(worksListe, filtresListe) {
    const worksReponse = await fetch("http://localhost:5678/api/works");
    worksListe = await worksReponse.json();

    const categoriesReponse = await fetch("http://localhost:5678/api/categories");
    filtresListe = await categoriesReponse.json();

    // Retourne la liste des projets (works) et la liste des catégories (filtres) :
    return {worksListe, filtresListe};
}


async function affichageWorks(worksListe) {

    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = ""; // On vide la galerie avant de l'afficher à nouveau

    for(let i = 0; i < worksListe.length; i++) {
        const work = worksListe[i];
        
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;

        const workTitle = document.createElement("h3");
        workTitle.innerText = work.title;

        const figure = document.createElement("figure");
        figure.appendChild(workImage);
        figure.appendChild(workTitle);
        // On ajoute l'attribut "data-category" avec la valeur "work.category.id"
        figure.setAttribute("data-category", work.category.id); 
        
        workGallery.appendChild(figure);
    }
}


async function affichageFiltres() {

    // Ici on extrait les deux propriétés "workListe" et "filtresListe" de l'objet retourné par appelAPI()
    // pour les stocker dans deux variables dinstinctes du même nom
    const {worksListe, filtresListe} = await appelApi();

    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = ""; // On vide la galerie avant de l'afficher à nouveau

    // Création du filtre "Tous" :
    const filtreTous = document.createElement("button");
    filtreTous.innerText = "Tous";

    filtreTous.addEventListener("click", () => {
        const allBtn = document.querySelectorAll(".categories-filters button")
        allBtn.forEach(btn => btn.classList.remove("selected")); 
        filtreTous.classList.add("selected"); // Le bouton "Tous" devient vert au clique.
        affichageWorks(worksListe)
    });

    const categoriesFiltres = document.querySelector(".categories-filters");
    categoriesFiltres.appendChild(filtreTous);
    
    // Création des autres filtres :
    for(let i = 0; i < filtresListe.length; i++) {
        const filtre = filtresListe[i];

        const btnFiltres = document.createElement("button");
        btnFiltres.innerText = filtre.name;
        btnFiltres.setAttribute("data-category", filtre.id);

        btnFiltres.addEventListener("click", () => {
            const worksFiltres = worksListe.filter(work => work.category.id === filtre.id);
            affichageWorks(worksFiltres);

            const allBtn = document.querySelectorAll(".categories-filters button");
            allBtn.forEach(btn => btn.classList.remove("selected"));
            
            btnFiltres.classList.add("selected"); // Les boutons deviennent verts au clique.
        });

        categoriesFiltres.appendChild(btnFiltres);
    }  

    // Appel à la fonction pour l'affichage de base des works sans filtre :
    affichageWorks(worksListe);
    affichageModeAdmin();
    openModal();
}


affichageFiltres();

