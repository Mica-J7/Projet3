let worksList = []; // Variable globale

async function loadGallery(filteredList = null) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Vide la galerie à chaque appel

    const listToDisplay = filteredList || worksList;

    for (let i = 0; i < listToDisplay.length; i++) {
        const figure = listToDisplay[i];

        const workImage = document.createElement("img");
        workImage.src = figure.imageUrl;

        const workTitle = document.createElement("h3");
        workTitle.innerText = figure.title;

        const workFigure = document.createElement("figure");
        workFigure.appendChild(workImage);
        workFigure.appendChild(workTitle);

        gallery.appendChild(workFigure);
    }
}

async function loadCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categoriesList = await reponse.json();

    const categorieTous = document.createElement("span");
    categorieTous.innerText = "Tous";
    const categorieTousBtn = document.createElement("button");
    categorieTousBtn.appendChild(categorieTous);
    categorieTousBtn.addEventListener("click", () => {
        loadGallery(); // Affiche tout
    });

    const categoriesFilters = document.querySelector(".categories-filters");
    categoriesFilters.appendChild(categorieTousBtn);

    for (let i = 0; i < categoriesList.length; i++) {
        const categorie = categoriesList[i];

        const categorieName = document.createElement("span");
        categorieName.innerText = categorie.name;

        const categorieBtn = document.createElement("button");
        categorieBtn.setAttribute("data-category", categorie.id);
        categorieBtn.appendChild(categorieName);

        categorieBtn.addEventListener("click", () => {
            const filtered = worksList.filter(work => work.categoryId === categorie.id);
            loadGallery(filtered); // Affiche uniquement les projets filtrés
        });

        categoriesFilters.appendChild(categorieBtn);
    }
}

async function init() {
    const reponse = await fetch("http://localhost:5678/api/works");
    worksList = await reponse.json();

    loadGallery();     // Affiche tout au début
    loadCategories();  // Crée les boutons
}

init();