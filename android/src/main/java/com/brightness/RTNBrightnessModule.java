package com.brightness;

import android.database.ContentObserver;
import android.os.Handler;
import android.provider.Settings;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@ReactModule(name = RTNBrightnessModule.NAME)
public class RTNBrightnessModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RTNBrightness";
  private int listenerCount = 0;
  private ContentObserver contentObserver;

  public RTNBrightnessModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }


  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void resetBrightness() {
    getCurrentActivity().runOnUiThread(() -> {
      var window = getCurrentActivity().getWindow();
      WindowManager.LayoutParams layoutParams = window.getAttributes();
      layoutParams.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
      window.setAttributes(layoutParams);
    });
  }

  @ReactMethod
  public void getSysBrightness(Promise promise) {
    try {
      var brightness = Settings.System.getInt(getCurrentActivity().getContentResolver(), Settings.System.SCREEN_BRIGHTNESS);
      promise.resolve(brightness / 255f);
    } catch (Settings.SettingNotFoundException e) {
      e.printStackTrace();
      promise.resolve(0);
    }
  }

  @ReactMethod
  public void getAppBrightness(Promise promise) {
    WindowManager.LayoutParams lp = getCurrentActivity().getWindow().getAttributes();
    promise.resolve(lp.screenBrightness);
  }

  @ReactMethod
  public void setAppBrightness(float brightness) {
    getCurrentActivity().runOnUiThread(() -> {
      var window = getCurrentActivity().getWindow();
      WindowManager.LayoutParams layoutParams = window.getAttributes();
      layoutParams.screenBrightness = brightness;
      window.setAttributes(layoutParams);
    });
  }

  private void sendEvent(
    String eventName,
    @Nullable WritableMap params) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @Override
  public void initialize() {
    contentObserver = new ContentObserver(new Handler()) {
      @Override
      public void onChange(boolean selfChange) {
        int brightness = Settings.System.getInt(getCurrentActivity().getContentResolver(), Settings.System.SCREEN_BRIGHTNESS, 0);

        WritableMap params = Arguments.createMap();
        params.putDouble("brightness", brightness / 255f);
        sendEvent("Sys_Brightness_Change", params);
      }
    };
  }

  @ReactMethod
  public void addListener(String eventName) {
    if (listenerCount == 0) {
      // Set up any upstream listeners or background tasks as necessary
      getCurrentActivity().getContentResolver().registerContentObserver(
        Settings.System.getUriFor(Settings.System.SCREEN_BRIGHTNESS),
        false, contentObserver);
    }

    listenerCount += 1;
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    listenerCount -= count;
    if (listenerCount == 0) {
      // Remove upstream listeners, stop unnecessary background tasks
      getCurrentActivity().getContentResolver().unregisterContentObserver(contentObserver);
    }
  }
}
