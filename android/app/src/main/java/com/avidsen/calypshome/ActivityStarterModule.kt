package com.avidsen.calypshome

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log

import androidx.annotation.NonNull

import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactNativeHost
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.CatalystInstance
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray

/**
 * Expose Java to JavaScript. Methods annotated with {@link ReactMethod} are exposed.
 */
class ActivityStarterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from JavaScript.
     */
    override fun getName(): String {
        return "ActivityStarter"
    }

    @ReactMethod
    fun navigateToExample() {
        val activity = getCurrentActivity()
        /*
        if (activity != null) {
            Intent intent = new Intent(activity, ExampleActivity.class);
            activity.startActivity(intent);
        }
        */
    }

    @ReactMethod
    fun finishActivity() {
        Log.d("ActivityStarter", "finishActivity called (no params)")
        finishActivityInternal()
    }
    
    @ReactMethod
    fun finishActivity(params: ReadableMap?) {
        Log.d("ActivityStarter", "finishActivity called with params: $params")
        finishActivityInternal()
    }
    
    private fun finishActivityInternal() {
        val activity = getCurrentActivity()
        
        if (activity != null) {
            Log.d("ActivityStarter", "Finishing activity: ${activity.javaClass.simpleName}")
            activity.finish()
        } else {
            Log.d("ActivityStarter", "No current activity to finish")
        }
    }

    @ReactMethod
    fun dialNumber(@NonNull number: String) {
        val activity = getCurrentActivity()
        if (activity != null) {
            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$number"))
            activity.startActivity(intent)
        }
    }

    @ReactMethod
    fun getActivityName(@NonNull callback: Callback) {
        val activity = getCurrentActivity()
        if (activity != null) {
            callback.invoke(activity.javaClass.simpleName)
        } else {
            callback.invoke("No current activity")
        }
    }

    @ReactMethod
    fun getActivityNameAsPromise(promise: Promise) {
        Log.d("ActivityStarter", "getActivityNameAsPromise called (no params)")
        getActivityNameAsPromiseInternal(promise)
    }
    
    @ReactMethod
    fun getActivityNameAsPromise(params: ReadableMap?, promise: Promise) {
        Log.d("ActivityStarter", "getActivityNameAsPromise called with params: $params")
        getActivityNameAsPromiseInternal(promise)
    }
    
    private fun getActivityNameAsPromiseInternal(promise: Promise) {
        val activity = getCurrentActivity()
        
        if (activity != null) {
            val activityName = activity.javaClass.simpleName
            Log.d("ActivityStarter", "Current activity: $activityName")
            promise.resolve(activityName)
        } else {
            Log.d("ActivityStarter", "No current activity found")
            promise.reject("NO_ACTIVITY", "No current activity")
        }
    }

    @ReactMethod
    fun callJavaScript() {
        val activity = getCurrentActivity()
        if (activity != null) {
            val application = activity.application as MainApplication
            val reactNativeHost = application.reactNativeHost
            val reactInstanceManager = reactNativeHost.reactInstanceManager
            val reactContext = reactInstanceManager.currentReactContext

            if (reactContext != null) {
                val catalystInstance = reactContext.catalystInstance
                val params = WritableNativeArray()
                params.pushString("Hello, JavaScript!")

                // AFAIK, this approach to communicate from Java to JavaScript is officially undocumented.
                // Use at own risk; prefer events.
                // Note: Here we call 'alert', which shows UI. If this is done from an activity that
                // doesn't forward lifecycle events to React Native, it wouldn't work.
                catalystInstance.callFunction("JavaScriptVisibleToJava", "alert", params)
            }
        }
    }
}