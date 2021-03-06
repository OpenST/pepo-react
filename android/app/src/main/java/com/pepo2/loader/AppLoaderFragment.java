package com.pepo2.loader;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.ost.walletsdk.ui.loader.OstLoaderFragment;
import com.ost.walletsdk.ui.loader.OstWorkflowLoader;
import com.ost.walletsdk.ui.uicomponents.uiutils.content.StringConfig;
import com.ost.walletsdk.ui.workflow.OstLoaderCompletionDelegate;
import com.ost.walletsdk.workflows.OstContextEntity;
import com.ost.walletsdk.workflows.OstWorkflowContext;
import com.ost.walletsdk.workflows.errors.OstError;
import com.pepo2.R;

import org.json.JSONObject;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;


public class AppLoaderFragment extends OstLoaderFragment implements OstWorkflowLoader {
    private HeartBeatView heartBeatView;
    private boolean mViewActive;
    private String mLoaderString = "Loading...";
    private TextView mLoaderTextView;
    private AppProgress mProgressHorizontal;
    private ViewGroup mViewGroup;
    private Button mStatusButton;
    private View mStatusImageView;

    public static AppLoaderFragment newInstance() {
        return new AppLoaderFragment();
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle(DialogFragment.STYLE_NORMAL, R.style.FullScreenDialogStyle);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        mViewGroup = (ViewGroup) inflater.inflate(R.layout.fragment_app_loader, container, false);
        mViewActive = true;
        heartBeatView = mViewGroup.findViewById(R.id.progressBar);
        mLoaderTextView = mViewGroup.findViewById(R.id.loaderText);
        mProgressHorizontal = mViewGroup.findViewById(R.id.progressBarIndef);

        mStatusButton = mViewGroup.findViewById(R.id.statusButton);
        mStatusImageView = mViewGroup.findViewById(R.id.statusImageView);

        mLoaderTextView.setText(mLoaderString);
        return mViewGroup;
    }

    public void setLoaderString(String loaderString) {
        mLoaderString = loaderString;
    }

    @Override
    public void onInitLoader(JSONObject contentConfig) {
        if (mViewActive) {
            hideStatus();

            showLoader();
        }
    }

    @Override
    public void onPostAuthentication(JSONObject contentConfig) {
        if (mViewActive) {
            hideStatus();

            showLoader();
        }
    }

    @Override
    public void onAcknowledge(JSONObject contentConfig) {
        StringConfig stringConfig = StringConfig.instance(contentConfig.optJSONObject("acknowledge"));
        mLoaderTextView.setText(stringConfig.getString());
    }

    @Override
    public void onSuccess(OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity, JSONObject contentConfig, final OstLoaderCompletionDelegate delegate) {
        if (mViewActive) {

            hideLoader();

            showSuccessStatus(ostWorkflowContext, ostContextEntity, contentConfig);

            Runnable dismissWorkflow = new Runnable() {
                @Override
                public void run() {
                    if (null != delegate) delegate.dismissWorkflow();
                }
            };
            Handler handler = new Handler(Looper.getMainLooper());
            handler.postDelayed(dismissWorkflow,3000);

            mViewGroup.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    delegate.dismissWorkflow();
                    handler.removeCallbacks(dismissWorkflow);
                }
            });
        }
    }

    @Override
    public void onFailure(OstWorkflowContext ostWorkflowContext, OstError ostError, JSONObject contentConfig, final OstLoaderCompletionDelegate delegate) {
        if (mViewActive) {

            hideLoader();

            showFailureStatus(ostWorkflowContext, ostError, delegate);

            View.OnClickListener listener = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    delegate.dismissWorkflow();
                }
            };
            mViewGroup.setOnClickListener(listener);
            mStatusButton.setOnClickListener(listener);
        }
    }

    private void hideStatus() {
        mStatusButton.setVisibility(View.GONE);
        mStatusImageView.setVisibility(View.GONE);
    }

    private void showSuccessStatus(OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity, JSONObject contentConfig) {
        mStatusImageView.setVisibility(View.VISIBLE);
        mStatusButton.setVisibility(View.GONE);
        mLoaderTextView.setVisibility(View.VISIBLE);


        StringConfig stringConfig = StringConfig.instance(contentConfig.optJSONObject("success"));
        mLoaderTextView.setText(stringConfig.getString());

        mStatusImageView.setBackground(getResources().getDrawable(R.drawable.toast_success, null));
    }

    private void showFailureStatus(OstWorkflowContext ostWorkflowContext, OstError ostError, OstLoaderCompletionDelegate delegate) {
        mStatusImageView.setVisibility(View.VISIBLE);
        mStatusButton.setVisibility(View.VISIBLE);
        mLoaderTextView.setVisibility(View.VISIBLE);

        mLoaderTextView.setText(new OstSdkErrors().getErrorMessage(ostWorkflowContext, ostError));
        mStatusImageView.setBackground(getResources().getDrawable(R.drawable.toast_error, null));

        if (new OstSdkErrors().isApiSignerUnauthorized(ostError)) {
            delegate.dismissWorkflow();
            return;
        }
        mStatusButton.setText("Dismiss");
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        mViewActive = false;
    }

    private void showLoader() {
        heartBeatView.setVisibility(View.VISIBLE);
        mLoaderTextView.setVisibility(View.VISIBLE);
        heartBeatView.start();
        mProgressHorizontal.start();
    }

    private void hideLoader() {
        heartBeatView.setVisibility(View.GONE);
        heartBeatView.stop();
        mProgressHorizontal.setVisibility(View.GONE);
        mProgressHorizontal.stop();
    }
}
