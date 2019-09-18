import PepoApi from '../services/PepoApi';
import Toast from '../theme/components/NotificationToast';
import AppConfig from '../constants/AppConfig';
import { ostErrors } from '../services/OstErrors';

function fetchUser(userId, onResponse, errorCallback, finallyCallback) {
  new PepoApi(`/users/${userId}/profile`)
    .get()
    .then((res) => {
      if (onResponse) {
        onResponse(res);
      } else {
        if (!res || !res.success) {
          Toast.show({
            text: ostErrors.getErrorMessage(res),
            icon: 'error'
          });
        }
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      } else {
        Toast.show({
          text: ostErrors.getErrorMessage(error),
          icon: 'error'
        });
      }
    })
    .finally(() => {
      finallyCallback && finallyCallback();
    });
}

function getSocialIcon(url, screen) {
  let hostName = url && url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?([^:\/?\n]+)/im);
  if ( !hostName || hostName.length < 2) {
    return;
  }
  hostName = hostName[1];
  if (hostName) {
    for (let domainName in AppConfig.videoLinkConfig.WHITELISTED_DOMAINS) {
      if (hostName.includes(AppConfig.videoLinkConfig.WHITELISTED_DOMAINS[domainName])) {
        return AppConfig.videoLinkConfig[screen].SOCIAL_ICONS[domainName];
      }
    }
  }
  return AppConfig.videoLinkConfig[screen].SOCIAL_ICONS.DEFAULT;
}

export { fetchUser, getSocialIcon };
