// Fonction d'appel à l'API pour récuperer les works et les categories :
async function appelApi(worksListe, filtresListe) {
    const worksReponse = await fetch("http://localhost:5678/api/works");
    worksListe = await worksReponse.json();

    const categoriesReponse = await fetch("http://localhost:5678/api/categories");
    filtresListe = await categoriesReponse.json();

    // Retourne la liste des projets (works) et la liste des catégories (filtres) :
    return {worksListe, filtresListe};
}


// Fonction qui ajoute les figures des works dans le DOM de façon dynamique :
async function affichageWorks(worksListe) {

    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = ""; // On vide la galerie avant de l'afficher à nouveau

    for(let i = 0; i < worksListe.length; i++) {
        const work = worksListe[i];
        
        const workImage = document.createElement("img");
        workImage.src = work.imageUrl;

        const workTitle = document.createElement("h3");
        workTitle.innerText = work.title;

        figure = document.createElement("figure");
        figure.appendChild(workImage);
        figure.appendChild(workTitle);
        figure.setAttribute("data-category", work.category.id);
        
        workGallery.appendChild(figure);
    }
}


// Fonction d'affichage des boutons filtres ET filtrage :
async function affichageFiltres() {

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
            
            btnFiltres.classList.add("selected"); // Les boutons devienent verts au clique.
        });

        categoriesFiltres.appendChild(btnFiltres);
    }  

    // Appel à la fonction pour l'affichage de base des works sans filtre :
    affichageWorks(worksListe);
}


// Appel à la fonction pour l'affichage de la galerie au chargement de la page : 
affichageFiltres();