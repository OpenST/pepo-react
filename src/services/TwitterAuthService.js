import { LoadingModal } from '../theme/components/LoadingModalCover';
import deepGet from 'lodash/get';
import { ostErrors } from './OstErrors';
import InitWalletSdk from './InitWalletSdk';
import NavigationService from './NavigationService';
import Toast from '../theme/components/NotificationToast';

let LoginPopoverActions = null;
import('../components/LoginPopover').then((pack) => {
  LoginPopoverActions = pack.LoginPopoverActions;
});

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

import TwitterAuth from './ExternalLogin/TwitterAuth';

class TwitterAuthService {
  signUp() {
    const oThis = this;
    TwitterAuth.signIn()
      .then((params) => {
        console.log(params);
        if (params) {
          LoadingModal.show('Connecting...');
          CurrentUser.twitterConnect(params)
            .then((res) => {
              if (res.success && res.data) {
                let resultType = deepGet(res, 'data.result_type'),
                  userData = deepGet(res, 'data.' + resultType);
                if (!userData) {
                  LoadingModal.hide();
                  Toast.show({
                    text: ostErrors.getErrorMessage(res),
                    icon: 'error'
                  });
                  return;
                }
                InitWalletSdk.initializeDevice(oThis);
              } else {
                this.onServerError(res);
              }
            })
            .catch((err) => {
              this.onServerError(err);
            });
        } else {
          console.log('No user data!');
        }
      })
      .catch((error) => {
        this.onServerError(error);
      })
      .finally(() => {
        LoginPopoverActions.hide();
      });
  }

  logout() {
    TwitterAuth.signout();
  }

  setupDeviceComplete() {
    LoadingModal.hide();
    if (!CurrentUser.isActiveUser()) {
      NavigationService.navigate('UserActivatingScreen');
    } else {
      NavigationService.navigate('HomeScreen');
    }
  }

  setupDeviceFailed(ostWorkflowContext, error) {
    // this.onServerError(error);
  }

  onServerError(res) {
    LoadingModal.hide();
    Toast.show({
      text: 'Failed to login via Twitter.',
      icon: 'error'
    });
  }
}

export default new TwitterAuthService();
