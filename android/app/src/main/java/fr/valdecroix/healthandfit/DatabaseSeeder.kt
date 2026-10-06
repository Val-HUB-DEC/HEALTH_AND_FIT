package fr.valdecroix.healthandfit

import android.content.ContentValues
import android.content.Context

object DatabaseSeeder {

    fun insererAlimentsDeBase(context: Context) {

        val databaseHelper = HealthAndFitDatabase(context)
        val db = databaseHelper.writableDatabase

        // Vérifie si les aliments ont déjà été ajoutés
        val curseur = db.rawQuery(
            "SELECT COUNT(*) FROM aliments",
            null
        )

        curseur.moveToFirst()

        val nombreAliments = curseur.getInt(0)

        curseur.close()

        // Si la base contient déjà des aliments,
        // on ne les ajoute pas une deuxième fois.
        if (nombreAliments > 0) {
            return
        }


        // ==========================================
        // POULET
        // ==========================================

        var aliment = ContentValues()

        aliment.put("nom", "Poulet")
        aliment.put("categorie", "Viandes")
        aliment.put("unite_reference", "g")
        aliment.put("quantite_reference", 100)
        aliment.put("kcal", 165)
        aliment.put("proteines", 31)
        aliment.put("glucides", 0)
        aliment.put("lipides", 3.6)

        db.insert("aliments", null, aliment)


        // ==========================================
        // RIZ COMPLET
        // ==========================================

        aliment = ContentValues()

        aliment.put("nom", "Riz complet")
        aliment.put("categorie", "Féculents")
        aliment.put("unite_reference", "g")
        aliment.put("quantite_reference", 100)
        aliment.put("kcal", 350)
        aliment.put("proteines", 7.5)
        aliment.put("glucides", 72)
        aliment.put("lipides", 2.8)

        db.insert("aliments", null, aliment)


        // ==========================================
        // ŒUF
        // ==========================================

        aliment = ContentValues()

        aliment.put("nom", "Œuf")
        aliment.put("categorie", "Œufs")
        aliment.put("unite_reference", "unité")
        aliment.put("quantite_reference", 1)
        aliment.put("kcal", 78)
        aliment.put("proteines", 6.3)
        aliment.put("glucides", 0.6)
        aliment.put("lipides", 5.3)

        db.insert("aliments", null, aliment)


        // ==========================================
        // COURGETTE
        // ==========================================

        aliment = ContentValues()

        aliment.put("nom", "Courgette")
        aliment.put("categorie", "Légumes")
        aliment.put("unite_reference", "g")
        aliment.put("quantite_reference", 100)
        aliment.put("kcal", 17)
        aliment.put("proteines", 1.2)
        aliment.put("glucides", 3.1)
        aliment.put("lipides", 0.3)

        db.insert("aliments", null, aliment)


        // ==========================================
        // SAUMON
        // ==========================================

        aliment = ContentValues()

        aliment.put("nom", "Saumon")
        aliment.put("categorie", "Poissons")
        aliment.put("unite_reference", "g")
        aliment.put("quantite_reference", 100)
        aliment.put("kcal", 208)
        aliment.put("proteines", 20)
        aliment.put("glucides", 0)
        aliment.put("lipides", 13)

        db.insert("aliments", null, aliment)
    }
}