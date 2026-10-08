package fr.valdecroix.healthandfit

import android.content.Context
import android.util.Log
import org.json.JSONObject
import java.io.File
import java.net.URL

class DataUpdater(private val context: Context) {

    private val dossierData = File(
        context.filesDir,
        "data"
    )

    private val fichiersData = listOf(
        "alim.xml",
        "alim_grp.xml",
        "compo.xml",
        "const.xml",
        "sources.xml",
        "version.json"
    )

    // ==========================================
    // VERSION LOCALE
    // ==========================================

    private fun lireVersionLocale(): String? {

        val fichierVersion = File(
            dossierData,
            "version.json"
        )

        if (!fichierVersion.exists()) {
            return null
        }

        return try {

            val json = fichierVersion.readText()
            val objetJson = JSONObject(json)

            objetJson.getString("version")

        } catch (e: Exception) {

            Log.e(
                "DataUpdater",
                "Impossible de lire la version locale",
                e
            )

            null
        }
    }


    // ==========================================
    // VERSION GITHUB
    // ==========================================

    private fun lireVersionGitHub(): String {

        val url = URL(
            "https://github.com/Val-HUB-DEC/HEALTH_AND_FIT/raw/refs/heads/main/data/version.json"
        )

        val json = url.readText()

        val objetJson = JSONObject(json)

        return objetJson.getString("version")
    }


    // ==========================================
    // MISE À JOUR
    // ==========================================

    fun mettreAJourDonnees() {

        Thread {

            try {

                Log.d(
                    "DataUpdater",
                    "===== VÉRIFICATION DATA ====="
                )


                // ------------------------------------------
                // Création du dossier data
                // ------------------------------------------

                if (!dossierData.exists()) {

                    dossierData.mkdirs()

                }


                // ------------------------------------------
                // Version locale
                // ------------------------------------------

                val versionLocale = lireVersionLocale()

                Log.d(
                    "DataUpdater",
                    "Version locale : $versionLocale"
                )


                // ------------------------------------------
                // Version GitHub
                // ------------------------------------------

                val versionGitHub = lireVersionGitHub()

                Log.d(
                    "DataUpdater",
                    "Version GitHub : $versionGitHub"
                )


                // ------------------------------------------
                // Comparaison
                // ------------------------------------------

                if (versionLocale == versionGitHub) {

                    Log.d(
                        "DataUpdater",
                        "Version identique → aucune mise à jour"
                    )

                    return@Thread
                }


                // ------------------------------------------
                // Mise à jour nécessaire
                // ------------------------------------------

                Log.d(
                    "DataUpdater",
                    "Version différente → téléchargement"
                )


                // ------------------------------------------
                // Télécharger les fichiers
                // ------------------------------------------

                for (nomFichier in fichiersData) {

                    val url = URL(
                        "https://github.com/Val-HUB-DEC/HEALTH_AND_FIT/raw/refs/heads/main/data/$nomFichier"
                    )

                    val fichierLocal = File(
                        dossierData,
                        nomFichier
                    )

                    Log.d(
                        "DataUpdater",
                        "Téléchargement : $nomFichier"
                    )

                    url.openStream().use { entree ->

                        fichierLocal.outputStream().use { sortie ->

                            entree.copyTo(sortie)

                        }
                    }
                }


                Log.d(
                    "DataUpdater",
                    "===== DONNÉES MISES À JOUR ====="
                )

            } catch (e: Exception) {

                Log.e(
                    "DataUpdater",
                    "Erreur pendant la mise à jour des données",
                    e
                )
            }

        }.start()
    }
}