import CurrentUser from '../models/CurrentUser';
import NavigationService from '../services/NavigationService';
import Utilities from '../services/Utilities';

export default class NavigateTo {
  constructor(navigation) {
    this.navigation = navigation;
  }

  navigate(goToObject, payload) {
    goToObject = goToObject || {};
    if (goToObject && goToObject.pn == 'p') {
      this.goToProfilePage(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn == 'cb') {
      this.goToSupporters(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn == 'v') {
      this.goToVideo(goToObject.v.vid, payload);
    } else if (goToObject && goToObject.pn == 'f') {
      this.navigation.navigate('Home', { payload: payload });
    } else if (goToObject && goToObject.pn == 'nc') {
      this.navigation.navigate('Notification', { payload: payload });
    } else if (goToObject.pn == 'e') {
      if (this.navigation) {
        this.navigation.push('AddEmailScreen', { payload: payload });
      } else {
        NavigationService.navigate('AddEmailScreen', { payload: payload });
      }
    }
  }

  goToVideo = (vId, payload) => {
    this.navigation.push('VideoPlayer', {
      videoId: vId,
      payload: payload
    });
  };

  goToSupporters = (profileId, payload) => {
    console.log('goToSupporters', profileId);
    this.navigation.push('SupportersListScreen', { userId: profileId, payload: payload });
  };

  goToProfilePage = (id, payload) => {
    if (id == CurrentUser.getUserId()) {
      this.navigation.navigate('ProfileScreen', { payload: payload });
    } else {
      this.navigation.push('UsersProfileScreen', { userId: id, payload: payload });
    }
  };
}
