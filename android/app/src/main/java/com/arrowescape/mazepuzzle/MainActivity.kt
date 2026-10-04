package com.arrowescape.mazepuzzle

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.OnUserEarnedRewardListener
import com.google.android.gms.ads.RequestConfiguration
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var adView: AdView? = null
    private val liveRewardedAdUnitId = "ca-app-pub-9778007569149797/8955285387"
    private val testRewardedAdUnitId = "ca-app-pub-3940256099942544/5224354917"

    private val liveBannerAdUnitId = "ca-app-pub-9778007569149797/1459938748"
    private val testBannerAdUnitId = "ca-app-pub-3940256099942544/6300978111"

    private var rewardedAd: RewardedAd? = null
    private var vibrator: Vibrator? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        )

        // Fullscreen immersive mode & keep screen awake during play
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Configure Test Device IDs for Emulators & Testing
        try {
            val requestConfiguration = RequestConfiguration.Builder()
                .setTestDeviceIds(listOf(AdRequest.DEVICE_ID_EMULATOR))
                .build()
            MobileAds.setRequestConfiguration(requestConfiguration)
        } catch (e: Exception) {
            Log.e("AdMob", "Error setting RequestConfiguration", e)
        }

        // Initialize Google Mobile Ads SDK & load ads once initialization completes
        try {
            MobileAds.initialize(this) { initializationStatus ->
                Log.d("AdMob", "AdMob initialized: ${initializationStatus.adapterStatusMap}")
                runOnUiThread {
                    loadRewardedAd()
                    loadBannerAd()
                }
            }
        } catch (e: Exception) {
            Log.e("AdMob", "Error initializing MobileAds", e)
        }

        // Native Android Vibrator Setup
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        webView = WebView(this)

        // Native Google AdMob Banner Setup (Visible by default at bottom of screen)
        adView = AdView(this).apply {
            adUnitId = liveBannerAdUnitId
            setAdSize(AdSize.BANNER)
            visibility = View.VISIBLE
            adListener = object : AdListener() {
                override fun onAdLoaded() {
                    Log.d("AdMob", "Live Banner Ad loaded successfully!")
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    Log.w("AdMob", "Live Banner failed: code=${error.code}, message=${error.message}. Retrying with test banner...")
                    loadTestBannerAd()
                }
                override fun onAdOpened() {
                    Log.d("AdMob", "Banner Ad opened")
                }
            }
        }

        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(webView, LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1.0f
            ))
            addView(adView, LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ))
        }
        setContentView(rootLayout)
        hideSystemUI()

        configureWebView()

        // Handle Android Back Navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript(
                    "if (window.uiController && window.uiController.currentScreen !== 'screen-menu') { window.uiController.showScreen('screen-menu'); true; } else { false; }"
                ) { result ->
                    if (result != "true") {
                        finish()
                    }
                }
            }
        })

        // Asset Loader: Serves local Android assets securely with ZERO server and ZERO internet
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }
        }

        // Runs 100% locally from the APK assets - NO SERVER NEEDED
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.mediaPlaybackRequiresUserGesture = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        @Suppress("DEPRECATION")
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH)

        // Hardware Acceleration for 60/120fps smooth performance
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

        // Native Kotlin Bridge
        webView.addJavascriptInterface(AndroidGameBridge(), "AndroidNative")

        webView.webChromeClient = WebChromeClient()
    }

    private fun hideSystemUI() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val controller = WindowCompat.getInsetsController(window, window.decorView)
                controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                controller.hide(WindowInsetsCompat.Type.systemBars())
            } else {
                @Suppress("DEPRECATION")
                window.decorView.systemUiVisibility = (
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                )
            }
        } catch (e: Exception) {
            Log.e("MainActivity", "Error in hideSystemUI", e)
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            hideSystemUI()
        }
    }

    override fun onPause() {
        adView?.pause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        adView?.resume()
    }

    override fun onDestroy() {
        adView?.destroy()
        super.onDestroy()
    }

    private fun loadBannerAd() {
        try {
            val adRequest = AdRequest.Builder().build()
            adView?.loadAd(adRequest)
        } catch (e: Exception) {
            Log.e("AdMob", "Exception loading banner ad", e)
        }
    }

    private fun loadTestBannerAd() {
        runOnUiThread {
            try {
                val parent = adView?.parent as? LinearLayout ?: return@runOnUiThread
                val index = parent.indexOfChild(adView)
                parent.removeView(adView)
                adView?.destroy()

                adView = AdView(this).apply {
                    adUnitId = testBannerAdUnitId
                    setAdSize(AdSize.BANNER)
                    visibility = View.VISIBLE
                    adListener = object : AdListener() {
                        override fun onAdLoaded() {
                            Log.d("AdMob", "Test Banner Ad loaded successfully!")
                        }
                        override fun onAdFailedToLoad(error: LoadAdError) {
                            Log.e("AdMob", "Test Banner failed to load: ${error.message}")
                        }
                    }
                }
                parent.addView(adView, index, LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ))
                val adRequest = AdRequest.Builder().build()
                adView?.loadAd(adRequest)
            } catch (e: Exception) {
                Log.e("AdMob", "Error switching to test banner", e)
            }
        }
    }

    private var isLoadingRewarded = false

    private fun loadRewardedAd(useTestUnit: Boolean = false, onLoaded: (() -> Unit)? = null) {
        if (rewardedAd != null) {
            onLoaded?.invoke()
            return
        }
        if (isLoadingRewarded) return

        val targetUnitId = if (useTestUnit) testRewardedAdUnitId else liveRewardedAdUnitId
        isLoadingRewarded = true
        Log.d("AdMob", "Loading Rewarded Ad: $targetUnitId (useTestUnit=$useTestUnit)")
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(this, targetUnitId, adRequest, object : RewardedAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) {
                isLoadingRewarded = false
                rewardedAd = null
                Log.w("AdMob", "Rewarded Ad failed ($targetUnitId): code=${adError.code}, msg=${adError.message}")

                if (!useTestUnit) {
                    Log.d("AdMob", "Live unit unavailable (app unreleased or new unit). Retrying with Google Test Rewarded Ad...")
                    runOnUiThread {
                        loadRewardedAd(useTestUnit = true, onLoaded = onLoaded)
                    }
                } else {
                    onLoaded?.invoke()
                }
            }

            override fun onAdLoaded(ad: RewardedAd) {
                isLoadingRewarded = false
                rewardedAd = ad
                Log.d("AdMob", "Rewarded Ad loaded successfully! (Unit: $targetUnitId)")
                ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        Log.d("AdMob", "Rewarded Ad dismissed")
                        rewardedAd = null
                        loadRewardedAd(useTestUnit = false)
                    }
                    override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                        Log.e("AdMob", "Rewarded Ad failed to show: ${adError.message}")
                        rewardedAd = null
                        loadRewardedAd(useTestUnit = false)
                    }
                }
                onLoaded?.invoke()
            }
        })
    }

    fun showRewardedAd(rewardType: String) {
        runOnUiThread {
            if (rewardedAd != null) {
                rewardedAd?.show(this, OnUserEarnedRewardListener {
                    webView.evaluateJavascript(
                        "if (window.onRewardedAdEarned) { window.onRewardedAdEarned('$rewardType'); }",
                        null
                    )
                })
            } else {
                Toast.makeText(this, "جاري تحضير الإعلان، ثانية واحدة...", Toast.LENGTH_SHORT).show()
                loadRewardedAd(useTestUnit = true) {
                    runOnUiThread {
                        if (rewardedAd != null) {
                            rewardedAd?.show(this@MainActivity, OnUserEarnedRewardListener {
                                webView.evaluateJavascript(
                                    "if (window.onRewardedAdEarned) { window.onRewardedAdEarned('$rewardType'); }",
                                    null
                                )
                            })
                        } else {
                            // If ad genuinely cannot load (no internet), grant reward so player is not blocked
                            Toast.makeText(this@MainActivity, "تم منح المكافأة لعدم توفر إعلان حالياً", Toast.LENGTH_SHORT).show()
                            webView.evaluateJavascript(
                                "if (window.onRewardedAdEarned) { window.onRewardedAdEarned('$rewardType'); }",
                                null
                            )
                        }
                    }
                }
            }
        }
    }

    inner class AndroidGameBridge {
        @JavascriptInterface
        fun vibrate(durationMs: Long) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(durationMs)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
            }
        }

        @JavascriptInterface
        fun setBannerVisible(visible: Boolean) {
            runOnUiThread {
                adView?.visibility = if (visible) View.VISIBLE else View.GONE
                if (visible) {
                    loadBannerAd()
                }
            }
        }

        @JavascriptInterface
        fun showRewardedAd(rewardType: String) {
            this@MainActivity.showRewardedAd(rewardType)
        }

        @JavascriptInterface
        fun shareText(title: String, text: String) {
            runOnUiThread {
                try {
                    val shareIntent = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(android.content.Intent.EXTRA_SUBJECT, title)
                        putExtra(android.content.Intent.EXTRA_TEXT, text)
                    }
                    startActivity(android.content.Intent.createChooser(shareIntent, title))
                } catch (e: Exception) {
                    Log.e("MainActivity", "Error sharing text", e)
                }
            }
        }
    }
}
