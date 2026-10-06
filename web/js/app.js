// ===============================
// DONNÉES DU REPAS
// ===============================

let journee = {

    date: new Date().toISOString().split("T")[0],

    repas: {

        petitDejeuner: {
            nom: "Petit-déjeuner",
            aliments: []
        },

        dejeuner: {
            nom: "Déjeuner",
            aliments: []
        },

        diner: {
            nom: "Dîner",
            aliments: []
        },

        collation: {
            nom: "Collation",
            aliments: []
        }

    }

};

// ===============================
// ÉLÉMENTS HTML
// ===============================

const boutonAjouter = document.getElementById("ajouter-aliment");

const listeAliments = document.getElementById("liste-aliments");

const totalCalories = document.getElementById("total-calories");


// ===============================
// AJOUT D'UN ALIMENT
// ===============================

if (boutonAjouter) {
    boutonAjouter.addEventListener("click", function () {

        const repasSelectionne =
        document.getElementById("repas").value;

        const nom =
        document.getElementById("aliment").value;

        const quantite = Number(
            document.getElementById("quantite").value
        );

        const caloriesPour100g = Number(
            document.getElementById("calories").value
        );


        // Calcul des calories
        const calories = (quantite * caloriesPour100g) / 100;


        // Création de l'aliment
        const aliment = {

            nom: nom,

            quantite: quantite,

            caloriesPour100g: caloriesPour100g,

            calories: calories

        };


        // Ajout de l'aliment dans le repas
        journee.repas[repasSelectionne].aliments.push(aliment);
        // Sauvegarde
        sauvegarderJournee();

        // Mise à jour de l'affichage
        afficherRepas();


        // Nettoyage des champs
        document.getElementById("aliment").value = "";
        document.getElementById("quantite").value = "";
        document.getElementById("calories").value = "";

    });
}

// ===============================
// AFFICHAGE DU REPAS
// ===============================

function afficherRepas() {
    // Ne rien faire si la page n'est pas la page Alimentation
    if (!document.getElementById("liste-petitDejeuner")) {
        return;
    }
    // Les 4 zones HTML
    const listes = {
        petitDejeuner: document.getElementById("liste-petitDejeuner"),
        dejeuner: document.getElementById("liste-dejeuner"),
        diner: document.getElementById("liste-diner"),
        collation: document.getElementById("liste-collation")
    };


    // Total de la journée
    let totalJournee = 0;


    // Parcours des 4 repas
    for (const repas in journee.repas) {

        const aliments = journee.repas[repas].aliments;

        const liste = listes[repas];


        // Vider l'affichage
        liste.innerHTML = "";


        // Parcours des aliments
        aliments.forEach(function (aliment, index) {

            // Création de la ligne
            const element = document.createElement("p");


            // Texte de l'aliment
            element.textContent =
                aliment.nom +
                " - " +
                aliment.quantite +
                " g - " +
                Math.round(aliment.calories) +
                " kcal";


            // Création du bouton
            const boutonSupprimer =
                document.createElement("button");

            boutonSupprimer.textContent = "Supprimer";


            // Action du bouton
            boutonSupprimer.addEventListener("click", function () {

                aliments.splice(index, 1);

                sauvegarderJournee();

                afficherRepas();

            });


            // Ajouter le bouton à la ligne
            element.appendChild(boutonSupprimer);


            // Ajouter la ligne à la page
            liste.appendChild(element);


            // Ajouter les calories au total
            totalJournee += aliment.calories;

        });


        // Aucun aliment
        if (aliments.length === 0) {

            liste.innerHTML =
                "<p>Aucun aliment enregistré</p>";

        }

    }


    // Affichage du total
    document.getElementById("total-calories").textContent =
        Math.round(totalJournee);

}

function sauvegarderJournee() {

    localStorage.setItem(
        "journee",
        JSON.stringify(journee)
    );

}

function chargerJournee() {

    const donneesSauvegardees =
        localStorage.getItem("journee");


    if (donneesSauvegardees) {

        const journeeSauvegardee =
            JSON.parse(donneesSauvegardees);


        const dateAujourdhui =
            new Date().toISOString().split("T")[0];


        if (journeeSauvegardee.date === dateAujourdhui) {

            journee = journeeSauvegardee;

        }

    }

}

function testerBaseDeDonnees() {

    const nombreAliments = Android.compterAliments();

    alert(
        "Nombre d'aliments dans la base : " +
        nombreAliments
    );
}

chargerJournee();

afficherRepas();