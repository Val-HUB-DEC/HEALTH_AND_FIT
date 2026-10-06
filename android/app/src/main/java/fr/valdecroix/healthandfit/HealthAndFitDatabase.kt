package fr.valdecroix.healthandfit

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class HealthAndFitDatabase(context: Context) :
    SQLiteOpenHelper(
        context,
        "health_and_fit.db",
        null,
        1
    ) {

    override fun onCreate(db: SQLiteDatabase) {

        // ==========================================
        // ALIMENTS DE BASE
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE aliments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                categorie TEXT NOT NULL,
                unite_reference TEXT NOT NULL,
                quantite_reference REAL NOT NULL,
                kcal REAL NOT NULL,
                proteines REAL NOT NULL,
                glucides REAL NOT NULL,
                lipides REAL NOT NULL
            )
            """.trimIndent()
        )


        // ==========================================
        // ALIMENTS AJOUTÉS PAR L'UTILISATEUR
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE aliments_personnels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                categorie TEXT NOT NULL,
                unite_reference TEXT NOT NULL,
                quantite_reference REAL NOT NULL,
                kcal REAL NOT NULL,
                proteines REAL NOT NULL,
                glucides REAL NOT NULL,
                lipides REAL NOT NULL
            )
            """.trimIndent()
        )


        // ==========================================
        // CONSOMMATIONS
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE consommations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                repas TEXT NOT NULL,
                aliment_id INTEGER,
                aliment_personnel_id INTEGER,
                quantite REAL NOT NULL
            )
            """.trimIndent()
        )


        // ==========================================
        // PROFIL
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE profil (
                id INTEGER PRIMARY KEY,
                prenom TEXT,
                age INTEGER,
                sexe TEXT,
                taille REAL
            )
            """.trimIndent()
        )


        // ==========================================
        // OBJECTIFS
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE objectifs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date_debut TEXT NOT NULL,
                poids_initial REAL,
                poids_cible REAL,
                objectif TEXT,
                calories_cible REAL,
                proteines_cible REAL,
                glucides_cible REAL,
                lipides_cible REAL
            )
            """.trimIndent()
        )


        // ==========================================
        // POIDS
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE poids (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                poids REAL NOT NULL
            )
            """.trimIndent()
        )


        // ==========================================
        // ACTIVITÉS
        // ==========================================

        db.execSQL(
            """
            CREATE TABLE activites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                duree REAL,
                distance REAL,
                calories REAL
            )
            """.trimIndent()
        )
    }


    override fun onUpgrade(
        db: SQLiteDatabase,
        ancienneVersion: Int,
        nouvelleVersion: Int
    ) {

        // Pour l'instant, la base n'a qu'une seule version.
        // Nous ajouterons ici les migrations lorsque
        // la structure évoluera.

    }
}