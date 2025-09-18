# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.views.imagehelper.** { *; }
-keep class com.facebook.react.views.image.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }

# React Native Image Picker
-keep class com.imagepicker.** { *; }

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# React Native Video
-keep class com.brentvatne.react.** { *; }

# React Native WebView
-keep class com.reactnativecommunity.webview.** { *; }

# React Native Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# React Native Firebase Crashlytics
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# React Native Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# React Native Keychain
-keep class com.oblador.keychain.** { *; }

# React Native Device Info
-keep class com.learnium.RNDeviceInfo.** { *; }

# React Native Permissions
-keep class com.zoontek.rnpermissions.** { *; }

# React Native Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# React Native WebRTC
-keep class com.oney.WebRTCModule.** { *; }
-keep class org.webrtc.** { *; }

# React Native Bluetooth
-keep class it.innove.** { *; }
-keep class de.patwoz.rn.bluetoothstatemanager.** { *; }

# React Native Camera/Vision Camera
-keep class com.mrousavy.camera.** { *; }
-keep class org.reactnative.camera.** { *; }

# React Native Config
-keep class com.lugg.ReactNativeConfig.** { *; }

# React Native Localize
-keep class com.zoontek.rnlocalize.** { *; }

# React Native Bootsplash
-keep class com.zoontek.rnbootsplash.** { *; }

# React Native Network Info
-keep class com.pusherman.networkinfo.** { *; }

# React Native Wifi Reborn
-keep class com.reactlibrary.** { *; }

# React Native Google Signin
-keep class co.apptailor.googlesignin.** { *; }

# React Native Orientation Locker
-keep class org.wonday.orientation.** { *; }

# React Native Paper
-keep class com.reactnativepaper.** { *; }

# React Native Async Storage
-keep class com.reactnativeasyncstorage.asyncstorage.** { *; }

# React Native Pager View
-keep class com.reactnativepagerview.** { *; }

# React Native Date Picker
-keep class com.henninghall.date_picker.** { *; }

# React Native Exception Handler
-keep class com.masteratul.exceptionhandler.** { *; }

# React Native UDP
-keep class com.tradle.react.** { *; }

# Lottie React Native
-keep class com.airbnb.android.react.lottie.** { *; }

# React Native BLE Manager
-keep class it.innove.** { *; }

# React Native Blob Util
-keep class com.ReactNativeBlobUtil.** { *; }

# Notifee
-keep class app.notifee.core.** { *; }

# React Native Community Libraries
-keep class com.reactnativecommunity.** { *; }

# React Native Flipper (Development only)
-keep class com.reactnativeflipper.** { *; }
-keep class com.oblador.performance.** { *; }

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Hermes specific rules
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jsi.** { *; }

# JSI Rules
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.jsi.** { *; }

# React Native New Architecture (if enabled)
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.codegen.** { *; }

# Keep model classes (if using data models)
-keep class **.model.** { *; }
-keep class **.dto.** { *; }

# SQLite
-keep class org.sqlite.** { *; }
-keep class org.sqlite.database.** { *; }

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**
