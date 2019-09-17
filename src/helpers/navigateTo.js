import deepGet from 'lodash/get';
import CurrentUser from '../models/CurrentUser';
import NavigationService from '../services/NavigationService';

class NavigateTo {
  constructor() {
    this.navigation = null;
    this.goTo = null;
  }

  navigate(goToObject, navigation, payload) {
    goToObject = goToObject || {};
    if (navigation) {
      this.navigation = navigation;
    }
    if (goToObject && goToObject.pn == 'p') {
      this.goToProfilePage(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn == 'cb') {
      this.goToSupporters(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn == 'v') {
      this.goToVideo(goToObject.v.vid, payload);
    } else if (goToObject && goToObject.pn == 'f') {
      this.__navigate('Home', payload );
    } else if (goToObject && goToObject.pn == 'nc') {
      this.__navigate('Notification', payload );
    } else if (goToObject.pn == 'e') {
      this.__push('AddEmailScreen', payload );
    }
  }

  goToVideo = (vId, payload) => {
    payload =  payload || {}
    payload['videoId'] = vId ;
    this.__push('VideoPlayer',payload);
  };

  goToSupporters = (profileId, payload) => {
    payload =  payload || {}
    payload['userId'] = profileId ;
    this.__push('SupportersListScreen', payload );
  };

  goToProfilePage = (id, payload) => {
    if (id == CurrentUser.getUserId()) {
      this.__navigate('ProfileScreen',  payload );
    } else {
      payload =  payload || {}
      payload['userId'] = id ;
      this.__push('UsersProfileScreen', payload);
    }
  };

  handleGoTo(res, navigation, payload) {
    if (!res) return;
    let isGoto = !!deepGet(res, 'data.go_to.pn');
    if (isGoto) {
      //Just to avoid goback conflict, excequte last.
      setTimeout(() => {
        this.navigate(res.data.go_to, navigation, payload);
      }, 0);
      return true;
    }
    return false;
  }

  navigationDecision(noFallBack) {
    if (CurrentUser.getUser() && !CurrentUser.isActiveUser()) {
      this.__navigate('UserActivatingScreen');
      return;
    }
    this.goToNavigationDecision(noFallBack);
  }

  goToNavigationDecision(noFallBack) {
    if (this.__isGoto()) {
      this.navigate(this.getGoTo());
      this.clearGoTo();
    } else {
      !noFallBack && this.__navigate('HomeScreen');
    }
  }

  __navigate(screenName ,  payload ){
    if(!screenName) return ;
    if(this.navigation){
      this.navigation.navigate(screenName, payload);
    }else{
      NavigationService.navigate(screenName, payload );
    }
  }

  __push(screenName, payload) {
    if (!screenName) return;
    if (this.navigation) {
      this.navigation.navigate(screenName, { payload: payload });
    } else {
      NavigationService.push(screenName, { payload: payload });
    }
  }

  setGoTo(goTo) {
    this.goTo = goTo;
  }

  getGoTo() {
    return this.goTo;
  }

  clearGoTo() {
    this.goTo = null;
  }

  __isGoto() {
    return this.goTo && Object.keys(this.goTo).length > 0;
  }
}

const navigateTo = new NavigateTo();

export { navigateTo };
