import deepGet from 'lodash/get';

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
import Utilities from './Utilities';
import AppConfig from '../constants/AppConfig';
import NavigationService from './NavigationService';

class TwitterAuthService {
  signUp() {
    TwitterAuth.signIn()
      .then((params) => {
        if (params) {
          //TODO @preshita Create worker as well
          let inviteCode = Utilities.getItem(AppConfig.appInstallInviteCodeASKey);
          if (inviteCode) {
            params['invite_code'] = inviteCode;
          }
          CurrentUser.twitterConnect(params)
            .then((res) => {
              if (res && res.success) {
                this.onSuccess(res);
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
        //Close After delay to avoid flickers
        setTimeout(() => {
          LoginPopoverActions.hide();
        }, 300);
      });
  }

  onSuccess(res) {
    if (this.handleGoTo(res)) {
      return;
    }
    Utilities.navigationDecision();
  }

  logout() {
    TwitterAuth.signOut();
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Failed to login via Twitter.',
      icon: 'error'
    });
  }

  handleGoTo(res) {
    //On success goto can be handled by the generic utility
    if (Utilities.handleGoTo(res)) {
      return true;
    }
    //TODO @preshita
    //Is error and error for invite code
    if (res && deepGet(res, 'err.error_data.invite_code')) {
      //Goto invite screen
      NavigationService.navigate('InviteCode');
      return true;
    }
    return false;
    //DOnt forget to return true or false ,if handleGoTo has taken a decission return true or false
  }
}

export default new TwitterAuthService();
