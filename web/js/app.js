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

function afficherVersionApplication() {

    const element =
        document.getElementById("version-application");

    if (!element) {
        return;
    }

    fetch("version.json")
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (donnees) {

            element.textContent =
                donnees.version;

        })
        .catch(function () {

            element.textContent =
                "inconnue";

        });
}

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

    if (!document.getElementById("liste-petitDejeuner")) {
        return;
    }

    const date =
        new Date()
            .toISOString()
            .split("T")[0];

    const resultat =
        Android.obtenirConsommations(date);

    const consommations =
        JSON.parse(resultat);

    const listes = {
        petitDejeuner:
            document.getElementById(
                "liste-petitDejeuner"
            ),

        dejeuner:
            document.getElementById(
                "liste-dejeuner"
            ),

        diner:
            document.getElementById(
                "liste-diner"
            ),

        collation:
            document.getElementById(
                "liste-collation"
            )
    };

    const totaux = {
        petitDejeuner: 0,
        dejeuner: 0,
        diner: 0,
        collation: 0
    };

    let totalJournee = 0;

    /*
     * On vide les listes
     */
    for (const repas in listes) {
        listes[repas].innerHTML = "";
    }

    /*
     * On affiche les consommations
     */
    consommations.forEach(function (consommation) {

        const repas =
            consommation.repas;

        const quantite =
            consommation.quantite;

        const calories =
            consommation.kcal *
            (
                quantite /
                consommation.quantite_reference
            );

        if (!listes[repas]) {
            return;
        }

        const element =
            document.createElement("div");

        element.className =
            "d-flex justify-content-between align-items-center mb-2";

        element.innerHTML = `
            <div>
                <div class="fw-semibold">
                    ${consommation.nom}
                </div>

                <small>
                    ${quantite} ${consommation.unite_reference}
                </small>
            </div>

            <div class="d-flex align-items-center gap-2">

                <span class="fw-semibold">
                    ${Math.round(calories)} kcal
                </span>

                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                >
                    Supprimer
                </button>

            </div>
        `;

        const boutonSupprimer =
            element.querySelector("button");

        boutonSupprimer.addEventListener(
            "click",
            function () {

                const confirmation =
                    confirm(
                        "Supprimer cet aliment du repas ?"
                    );

                if (!confirmation) {
                    return;
                }

                const resultat =
                    Android.supprimerConsommation(
                        consommation.id
                    );

                if (resultat) {

                    afficherRepas();

                } else {

                    alert(
                        "Erreur lors de la suppression."
                    );
                }
            }
        );

        listes[repas].appendChild(element);

        totaux[repas] += calories;

        totalJournee += calories;
    });

    /*
     * Message si aucun aliment
     */
    for (const repas in listes) {

        if (
            listes[repas].children.length === 0
        ) {

            listes[repas].innerHTML = `
                <p class="text-secondary mb-0">
                    Aucun aliment enregistré
                </p>
            `;
        }
    }

    /*
     * Totaux par repas
     */
    const caloriesPetitDejeuner =
        document.getElementById(
            "calories-petitDejeuner"
        );

    const caloriesDejeuner =
        document.getElementById(
            "calories-dejeuner"
        );

    const caloriesDiner =
        document.getElementById(
            "calories-diner"
        );

    const caloriesCollation =
        document.getElementById(
            "calories-collation"
        );

    if (caloriesPetitDejeuner) {
        caloriesPetitDejeuner.textContent =
            Math.round(
                totaux.petitDejeuner
            ) + " kcal";
    }

    if (caloriesDejeuner) {
        caloriesDejeuner.textContent =
            Math.round(
                totaux.dejeuner
            ) + " kcal";
    }

    if (caloriesDiner) {
        caloriesDiner.textContent =
            Math.round(
                totaux.diner
            ) + " kcal";
    }

    if (caloriesCollation) {
        caloriesCollation.textContent =
            Math.round(
                totaux.collation
            ) + " kcal";
    }

    /*
     * Total de la journée
     */
    const totalCalories =
        document.getElementById(
            "total-calories"
        );

    if (totalCalories) {
        totalCalories.textContent =
            Math.round(totalJournee);
    }
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

