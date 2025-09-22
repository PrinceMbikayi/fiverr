package com.avidsen.calypshome

import androidx.annotation.NonNull
import androidx.annotation.Nullable

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule

import java.util.HashMap

/**
 * Supports sending events to JavaScript.
 */
class EventEmitterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private var eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

        /**
         * To pass a JavaScript object instead of a simple string, create a {@link WritableNativeMap} and populate it.
         */
        fun emitEvent(@NonNull message: String) {
            eventEmitter?.emit("MyEventValue", message)
        }
    }

    override fun initialize() {
        super.initialize()
        eventEmitter = reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    }

    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from JavaScript.
     */
    override fun getName(): String {
        return "EventEmitter"
    }

    @Nullable
    override fun getConstants(): Map<String, Any>? {
        val constants = HashMap<String, Any>()
        constants["MyEventName"] = "MyEventValue"
        return constants
    }
}