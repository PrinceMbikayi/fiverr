package com.stellagroup.macalypshome.mobile

import android.content.Context
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.core.FlipperClient
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin
import com.facebook.flipper.plugins.fresco.FrescoFlipperPlugin
import com.facebook.flipper.plugins.inspector.DescriptorMapping
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
import com.facebook.flipper.plugins.react.ReactFlipperPlugin
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.network.NetworkingModule
import okhttp3.OkHttpClient

/**
 * Class responsible of loading Flipper plugins
 * This class is only available in Debug mode
 */
object ReactNativeFlipper {
    @JvmStatic
    fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
        if (FlipperUtils.shouldEnableFlipper(context)) {
            val client: FlipperClient = AndroidFlipperClient.getInstance(context)
            
            client.addPlugin(InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()))
            client.addPlugin(ReactFlipperPlugin())
            client.addPlugin(DatabasesFlipperPlugin(context))
            client.addPlugin(SharedPreferencesFlipperPlugin(context))
            client.addPlugin(CrashReporterPlugin.getInstance())
            
            val networkFlipperPlugin = NetworkFlipperPlugin()
            NetworkingModule.setCustomClientBuilder { builder: OkHttpClient.Builder ->
                builder.addNetworkInterceptor(FlipperOkhttpInterceptor(networkFlipperPlugin))
            }
            client.addPlugin(networkFlipperPlugin)
            client.start()
            
            // Fresco Plugin needs to ensure that ImagePipelineFactory is initialized
            // If you are using Fresco, uncomment the line below
            // client.addPlugin(FrescoFlipperPlugin())
        }
    }
}