# Pepo 2.0

### Check-points for build

#### API / Endpoints `(src/constants/index.js)`
1. API endpoint
2. Platform endpoint
3. Tracker endpoint

#### Economy / Wallet config `(src/constants/index.js)`
1. Token ID
2. Session key expiry time
3. Spending limit
4. High key session key expiry time

#### Keys / Certificates
1. Twitter Key, Twitter Secret `(src/constants/index.js)`
    1. Twitter Key in iOS `info.plist` - `twitterkit-<secret>`
2. Firebase
    1. iOS: `ios/GoogleService-Info.plist`
    2. Android: `android/app/google-services.json`
    3. In case of iOS, the APN certificate needs to be uploaded to Firebase.
3. Crashlytics: No specific set-up needed as same keys used in all environments.
4. Certificates (for SSL pinning) for API endpoints to be added
    1. iOS: `ios/Pepo2/AppDelegate.m`
    2. Android: `android/app/src/main/res/xml/network_security_config.xml`

#### Website
1. Universal linking set-up 

### Build Instructions (for Android)

- [android/publish_app_production.md](android/publish_app_production.md)
- [android/publish_app_sandbox.md](android/publish_app_sandbox.md)

### Manual installations needed (for iOS)

#### FFmpeg 

1. Download the frameworks from: https://github.com/tanersener/mobile-ffmpeg/releases/download/v4.2.2.LTS/mobile-ffmpeg-min-gpl-4.2.2.LTS-ios-framework.zip
2. Move the unzipped folder to `pepo-react/ios/ReactNativeFFmpeg`

#### Fabric Crashlytics

1. Download the frameworks from: https://s3.amazonaws.com/kits-crashlytics-com/ios/com.twitter.crashlytics.ios/3.13.4/com.crashlytics.ios-manual.zip.
2. Move the unzipped folder to `pepo-react/ios/Crashlytics`
 
You can also use https://fabric.io/kits/ios/crashlytics/manual-install?step=0 to get updated download links if needed.

#### Firebase

1. Download the frameworks from: http://sdk.stagingost.com.s3.amazonaws.com/ThirdPartyFrameworks/Firebase.zip
2. Move the unzipped folder to `pepo-react/ios/Firebase` (all unzipped files and folders should be inside `pepo-react/ios/Firebase`)

You can also use https://github.com/firebase/firebase-ios-sdk/releases/ to get updated download links if needed.
