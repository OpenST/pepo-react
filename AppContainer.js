import React, { Component } from 'react';
import { Platform, Linking } from 'react-native';
import { OstWalletSdkEvents } from '@ostdotcom/ost-wallet-sdk-react-native';

import RootNavigationContainer from './RootNavigationContainer';
import Store from './src/store';
import { Provider } from 'react-redux';

export default class AppContainer extends Component {
  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        console.log('_handleOpenURL url', url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    OstWalletSdkEvents.unsubscribeEvent();
    if (Platform.OS !== 'android') {
      Linking.removeEventListener('url', this._handleOpenURL);
    }
  }

  _handleOpenURL(event) {
    console.log('_handleOpenURL event', event);
  }

  render() {
    return (
      <Provider store={Store}>
        <RootNavigationContainer />
      </Provider>
    );
  }
}
