package com.pepo2.bridge;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.text.NumberFormat;
import java.text.ParseException;

import javax.annotation.Nonnull;

import androidx.annotation.NonNull;

public class PepoNativeHelper extends ReactContextBaseJavaModule {
    private static final String TAG = "Ost-PepoNativeHelper";

    public PepoNativeHelper(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "PepoNativeHelper";
    }

//    @ReactMethod
//    public void numberFromString(@NonNull String input, @NonNull Callback successCallback, @NonNull Callback errorCallback) {
//        // Always get the NumberFormat Instance.
//        // Locale can change at run time.
//        NumberFormat nf = NumberFormat.getInstance();
//        try {
//            Number convertedNumber = nf.parse(input);
//            successCallback.invoke( convertedNumber.doubleValue() );
//        } catch (Throwable e) {
//            errorCallback.invoke(e.getLocalizedMessage());
//        }
//    }
//
//    @ReactMethod
//    public void stringFromNumber(@NonNull Double input, @NonNull Callback successCallback, @NonNull Callback errorCallback) {
//        // Always get the NumberFormat Instance.
//        // Locale can change at run time.
//        NumberFormat nf = NumberFormat.getInstance();
//        try {
//            String formattedNumber = nf.format(input);
//            successCallback.invoke( formattedNumber );
//        } catch (Throwable e) {
//            errorCallback.invoke(e.getLocalizedMessage());
//        }
//    }

    @ReactMethod
    public void getGroupAndDecimalSeparators(@NonNull Callback successCallback, @NonNull Callback errorCallback) {
        double input = 1000.1;
        // Always get the NumberFormat Instance.
        // Locale can change at run time.
        NumberFormat nf = NumberFormat.getInstance();
        try {
            String formattedNumber = nf.format(input);
            int decimalSeparatorIndex = formattedNumber.length() - 2;

            String decimalSeparator = formattedNumber.substring(decimalSeparatorIndex, decimalSeparatorIndex + 1);
            String groupSeparator = formattedNumber.substring(1, 2);

            if (groupSeparator.equals("0")) {
                groupSeparator = "";
            }

            successCallback.invoke(groupSeparator, decimalSeparator );
        } catch (Throwable e) {
            errorCallback.invoke(e.getLocalizedMessage());
        }

    }

}
