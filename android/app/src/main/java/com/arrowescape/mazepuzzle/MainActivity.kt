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
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
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
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var adView: AdView? = null
    private var bannerContainer: android.widget.FrameLayout? = null

    // Google AdMob Unit IDs (Official Production Units)
    private val liveRewardedAdUnitId = "ca-app-pub-5048831317905163/6287691180"
    private val liveBannerAdUnitId = "ca-app-pub-5048831317905163/3094462344"

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

        // Initialize Google Mobile Ads SDK
        try {
            MobileAds.initialize(this) { initializationStatus ->
                Log.d("AdMob", "AdMob initialized: ${initializationStatus.adapterStatusMap}")
                runOnUiThread {
                    loadBannerAd()
                    if (liveRewardedAdUnitId.isNotBlank()) loadRewardedAd()
                }
            }
        } catch (e: Exception) {
            Log.e("AdMob", "Error initializing MobileAds", e)
        }

        setupNetworkMonitoring()

        // Native Android Vibrator Setup
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        webView = WebView(this)

        WindowCompat.setDecorFitsSystemWindows(window, false)
        hideSystemUI()

        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(android.graphics.Color.parseColor("#070b14"))

            addView(webView, LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1.0f
            ))

            val density = resources.displayMetrics.density
            val bannerHeightPx = (50 * density).toInt()

            bannerContainer = android.widget.FrameLayout(this@MainActivity).apply {
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    bannerHeightPx
                )
                setBackgroundColor(android.graphics.Color.parseColor("#070b14"))
                visibility = View.VISIBLE
            }
            addView(bannerContainer)
        }
        setContentView(rootLayout)

        loadBannerAd()

        configureWebView()

        // Handle Android Back Navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript(
                    """
                    (function() {
                        const activeModal = document.querySelector('.app-modal.active');
                        if (activeModal) {
                            activeModal.classList.remove('active');
                            return 'modal_closed';
                        }
                        if (window.uiController && window.uiController.currentScreen !== 'screen-menu') {
                            window.uiController.showScreen('screen-menu');
                            return 'screen_back';
                        }
                        return 'exit';
                    })()
                    """.trimIndent()
                ) { result ->
                    val cleanResult = result?.replace("\"", "") ?: "exit"
                    if (cleanResult == "exit") {
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
        settings.allowFileAccess = false
        settings.allowContentAccess = false
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.mediaPlaybackRequiresUserGesture = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Hardware Acceleration for 60/120fps smooth performance
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        webView.overScrollMode = View.OVER_SCROLL_NEVER
        webView.isVerticalScrollBarEnabled = false
        webView.isHorizontalScrollBarEnabled = false
        webView.setBackgroundColor(android.graphics.Color.parseColor("#070b14"))

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
        try { webView.onPause() } catch (_: Exception) {}
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        try { webView.onResume() } catch (_: Exception) {}
        adView?.resume()
    }

    override fun onDestroy() {
        adView?.destroy()
        try { webView.destroy() } catch (_: Exception) {}
        super.onDestroy()
    }

    private var isBannerLoaded = false
    private var isBannerLoading = false
    private var isRewardEarnedForCurrentAd = false

    private fun setupNetworkMonitoring() {
        try {
            val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            val networkRequest = NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .build()

            connectivityManager?.registerNetworkCallback(networkRequest, object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    Log.d("AdMob", "Internet connection active! Loading banner and rewarded ads...")
                    runOnUiThread {
                        if (!isBannerLoaded && !isBannerLoading) {
                            loadBannerAd()
                        }
                        if (rewardedAd == null && !isLoadingRewarded) {
                            loadRewardedAd()
                        }
                    }
                }
            })
        } catch (e: Exception) {
            Log.e("MainActivity", "Error in setupNetworkMonitoring", e)
        }
    }

    private fun loadBannerAd() {
        // If already successfully loaded, keep it persistent and fixed across all screens!
        if (isBannerLoaded && adView != null) {
            bannerContainer?.visibility = View.VISIBLE
            return
        }
        if (isBannerLoading) return
        if (liveBannerAdUnitId.isBlank()) return

        runOnUiThread {
            try {
                isBannerLoading = true
                bannerContainer?.visibility = View.VISIBLE

                // Remove and cleanly destroy any previously failed or outdated AdView
                if (adView != null) {
                    try {
                        bannerContainer?.removeAllViews()
                        adView?.destroy()
                    } catch (e: Exception) {
                        Log.e("AdMob", "Error releasing old AdView", e)
                    }
                    adView = null
                }

                val newAdView = AdView(this).apply {
                    adUnitId = liveBannerAdUnitId
                    setAdSize(AdSize.BANNER)
                    adListener = object : AdListener() {
                        override fun onAdLoaded() {
                            isBannerLoaded = true
                            isBannerLoading = false
                            Log.d("AdMob", "Persistent Banner Ad loaded successfully! ($liveBannerAdUnitId)")
                            bannerContainer?.visibility = View.VISIBLE
                        }
                        override fun onAdFailedToLoad(error: LoadAdError) {
                            isBannerLoading = false
                            isBannerLoaded = false
                            Log.w("AdMob", "Banner failed ($liveBannerAdUnitId): code=${error.code}, message=${error.message}")
                            bannerContainer?.postDelayed({
                                if (!isBannerLoaded) {
                                    loadBannerAd()
                                }
                            }, 30000)
                        }
                    }
                }
                adView = newAdView

                val params = android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    gravity = android.view.Gravity.CENTER
                }
                bannerContainer?.addView(newAdView, params)

                val adRequest = AdRequest.Builder().build()
                newAdView.loadAd(adRequest)
            } catch (e: Exception) {
                isBannerLoading = false
                Log.e("AdMob", "Exception loading banner ad", e)
            }
        }
    }

    private var isLoadingRewarded = false

    private fun loadRewardedAd(onLoaded: (() -> Unit)? = null) {
        if (rewardedAd != null) {
            onLoaded?.invoke()
            return
        }
        if (isLoadingRewarded) return
        if (liveRewardedAdUnitId.isBlank()) return

        isLoadingRewarded = true
        Log.d("AdMob", "Loading Rewarded Ad: $liveRewardedAdUnitId")
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(this, liveRewardedAdUnitId, adRequest, object : RewardedAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) {
                isLoadingRewarded = false
                rewardedAd = null
                Log.w("AdMob", "Live Rewarded Ad failed ($liveRewardedAdUnitId): code=${adError.code}, msg=${adError.message}")
                onLoaded?.invoke()
            }

            override fun onAdLoaded(ad: RewardedAd) {
                isLoadingRewarded = false
                rewardedAd = ad
                Log.d("AdMob", "Rewarded Ad loaded successfully!")
                setupRewardedCallbacks(ad)
                onLoaded?.invoke()
            }
        })
    }

    private fun setupRewardedCallbacks(ad: RewardedAd) {
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Log.d("AdMob", "Rewarded Ad dismissed. Reward earned: $isRewardEarnedForCurrentAd")
                if (!isRewardEarnedForCurrentAd) {
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "تم إغلاق الإعلان قبل اكتماله، لم يتم منح المكافأة.", Toast.LENGTH_SHORT).show()
                    }
                }
                rewardedAd = null
                isRewardEarnedForCurrentAd = false
                loadRewardedAd()
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Log.e("AdMob", "Rewarded Ad failed to show: ${adError.message}")
                rewardedAd = null
                isRewardEarnedForCurrentAd = false
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "تعذر عرض الإعلان! يرجى المحاولة لاحقاً.", Toast.LENGTH_SHORT).show()
                }
                loadRewardedAd()
            }
        }
    }

    fun showRewardedAd(rewardType: String) {
        runOnUiThread {
            isRewardEarnedForCurrentAd = false

            if (rewardedAd != null) {
                rewardedAd?.show(this, OnUserEarnedRewardListener { rewardItem ->
                    isRewardEarnedForCurrentAd = true
                    Log.d("AdMob", "User completed ad and earned reward: ${rewardItem.amount} for $rewardType")
                    runOnUiThread {
                        webView.evaluateJavascript(
                            "if (window.onRewardedAdEarned) { window.onRewardedAdEarned('$rewardType'); }",
                            null
                        )
                    }
                })
            } else {
                Toast.makeText(this, "جاري تحضير الإعلان، ثانية واحدة...", Toast.LENGTH_SHORT).show()
                loadRewardedAd {
                    runOnUiThread {
                        if (rewardedAd != null) {
                            rewardedAd?.show(this@MainActivity, OnUserEarnedRewardListener { rewardItem ->
                                isRewardEarnedForCurrentAd = true
                                Log.d("AdMob", "User completed ad and earned reward: ${rewardItem.amount} for $rewardType")
                                runOnUiThread {
                                    webView.evaluateJavascript(
                                        "if (window.onRewardedAdEarned) { window.onRewardedAdEarned('$rewardType'); }",
                                        null
                                    )
                                }
                            })
                        } else {
                            // STRICT REQUIREMENT: NEVER GIVE REWARD IF AD WAS NOT WATCHED!
                            Toast.makeText(
                                this@MainActivity,
                                "تعذر تحميل الإعلان! تأكد من اتصالك بالإنترنت. (لم يتم منح أي مكافأة)",
                                Toast.LENGTH_LONG
                            ).show()
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
                bannerContainer?.visibility = if (visible) View.VISIBLE else View.GONE
                if (visible && !isBannerLoaded && !isBannerLoading) {
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

        @JavascriptInterface
        fun getDeviceLanguage(): String {
            return try {
                val locale = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    resources.configuration.locales.get(0)
                } else {
                    @Suppress("DEPRECATION")
                    resources.configuration.locale
                }
                locale.language ?: "ar"
            } catch (e: Exception) {
                "ar"
            }
        }
    }
}
