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

let nutrimentSelectionne = "kcal";

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
        petitDejeuner: {
            kcal: 0,
            proteines: 0,
            glucides: 0,
            lipides: 0
        },

        dejeuner: {
            kcal: 0,
            proteines: 0,
            glucides: 0,
            lipides: 0
        },

        diner: {
            kcal: 0,
            proteines: 0,
            glucides: 0,
            lipides: 0
        },

        collation: {
            kcal: 0,
            proteines: 0,
            glucides: 0,
            lipides: 0
        }
    };

    const totalJournee = {
        kcal: 0,
        proteines: 0,
        glucides: 0,
        lipides: 0
    };


    for (const repas in listes) {
        listes[repas].innerHTML = "";
    }


    consommations.forEach(function (consommation) {

        const repas =
            consommation.repas;

        if (!listes[repas]) {
            return;
        }

        const coefficient =
            consommation.quantite /
            consommation.quantite_reference;

        const kcal =
            consommation.kcal *
            coefficient;

        const proteines =
            consommation.proteines *
            coefficient;

        const glucides =
            consommation.glucides *
            coefficient;

        const lipides =
            consommation.lipides *
            coefficient;


        totaux[repas].kcal += kcal;
        totaux[repas].proteines += proteines;
        totaux[repas].glucides += glucides;
        totaux[repas].lipides += lipides;

        totalJournee.kcal += kcal;
        totalJournee.proteines += proteines;
        totalJournee.glucides += glucides;
        totalJournee.lipides += lipides;


        let valeur = 0;
        let unite = "";

        if (nutrimentSelectionne === "kcal") {
            valeur = kcal;
            unite = "kcal";
        }

        if (nutrimentSelectionne === "proteines") {
            valeur = proteines;
            unite = "g";
        }

        if (nutrimentSelectionne === "glucides") {
            valeur = glucides;
            unite = "g";
        }

        if (nutrimentSelectionne === "lipides") {
            valeur = lipides;
            unite = "g";
        }


        const element =
            document.createElement("div");

        element.className =
            "d-flex justify-content-between align-items-center mb-2";


        element.innerHTML = `
            <div class="d-flex align-items-center">

                <span class="me-2">
                    ${consommation.quantite}
                    ${consommation.unite_reference}
                </span>

                <span class="fw-semibold">
                    ${consommation.nom}
                </span>

            </div>

            <div class="d-flex align-items-center gap-2">

                <span class="fw-semibold">
                    ${valeur.toFixed(1)} ${unite}
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
    });


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

    afficherTotauxRepas(totaux);
    afficherTotalJournee(totalJournee);
}

function afficherTotauxRepas(totaux) {

    const ids = {
        petitDejeuner:
            "calories-petitDejeuner",

        dejeuner:
            "calories-dejeuner",

        diner:
            "calories-diner",

        collation:
            "calories-collation"
    };

    for (const repas in ids) {

        const element =
            document.getElementById(
                ids[repas]
            );

        if (!element) {
            continue;
        }

        let valeur = 0;
        let unite = "kcal";

        if (nutrimentSelectionne === "kcal") {
            valeur = totaux[repas].kcal;
        }

        if (nutrimentSelectionne === "proteines") {
            valeur = totaux[repas].proteines;
            unite = "g";
        }

        if (nutrimentSelectionne === "glucides") {
            valeur = totaux[repas].glucides;
            unite = "g";
        }

        if (nutrimentSelectionne === "lipides") {
            valeur = totaux[repas].lipides;
            unite = "g";
        }

        element.textContent =
            Math.round(valeur * 10) / 10 +
            " " +
            unite;
    }
}


function afficherTotalJournee(total) {

    document.getElementById(
        "total-kcal-journee"
    ).textContent =
        Math.round(total.kcal) +
        " kcal";

    document.getElementById(
        "total-proteines-journee"
    ).textContent =
        Math.round(total.proteines * 10) / 10 +
        " g";

    document.getElementById(
        "total-glucides-journee"
    ).textContent =
        Math.round(total.glucides * 10) / 10 +
        " g";

    document.getElementById(
        "total-lipides-journee"
    ).textContent =
        Math.round(total.lipides * 10) / 10 +
        " g";


    // ===============================
    // TOTAL DU REPAS AFFICHÉ EN BAS
    // ===============================

    const totalCalories =
        document.getElementById(
            "total-calories"
        );

    if (!totalCalories) {
        return;
    }

    let valeur = 0;
    let unite = "kcal";

    if (nutrimentSelectionne === "kcal") {

        valeur = total.kcal;
        unite = "kcal";

    }

    if (nutrimentSelectionne === "proteines") {

        valeur = total.proteines;
        unite = "g";

    }

    if (nutrimentSelectionne === "glucides") {

        valeur = total.glucides;
        unite = "g";

    }

    if (nutrimentSelectionne === "lipides") {

        valeur = total.lipides;
        unite = "g";

    }

    totalCalories.textContent =
        Math.round(valeur * 10) / 10 +
        " " +
        unite;
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

        const boutons = {
            kcal:
                document.getElementById(
                    "selection-kcal"
                ),

            proteines:
                document.getElementById(
                    "selection-proteines"
                ),

            glucides:
                document.getElementById(
                    "selection-glucides"
                ),

            lipides:
                document.getElementById(
                    "selection-lipides"
                )
        };


        for (const nutriment in boutons) {

            if (!boutons[nutriment]) {
                continue;
            }

            boutons[nutriment].addEventListener(
                "click",
                function () {

                    nutrimentSelectionne =
                        nutriment;


                    for (
                        const autre in boutons
                    ) {

                        boutons[autre]
                            .classList.remove(
                                "btn-primary"
                            );

                        boutons[autre]
                            .classList.add(
                                "btn-outline-primary"
                            );
                    }


                    boutons[nutriment]
                        .classList.remove(
                            "btn-outline-primary"
                        );

                    boutons[nutriment]
                        .classList.add(
                            "btn-primary"
                        );


                    afficherRepas();
                }
            );
        }
    }
);

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