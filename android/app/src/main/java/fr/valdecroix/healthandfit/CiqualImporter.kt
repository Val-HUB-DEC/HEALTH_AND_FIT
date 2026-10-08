package fr.valdecroix.healthandfit

import android.content.ContentValues
import android.content.Context
import android.util.Log
import org.xmlpull.v1.XmlPullParser
import java.io.File

class CiqualImporter(private val context: Context) {

    private val TAG = "CiqualImporter"

    private fun ouvrirXml(nomFichier: String): XmlPullParser {
        val fichier = File(
            context.filesDir,
            "data/$nomFichier"
        )

        val inputStream = fichier.inputStream()

        return android.util.Xml.newPullParser().apply {
            setInput(inputStream, "UTF-8")
        }
    }

    data class Nutrition(
        var kcal: Double = 0.0,
        var proteines: Double = 0.0,
        var glucides: Double = 0.0,
        var lipides: Double = 0.0
    )

    fun importer() {

        Thread {

            try {

                Log.d(TAG, "=================================")
                Log.d(TAG, "DÉBUT IMPORT CIQUAL")
                Log.d(TAG, "=================================")

                val categories = chargerCategories()

                Log.d(TAG, "Catégories chargées : ${categories.size}")

                val nutritions = chargerNutritions()

                Log.d(TAG, "Données nutritionnelles chargées : ${nutritions.size}")

                importerAliments(
                    categories,
                    nutritions
                )

                Log.d(TAG, "=================================")
                Log.d(TAG, "IMPORT CIQUAL TERMINÉ")
                Log.d(TAG, "=================================")

            } catch (e: Exception) {

                Log.e(
                    TAG,
                    "Erreur pendant l'import Ciqual",
                    e
                )
            }

        }.start()
    }

    private fun chargerCategories(): MutableMap<String, String> {

        val categories = mutableMapOf<String, String>()

        Log.d(TAG, "Lecture de alim_grp.xml")

        val parser = ouvrirXml("alim_grp.xml")

        var codeGroupe = ""
        var nomGroupe = ""

        while (parser.next() != XmlPullParser.END_DOCUMENT) {

            if (
                parser.eventType == XmlPullParser.START_TAG &&
                parser.name == "ALIM_GRP"
            ) {

                codeGroupe = ""
                nomGroupe = ""

            }

            if (parser.eventType == XmlPullParser.START_TAG) {

                when (parser.name) {

                    "alim_grp_code" -> {
                        codeGroupe = parser.nextText().trim()
                    }

                    "alim_grp_nom_fr" -> {
                        nomGroupe = parser.nextText().trim()
                    }
                }
            }

            if (
                parser.eventType == XmlPullParser.END_TAG &&
                parser.name == "ALIM_GRP"
            ) {

                if (
                    codeGroupe.isNotEmpty() &&
                    nomGroupe.isNotEmpty()
                ) {

                    categories[codeGroupe] = nomGroupe
                }
            }
        }

        Log.d(
            TAG,
            "Nombre total catégories : ${categories.size}"
        )

        return categories
    }

    private fun convertirNombre(texte: String): Double {

        return texte
            .trim()
            .replace(",", ".")
            .toDoubleOrNull()
            ?: 0.0
    }

