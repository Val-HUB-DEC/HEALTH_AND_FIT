package fr.valdecroix.healthandfit

import android.os.Bundle
import android.webkit.WebView
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val webView = WebView(this)

        webView.settings.javaScriptEnabled = true

        webView.loadUrl("file:///android_asset/www/index.html")

        setContentView(webView)
    }
}