function testerRechercheAliment() {

    const resultat = Android.rechercherAliments("Poulet");

    alert(resultat);
}

let alimentsDisponibles = [];


function chargerAliments() {

    const resultat = Android.obtenirTousLesAliments();

    alimentsDisponibles = JSON.parse(resultat);

    afficherAliments(alimentsDisponibles);

    chargerCategories();
}


function afficherAliments(aliments) {

    const liste = document.getElementById("liste-aliments");

    if (!liste) {
        return;
    }

    liste.innerHTML = "";


    if (aliments.length === 0) {

        liste.innerHTML = `
            <p class="text-secondary">
                Aucun aliment trouvé.
            </p>
        `;

        return;
    }


    aliments.forEach(aliment => {

        const element = document.createElement("button");

        element.type = "button";

        element.className =
            "list-group-item list-group-item-action d-flex justify-content-between align-items-center";


        element.innerHTML = `

            <span>
                ${aliment.nom}
            </span>

            <span>
                →
            </span>

        `;


        element.onclick = function () {

            selectionnerAliment(aliment.id);

        };


        liste.appendChild(element);

    });
}


function chargerCategories() {

    const select = document.getElementById("filtre-categorie");

    if (!select) {
        return;
    }

    const categories = [
        ...new Set(
            alimentsDisponibles.map(
                aliment => aliment.categorie
            )
        )
    ];

    categories.sort();


    categories.forEach(categorie => {

        const option = document.createElement("option");

        option.value = categorie;

        option.textContent = categorie;

        select.appendChild(option);

    });
}


function filtrerAliments() {

    const recherche =
        document
            .getElementById("recherche-aliment")
            .value
            .toLowerCase();

    const categorie =
        document
            .getElementById("filtre-categorie")
            .value;


    const resultat =
        alimentsDisponibles.filter(aliment => {

            const correspondRecherche =
                aliment.nom
                    .toLowerCase()
                    .includes(recherche);

            const correspondCategorie =
                categorie === "" ||
                aliment.categorie === categorie;

            return (
                correspondRecherche &&
                correspondCategorie
            );

        });


    afficherAliments(resultat);
}


function selectionnerAliment(id) {

    const aliment =
        alimentsDisponibles.find(
            aliment => aliment.id === id
        );

    if (!aliment) {
        return;
    }

    localStorage.setItem(
        "alimentSelectionne",
        JSON.stringify(aliment)
    );

    window.location.href =
        "quantite-aliment.html";
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.getElementById(
                "liste-aliments"
            )
        ) {

            chargerAliments();


            document
                .getElementById(
                    "recherche-aliment"
                )
                .addEventListener(
                    "input",
                    filtrerAliments
                );


            document
                .getElementById(
                    "filtre-categorie"
                )
                .addEventListener(
                    "change",
                    filtrerAliments
                );

        }

    }
);

function chargerAlimentSelectionne() {

    const donnees =
        localStorage.getItem("alimentSelectionne");

    if (!donnees) {

        window.location.href =
            "ajouter-aliment.html";

        return;
    }


    const aliment =
        JSON.parse(donnees);


    document.getElementById(
        "nom-aliment"
    ).textContent = aliment.nom;


    document.getElementById(
        "categorie-aliment"
    ).textContent = aliment.categorie;


    document.getElementById(
        "quantite-reference"
    ).textContent =
        aliment.quantite_reference;


    document.getElementById(
        "unite-reference"
    ).textContent =
        aliment.unite_reference;


    document.getElementById(
        "unite-quantite"
    ).textContent =
        aliment.unite_reference;


    document.getElementById(
        "kcal-aliment"
    ).textContent =
        aliment.kcal;


    document.getElementById(
        "proteines-aliment"
    ).textContent =
        aliment.proteines;


    document.getElementById(
        "glucides-aliment"
    ).textContent =
        aliment.glucides;


    document.getElementById(
        "lipides-aliment"
    ).textContent =
        aliment.lipides;


    calculerQuantiteAliment();
}

