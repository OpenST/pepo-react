import { NativeModules } from 'react-native';
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from '../../constants';
const { RNTwitterSignIn } = NativeModules;

let twitterResponse = null;

class TwitterAuth {
  signIn() {
    RNTwitterSignIn.init(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
    return RNTwitterSignIn.logIn()
      .then((res) => {
        twitterResponse = res;
        return this.getLoginParamsFromTwitterResponse(twitterResponse);
      })
      .catch((error) => {});
  }

  getCachedTwitterResponse() {
    return twitterResponse;
  }

  getLoginParamsFromTwitterResponse(twitterResponse) {
    twitterResponse = twitterResponse || {};
    return {
      token: twitterResponse.authToken,
      secret: twitterResponse.authTokenSecret,
      twitter_id: twitterResponse.userID,
      handle: twitterResponse.userName
    };
  }

  signout() {
    RNTwitterSignIn.logOut();
  }
}

export default new TwitterAuth();
