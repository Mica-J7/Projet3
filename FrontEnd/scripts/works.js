async function appelApi(worksListe, filtresListe) {
    const worksReponse = await fetch("http://localhost:5678/api/works");
    worksListe = await worksReponse.json();

    const categoriesReponse = await fetch("http://localhost:5678/api/categories");
    filtresListe = await categoriesReponse.json();

    return {worksListe, filtresListe};
}


async function affichageWorks(worksListe) {

    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = ""; // on vide la galerie avant de l'afficher à nouveau

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


async function affichageFiltres() {

    const {worksListe, filtresListe} = await appelApi();

    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = ""; // on vide la galerie avant de l'afficher à nouveau

    const filtreTous = document.createElement("button");
    filtreTous.innerText = "Tous";
    filtreTous.addEventListener("click", () => affichageWorks(worksListe));
    const categoriesFiltres = document.querySelector(".categories-filters");

    categoriesFiltres.appendChild(filtreTous);
        
    for(let i = 0; i < filtresListe.length; i++) {
        const filtre = filtresListe[i];

        const btnFiltres = document.createElement("button");
        btnFiltres.innerText = filtre.name;
        btnFiltres.setAttribute("data-category", filtre.id);

        btnFiltres.addEventListener("click", () => {
            const worksFiltres = worksListe.filter(work => work.category.id === filtre.id);
            affichageWorks(worksFiltres);
        });

        categoriesFiltres.appendChild(btnFiltres);
    }  

    affichageWorks(worksListe);
}

affichageFiltres();