function calculerQuantiteAliment() {

    const donnees =
        localStorage.getItem("alimentSelectionne");

    if (!donnees) {
        return;
    }


    const aliment =
        JSON.parse(donnees);


    const quantite =
        parseFloat(
            document.getElementById(
                "quantite-aliment"
            ).value
        );


    if (
        isNaN(quantite) ||
        quantite < 0
    ) {
        return;
    }


    const coefficient =
        quantite /
        aliment.quantite_reference;


    const kcal =
        aliment.kcal *
        coefficient;


    const proteines =
        aliment.proteines *
        coefficient;


    const glucides =
        aliment.glucides *
        coefficient;


    const lipides =
        aliment.lipides *
        coefficient;


    document.getElementById(
        "total-kcal"
    ).textContent =
        kcal.toFixed(1) + " kcal";


    document.getElementById(
        "total-proteines"
    ).textContent =
        proteines.toFixed(1) + " g";


    document.getElementById(
        "total-glucides"
    ).textContent =
        glucides.toFixed(1) + " g";


    document.getElementById(
        "total-lipides"
    ).textContent =
        lipides.toFixed(1) + " g";
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.getElementById(
                "nom-aliment"
            )
        ) {

            const dateAliment =
                document.getElementById(
                    "date-aliment"
                );

            if (dateAliment) {

                dateAliment.value =
                    new Date()
                        .toISOString()
                        .split("T")[0];
            }

            chargerAlimentSelectionne();

            document
                .getElementById(
                    "quantite-aliment"
                )
                .addEventListener(
                    "input",
                    calculerQuantiteAliment
                );
        }

    }
);

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const boutonAjouter =
            document.getElementById(
                "ajouter-aliment-repas"
            );

        if (!boutonAjouter) {
            return;
        }

        boutonAjouter.addEventListener(
            "click",
            function () {

                const donnees =
                    localStorage.getItem(
                        "alimentSelectionne"
                    );

                if (!donnees) {
                    return;
                }

                const aliment =
                    JSON.parse(donnees);

                const date =
                    document.getElementById(
                        "date-aliment"
                    ).value;

                const quantite =
                    parseFloat(
                        document.getElementById(
                            "quantite-aliment"
                        ).value
                    );

                let repas = "";

                if (
                    document.getElementById(
                        "repas-petit-dejeuner"
                    ).checked
                ) {
                    repas = "petitDejeuner";
                }

                if (
                    document.getElementById(
                        "repas-dejeuner"
                    ).checked
                ) {
                    repas = "dejeuner";
                }

                if (
                    document.getElementById(
                        "repas-diner"
                    ).checked
                ) {
                    repas = "diner";
                }

                if (
                    document.getElementById(
                        "repas-collation"
                    ).checked
                ) {
                    repas = "collation";
                }

                if (!date) {
                    alert(
                        "Veuillez sélectionner une date."
                    );
                    return;
                }

                if (
                    isNaN(quantite) ||
                    quantite <= 0
                ) {
                    alert(
                        "Veuillez saisir une quantité."
                    );
                    return;
                }

                if (!repas) {
                    alert(
                        "Veuillez sélectionner un repas."
                    );
                    return;
                }

                const resultat =
                    Android.ajouterConsommation(
                        date,
                        repas,
                        aliment.id,
                        quantite
                    );

                if (resultat) {

                    alert(
                        "Aliment ajouté au repas."
                    );

                    window.location.href =
                        "alimentation.html";

                } else {

                    alert(
                        "Erreur lors de l'enregistrement."
                    );
                }
            }
        );
    }
);

chargerJournee();

afficherRepas();

afficherVersionApplication();