    private fun chargerNutritions(): MutableMap<String, Nutrition> {

        val nutritions = mutableMapOf<String, Nutrition>()

        Log.d(TAG, "Lecture de compo.xml")

        val parser = ouvrirXml("compo.xml")

        var codeAliment = ""
        var codeConstituant = ""
        var teneur = ""

        var compteur = 0

        while (parser.next() != XmlPullParser.END_DOCUMENT) {

            if (
                parser.eventType == XmlPullParser.START_TAG &&
                parser.name == "COMPO"
            ) {

                codeAliment = ""
                codeConstituant = ""
                teneur = ""
            }

            if (parser.eventType == XmlPullParser.START_TAG) {

                when (parser.name) {

                    "alim_code" -> {
                        codeAliment = parser.nextText().trim()
                    }

                    "const_code" -> {
                        codeConstituant = parser.nextText().trim()
                    }

                    "teneur" -> {
                        teneur = parser.nextText().trim()
                    }
                }
            }

            if (
                parser.eventType == XmlPullParser.END_TAG &&
                parser.name == "COMPO"
            ) {

                if (
                    codeAliment.isNotEmpty() &&
                    codeConstituant.isNotEmpty()
                ) {

                    val valeur = convertirNombre(teneur)

                    val nutrition = nutritions.getOrPut(
                        codeAliment
                    ) {
                        Nutrition()
                    }

                    when (codeConstituant) {

                        "328" -> {
                            nutrition.kcal = valeur
                        }

                        "25000" -> {
                            nutrition.proteines = valeur
                        }

                        "31000" -> {
                            nutrition.glucides = valeur
                        }

                        "40000" -> {
                            nutrition.lipides = valeur
                        }
                    }

                    compteur++
                }
            }
        }

        Log.d(
            TAG,
            "Valeurs nutritionnelles traitées : $compteur"
        )

        return nutritions
    }

    private fun importerAliments(
        categories: Map<String, String>,
        nutritions: Map<String, Nutrition>
    ) {

        Log.d(TAG, "Lecture de alim.xml")

        val parser = ouvrirXml("alim.xml")

        val database = HealthAndFitDatabase(context)
        val db = database.writableDatabase

        var compteur = 0

        var codeAliment = ""
        var nomAliment = ""
        var codeGroupe = ""

        while (parser.next() != XmlPullParser.END_DOCUMENT) {

            if (
                parser.eventType == XmlPullParser.START_TAG &&
                parser.name == "ALIM"
            ) {

                codeAliment = ""
                nomAliment = ""
                codeGroupe = ""
            }

            if (parser.eventType == XmlPullParser.START_TAG) {

                when (parser.name) {

                    "alim_code" -> {
                        codeAliment = parser.nextText().trim()
                    }

                    "alim_nom_fr" -> {
                        nomAliment = parser.nextText().trim()
                    }

                    "alim_grp_code" -> {
                        codeGroupe = parser.nextText().trim()
                    }
                }
            }

            if (
                parser.eventType == XmlPullParser.END_TAG &&
                parser.name == "ALIM"
            ) {

                if (
                    codeAliment.isNotEmpty() &&
                    nomAliment.isNotEmpty()
                ) {

                    val nutrition =
                        nutritions[codeAliment]
                            ?: Nutrition()

                    val categorie =
                        categories[codeGroupe]
                            ?: "Autres"

                    val valeurs = ContentValues()

                    valeurs.put(
                        "code_ciqual",
                        codeAliment
                    )

                    valeurs.put(
                        "nom",
                        nomAliment
                    )

                    valeurs.put(
                        "categorie",
                        categorie
                    )

                    valeurs.put(
                        "unite_reference",
                        "g"
                    )

                    valeurs.put(
                        "quantite_reference",
                        100.0
                    )

                    valeurs.put(
                        "kcal",
                        nutrition.kcal
                    )

                    valeurs.put(
                        "proteines",
                        nutrition.proteines
                    )

                    valeurs.put(
                        "glucides",
                        nutrition.glucides
                    )

                    valeurs.put(
                        "lipides",
                        nutrition.lipides
                    )

                    db.insertWithOnConflict(
                        "aliments",
                        null,
                        valeurs,
                        android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE
                    )

                    compteur++

                    if (compteur % 500 == 0) {

                        Log.d(
                            TAG,
                            "Aliments importés : $compteur"
                        )
                    }
                }
            }
        }

        db.close()

        Log.d(
            TAG,
            "Nombre total aliments importés : $compteur"
        )
    }
}