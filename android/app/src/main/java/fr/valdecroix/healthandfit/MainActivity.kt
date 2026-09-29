package fr.valdecroix.healthandfit

import android.os.Bundle
import android.util.Log
import android.webkit.WebView
import androidx.activity.ComponentActivity
import java.io.File
import java.io.FileOutputStream
import java.net.URL
import kotlin.concurrent.thread
import org.json.JSONObject
import androidx.webkit.WebViewAssetLoader


class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)

        webView.settings.javaScriptEnabled = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler(
                "/web/",
                WebViewAssetLoader.InternalStoragePathHandler(
                    this,
                    File(filesDir, "web")
                )
            )
            .build()

        webView.webViewClient = object : android.webkit.WebViewClient() {

            override fun shouldInterceptRequest(
                view: WebView,
                request: android.webkit.WebResourceRequest
            ): android.webkit.WebResourceResponse? {

                return assetLoader.shouldInterceptRequest(request.url)
            }
        }

        setContentView(webView)

        telechargerSite(webView)
    }


    // ==========================================
    // TÉLÉCHARGEMENT COMPLET DU SITE
    // ==========================================
    private fun lireVersionLocale(): String? {

        val fichierVersion = File(
            filesDir,
            "web/version.json"
        )

        if (!fichierVersion.exists()) {
            return null
        }

        val json = fichierVersion.readText()

        val objetJson = JSONObject(json)

        return objetJson.getString("version")
    }

    private fun lireVersionGitHub(): String {

        val url = URL(
            "https://github.com/Val-HUB-DEC/HEALTH_AND_FIT/raw/refs/heads/main/web/version.json"
        )

        val json = url.readText()

        val objetJson = JSONObject(json)

        return objetJson.getString("version")
    }
    private fun telechargerSite(webView: WebView) {

        thread {

            try {

                Log.d(
                    "HEALTH_FIT",
                    "Vérification de la version"
                )

                // ------------------------------------------
                // 1. Lire les versions
                // ------------------------------------------

                val versionGitHub = lireVersionGitHub()

                Log.d(
                    "HEALTH_FIT",
                    "Version GitHub : $versionGitHub"
                )

                val versionLocale = lireVersionLocale()

                Log.d(
                    "HEALTH_FIT",
                    "Version locale : $versionLocale"
                )


                // ------------------------------------------
                // 2. Dossier local du site
                // ------------------------------------------

                val dossierWeb = File(
                    filesDir,
                    "web"
                )


                // ------------------------------------------
                // 3. Vérifier si une mise à jour est nécessaire
                // ------------------------------------------

                if (
                    versionLocale == versionGitHub &&
                    dossierWeb.exists()
                ) {

                    Log.d(
                        "HEALTH_FIT",
                        "Version identique → aucune mise à jour"
                    )

                } else {

                    Log.d(
                        "HEALTH_FIT",
                        "Mise à jour nécessaire"
                    )


                    // ------------------------------------------
                    // 4. Récupérer la liste des fichiers GitHub
                    // ------------------------------------------

                    val url = URL(
                        "https://api.github.com/repos/Val-HUB-DEC/HEALTH_AND_FIT/git/trees/main?recursive=1"
                    )

                    val json = url.readText()

                    val objetJson = JSONObject(json)

                    val arbre = objetJson.getJSONArray("tree")


                    // ------------------------------------------
                    // 5. Supprimer l'ancien site
                    // ------------------------------------------

                    if (dossierWeb.exists()) {

                        dossierWeb.deleteRecursively()

                    }

                    dossierWeb.mkdirs()


                    // ------------------------------------------
                    // 6. Télécharger tout le dossier web
                    // ------------------------------------------

                    for (i in 0 until arbre.length()) {

                        val fichier =
                            arbre.getJSONObject(i)

                        val chemin =
                            fichier.getString("path")

                        val type =
                            fichier.getString("type")


                        if (
                            chemin.startsWith("web/") &&
                            type == "blob"
                        ) {

                            val cheminLocal =
                                chemin.removePrefix("web/")


                            val fichierLocal =
                                File(
                                    dossierWeb,
                                    cheminLocal
                                )


                            fichierLocal.parentFile?.mkdirs()


                            val urlFichier = URL(
                                "https://github.com/Val-HUB-DEC/HEALTH_AND_FIT/raw/refs/heads/main/$chemin"
                            )


                            Log.d(
                                "HEALTH_FIT",
                                "Téléchargement : $chemin"
                            )


                            urlFichier.openStream().use { input ->

                                FileOutputStream(
                                    fichierLocal
                                ).use { output ->

                                    input.copyTo(output)

                                }

                            }

                        }

                    }


                    Log.d(
                        "HEALTH_FIT",
                        "Mise à jour terminée"
                    )

                }


                // ------------------------------------------
                // 7. Ouvrir le site
                // ------------------------------------------

                runOnUiThread {

                    Log.d(
                        "HEALTH_FIT",
                        "Ouverture du site"
                    )

                    webView.loadUrl(
                        "https://appassets.androidplatform.net/web/index.html"
                    )

                }


            } catch (e: Exception) {

                Log.e(
                    "HEALTH_FIT",
                    "Erreur pendant la mise à jour",
                    e
                )

            }

        }

    }
}