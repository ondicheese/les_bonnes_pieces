import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphAvis } from "./avis.js";

// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");

// Récupération des pièces depuis le fichier JSON
if(pieces === null) 
{
    const reponse = await fetch("http://localhost:8081/pieces");
    pieces = await reponse.json();

    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
 
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
}
else{pieces = JSON.parse(pieces);}



function genererPieces(pieces){
    for(let i=0; i<pieces.length; i++)
    {
        const articleElement = document.createElement('article');

        const imageElement = document.createElement("img");
        imageElement.src = pieces[i].image;

        const nomElement = document.createElement("h2");
        nomElement.innerText = pieces[i].nom;

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;

        const categorieElement = document.createElement("p");
        categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)";

        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = pieces[i].description ?? "Pas de description pour le moment";

        const disponibiliteElement = document.createElement('p');
        disponibiliteElement.innerText = pieces[i].disponibilité ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = pieces[i].id;
        avisBouton.innerText = "Afficher les avis";

        const sectionFiches = document.querySelector(".fiches");
        sectionFiches.appendChild(articleElement);
        articleElement.appendChild(imageElement);
        articleElement.appendChild(nomElement);
        articleElement.appendChild(prixElement);
        articleElement.appendChild(categorieElement);
        articleElement.appendChild(descriptionElement);
        articleElement.appendChild(disponibiliteElement);
        articleElement.appendChild(avisBouton);
    }

    ajoutListenersAvis();
}

genererPieces(pieces);


const boutonTrier = document.querySelector(".btn-trier");

boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
     });
     document.querySelector('.fiches').innerHTML = "";
     genererPieces(piecesOrdonnees);
 });

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
   const piecesFiltrees = pieces.filter(piece => piece.prix <= 35);
   document.querySelector('.fiches').innerHTML = "";
     genererPieces(piecesFiltrees);
});

const boutonFiltrerDescription = document.querySelector(".description");

boutonFiltrerDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description !== undefined;
    });
    console.log(piecesFiltrees);
 });

 const boutonTrierPrixDecroissant = document.querySelector(".decroissant");

boutonTrierPrixDecroissant.addEventListener("click", function () {
    const piecesTriees = Array.from(pieces);
    piecesTriees.sort(function (a,b) {
        return -(a.prix - b.prix);
    });
    console.log(piecesTriees);
 });


const noms = pieces.map(piece => piece.nom);
for(let i= (pieces.length)-1; i>=0; i--)
{
    if(pieces[i].prix > 35)
    {noms.splice(i,1);}
}

function ulCreation(elt, nomClassHTML)
{
    let ulElt = document.createElement('ul');

    for(let i=0; i < elt.length; i++)
    {
        let liElt = document.createElement('li');
        liElt.textContent = elt[i];

        ulElt.appendChild(liElt);
    }

    document.querySelector(`.${nomClassHTML}`).appendChild(ulElt);
}

ulCreation(noms, "abordables");

const piecesDispo = pieces.filter(piece => piece.disponibilité);

const piecesDispoNomEtPrix = piecesDispo.map(piece => piece.nom + ' - ' + piece.prix);

ulCreation(piecesDispoNomEtPrix, "disponibles");

let rangeElt = document.querySelector('input');
rangeElt.addEventListener("input", function(e){
    let piecesByRange = pieces.filter(piece => piece.prix <= e.target.value);
    console.log(piecesByRange);
    document.querySelector('.fiches').innerHTML="";
    genererPieces(piecesByRange);
});

ajoutListenerEnvoyerAvis();

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
});

afficherGraphAvis();