package com.avidsen.calypshome

import androidx.annotation.NonNull

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

import java.util.ArrayList
import java.util.Collections

/**
 * Exposes {@link ActivityStarterModule} and {@link EventEmitterModule}  to JavaScript.
 * One {@link ReactPackage} can expose any number of {@link NativeModule}s.
 */
class ActivityStarterReactPackage : ReactPackage {

    @NonNull
    override fun createNativeModules(@NonNull reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = ArrayList<NativeModule>()
        modules.add(ActivityStarterModule(reactContext))
        modules.add(EventEmitterModule(reactContext))
        return modules
    }

    @NonNull
    override fun createViewManagers(@NonNull reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return Collections.emptyList()
    }
}