package fr.valdecroix.healthandfit

import android.content.Context
import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONObject

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
}