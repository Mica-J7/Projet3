import { displayAdminMode } from "./admin.js";
import { displayModal } from "./admin.js";
import { displayModalGallery } from "./admin.js";
import { addWorks } from "./admin.js";

export async function fetchData() {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const worksList = await worksResponse.json();

    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const filtersList = await categoriesResponse.json();

    return {worksList, filtersList};
}


export function displayWorks(worksList) {
    const workGallery = document.querySelector(".gallery");
    workGallery.innerHTML = "";
    worksList.forEach(work => {
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


function displayFilters(worksList, filtersList) {
    const categoriesFilters = document.querySelector(".categories-filters");
    const filterAll = document.createElement("button");
    filterAll.innerText = "Tous";
    filterAll.classList.add("selected");
    filterAll.addEventListener("click", () => {
        const allBtn = document.querySelectorAll(".categories-filters button");
        allBtn.forEach(btn => btn.classList.remove("selected")); 
        filterAll.classList.add("selected");
        displayWorks(worksList);
    });
    categoriesFilters.appendChild(filterAll);
    
    filtersList.forEach(filter => {
        const filtersBtn = document.createElement("button");
        filtersBtn.innerText = filter.name;
        filtersBtn.setAttribute("data-category", filter.id);

        filtersBtn.addEventListener("click", () => {
            const worksFilters = worksList.filter(work => work.category.id === filter.id);
            displayWorks(worksFilters);

            const allBtn = document.querySelectorAll(".categories-filters button");
            allBtn.forEach(btn => btn.classList.remove("selected"));
            
            filtersBtn.classList.add("selected");
        });

        categoriesFilters.appendChild(filtersBtn);
    });
}


async function init() {
    const { worksList, filtersList } = await fetchData();
    displayWorks(worksList);
    displayFilters(worksList, filtersList);
    displayAdminMode();
    displayModal();
    displayModalGallery(worksList);
    addWorks();
}

init();

