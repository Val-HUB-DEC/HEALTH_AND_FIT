package fr.valdecroix.healthandfit

import android.content.Context
import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject
import android.content.ContentValues

class AndroidBridge(
    private val context: Context
) {

    @JavascriptInterface
    fun compterAliments(): Int {

        val databaseHelper = HealthAndFitDatabase(context)
        val db = databaseHelper.readableDatabase

        val curseur = db.rawQuery(
            "SELECT COUNT(*) FROM aliments",
            null
        )

        curseur.moveToFirst()

        val nombre = curseur.getInt(0)

        curseur.close()
        db.close()

        return nombre
    }


    @JavascriptInterface
    fun rechercherAliments(recherche: String): String {

        val databaseHelper = HealthAndFitDatabase(context)
        val db = databaseHelper.readableDatabase

        val resultat = JSONArray()

        val curseur = db.rawQuery(
            """
            SELECT
                id,
                nom,
                categorie,
                unite_reference,
                quantite_reference,
                kcal,
                proteines,
                glucides,
                lipides
            FROM aliments
            WHERE nom LIKE ?
            ORDER BY nom
            """.trimIndent(),
            arrayOf("%$recherche%")
        )

        while (curseur.moveToNext()) {

            val aliment = JSONObject()

            aliment.put("id", curseur.getInt(0))
            aliment.put("nom", curseur.getString(1))
            aliment.put("categorie", curseur.getString(2))
            aliment.put("unite_reference", curseur.getString(3))
            aliment.put("quantite_reference", curseur.getDouble(4))
            aliment.put("kcal", curseur.getDouble(5))
            aliment.put("proteines", curseur.getDouble(6))
            aliment.put("glucides", curseur.getDouble(7))
            aliment.put("lipides", curseur.getDouble(8))

            resultat.put(aliment)
        }

        curseur.close()
        db.close()

        return resultat.toString()
    }

    @JavascriptInterface
    fun obtenirTousLesAliments(): String {

        val databaseHelper = HealthAndFitDatabase(context)
        val db = databaseHelper.readableDatabase

        val resultat = JSONArray()

        val curseur = db.rawQuery(
            """
            SELECT
                id,
                nom,
                categorie,
                unite_reference,
                quantite_reference,
                kcal,
                proteines,
                glucides,
                lipides
            FROM aliments
            ORDER BY nom
            """.trimIndent(),
            null
        )

        while (curseur.moveToNext()) {

            val aliment = JSONObject()

            aliment.put("id", curseur.getInt(0))
            aliment.put("nom", curseur.getString(1))
            aliment.put("categorie", curseur.getString(2))
            aliment.put("unite_reference", curseur.getString(3))
            aliment.put("quantite_reference", curseur.getDouble(4))
            aliment.put("kcal", curseur.getDouble(5))
            aliment.put("proteines", curseur.getDouble(6))
            aliment.put("glucides", curseur.getDouble(7))
            aliment.put("lipides", curseur.getDouble(8))

            resultat.put(aliment)
        }

        curseur.close()
        db.close()

        return resultat.toString()
    }

    @JavascriptInterface
    fun ajouterConsommation(
        date: String,
        repas: String,
        alimentId: Int,
        quantite: Double
        ): Boolean {

            val databaseHelper = HealthAndFitDatabase(context)
            val db = databaseHelper.writableDatabase

            val valeurs = ContentValues()

            valeurs.put("date", date)
            valeurs.put("repas", repas)
            valeurs.put("aliment_id", alimentId)
            valeurs.putNull("aliment_personnel_id")
            valeurs.put("quantite", quantite)

            val resultat = db.insert(
                "consommations",
                null,
                valeurs
            )

            db.close()

            return resultat != -1L
    }

    @JavascriptInterface
    fun obtenirConsommations(date: String): String {

        val databaseHelper = HealthAndFitDatabase(context)
        val db = databaseHelper.readableDatabase

        val resultat = JSONArray()

        val curseur = db.rawQuery(
            """
            SELECT
                consommations.id,
                consommations.date,
                consommations.repas,
                consommations.aliment_id,
                consommations.quantite,
                aliments.nom,
                aliments.unite_reference,
                aliments.quantite_reference,
                aliments.kcal,
                aliments.proteines,
                aliments.glucides,
                aliments.lipides
            FROM consommations
            INNER JOIN aliments
                ON consommations.aliment_id = aliments.id
            WHERE consommations.date = ?
            ORDER BY consommations.id
            """.trimIndent(),
            arrayOf(date)
        )

        while (curseur.moveToNext()) {

            val consommation = JSONObject()

            consommation.put(
                "id",
                curseur.getInt(0)
            )

            consommation.put(
                "date",
                curseur.getString(1)
            )

            consommation.put(
                "repas",
                curseur.getString(2)
            )

            consommation.put(
                "aliment_id",
                curseur.getInt(3)
            )

            consommation.put(
                "quantite",
                curseur.getDouble(4)
            )

            consommation.put(
                "nom",
                curseur.getString(5)
            )

            consommation.put(
                "unite_reference",
                curseur.getString(6)
            )

            consommation.put(
                "quantite_reference",
                curseur.getDouble(7)
            )

            consommation.put(
                "kcal",
                curseur.getDouble(8)
            )

            consommation.put(
                "proteines",
                curseur.getDouble(9)
            )

            consommation.put(
                "glucides",
                curseur.getDouble(10)
            )

            consommation.put(
                "lipides",
                curseur.getDouble(11)
            )

            resultat.put(consommation)
        }

        curseur.close()
        db.close()

        return resultat.toString()
    }

    @JavascriptInterface
    fun supprimerConsommation(id: Int): Boolean {

        val databaseHelper = HealthAndFitDatabase(context)
        val db = databaseHelper.writableDatabase

        val resultat = db.delete(
            "consommations",
            "id = ?",
            arrayOf(id.toString())
        )

        db.close()

        return resultat > 0
    }
}