export function ajoutListenersAvis() {

  const piecesElements = document.querySelectorAll(".fiches article button");

  for (let i = 0; i < piecesElements.length; i++) {

   piecesElements[i].addEventListener("click", async function (event) 
   {  
      const id = event.target.dataset.id;

      let avis = window.localStorage.getItem('avis-piece-'+id);
    
      if(avis === null)
      {
        const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
        avis = await reponse.json();

        window.localStorage.setItem('avis-piece-'+id, JSON.stringify(avis));
      }
      else{avis = JSON.parse(avis);}

      if(event.target.innerText === "Afficher les avis")
      {
        const pieceElement = event.target.parentElement;
      
        const avisElement = document.createElement("p");
        avisElement.id = "avis-piece-"+id.toString();
        
        for (let i = 0; i < avis.length; i++) 
        {
          avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
        }

        pieceElement.appendChild(avisElement);

        event.target.innerText = "Masquer les avis";
      }
      else
      {
        const pElt = document.querySelector('#avis-piece-'+id.toString());
        pElt.remove();
        event.target.innerText = "Afficher les avis";
      }
   });

  }
}

export function ajoutListenerEnvoyerAvis() 
{
  const formulaireAvis = document.querySelector(".formulaire-avis");

  formulaireAvis.addEventListener("submit", function (event) 
  {
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const avis = 
    {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),

      utilisateur: event.target.querySelector("[name=utilisateur").value,

      commentaire: event.target.querySelector("[name=commentaire]").value,

      nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
    };

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
    });
  });
}

export async function afficherGraphAvis()
{
  const allAvis = await fetch("http://localhost:8081/avis");
  console.log(allAvis);
  /*
  .then(value=>value.json());

  const nbEtoilesArray = [0,0,0,0,0];

  for(let avis of allAvis)
  {
    if(Number.isInteger(avis.nbEtoiles)) console.log(avis.nbEtoiles);
    nbEtoilesArray[avis.nbEtoiles-1]++;
  }
  
  const canvasElt = document.getElementById("graphique-avis");

  new Chart(canvasElt, 
    {
      type: 'bar',
      data: {
        labels: ["5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"],
        datasets: [{
          label: "Etoiles attribuées",
          data: nbEtoilesArray.reverse(),
          borderWidth: 1,
          backgroundColor: 'rgb(255, 230, 0)'
        }]
      },
      options: {
        indexAxis: 'y'
      }
    });*/
}