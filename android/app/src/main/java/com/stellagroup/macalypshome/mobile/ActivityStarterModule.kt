package com.stellagroup.macalypshome.mobile

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ActivityStarterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ActivityStarter"
    }

    @ReactMethod
    fun startCustomActivity(promise: Promise) {
        try {
            val intent = Intent(currentActivity, CustomActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            currentActivity?.startActivity(intent)
            promise.resolve("Activity started successfully")
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to start activity: ${e.message}")
        }
    }
}