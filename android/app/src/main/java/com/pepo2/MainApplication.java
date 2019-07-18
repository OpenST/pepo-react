package com.pepo2;

import android.app.Application;

import com.arthenica.reactnative.RNFFmpegPackage;
import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import me.hauvo.thumbnail.RNThumbnailPackage;
import org.reactnative.camera.RNCameraPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.ostwalletrnsdk.OstWalletRnSdkPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new LinearGradientPackage(),
            new TwitterSigninPackage(),
            new ReactVideoPackage(),
            new RNThumbnailPackage(),
            new RNCameraPackage(),
            new FastImageViewPackage(),
            new NetInfoPackage(),
            new OstWalletRnSdkPackage(),
            new RNFSPackage(),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
            new RNFFmpegPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
