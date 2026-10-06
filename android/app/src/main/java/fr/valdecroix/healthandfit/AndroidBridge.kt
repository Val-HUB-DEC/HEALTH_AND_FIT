package fr.valdecroix.healthandfit

import android.content.Context
import android.webkit.JavascriptInterface

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
}