import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import { StackActions } from 'react-navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { connect } from 'react-redux';

import styles from './styles';
import homeNs from '../../assets/user-home-icon.png';
import homeSelected from '../../assets/user-home-icon-selected.png';
import profileNs from '../../assets/user-profile-icon.png';
import profileSelected from '../../assets/user-profile-icon-selected.png';
import searchNs from '../../assets/user-search-icon.png';
import searchSelected from '../../assets/user-search-icon-selected.png';
import activityNs from '../../assets/user-activity-icon.png';
import activitySelected from '../../assets/user-activity-icon-selected.png';
import videoNs from '../../assets/user-video-capture-icon.png';
import utilities from '../../services/Utilities';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import CurrentUser from '../../models/CurrentUser';
import { LoginPopoverActions } from '../../components/LoginPopover';
import {LoggedOutCustomTabClickEvent} from '../../helpers/Emitters';
import appConfig from '../../constants/AppConfig';
import {testProps} from '../../constants/AppiumAutomation';
import reduxGetter from '../../services/ReduxGetters';
import Colors from '../../theme/styles/Colors';
import {navigateTo} from "../../helpers/navigateTo";
import NavigationService from '../../services/NavigationService';

const mapStateToProps = (state, ownProps) => {
  return {
    unreadNotification: reduxGetter.getNotificationUnreadFlag(state)
  };
};

let previousTabIndex = 0;

function onTabPressed(navigation, tab) {
  if (CurrentUser.getOstUserId()) {
    loginInFlow(navigation, tab);
  } else {
    logoutFlow(navigation, tab);
  }
}

let refreshTimeOut = 0;

function loginInFlow(navigation, tab) {
  let currentTabIndex = tab.navigationIndex;
  if (tab.rootStack === 'CaptureVideo') {
    let params = {videoType: appConfig.videoTypes.post };
    console.log('--------------::::: --------------::::: :::: --------------:::::', NavigationService.findCurrentRoute());
    if (NavigationService.findCurrentRoute() === 'ChannelsScreen'){
      console.log('--------------::::: --------------::::: :::: --------------:::::');
      params['channelId'] = navigateTo.getTopLevelNavigation().getParam('channelId');
    }
    console.log(params);
    utilities.handleVideoUploadModal(previousTabIndex, navigation, params );
    return;
  }
  if (currentTabIndex == undefined || currentTabIndex == null) return;
  if (previousTabIndex !== currentTabIndex) {       
    tab.rootStack == 'Notification' && refreshActivity(tab.childStack);
    navigation.navigate(tab.rootStack);
  } else if (utilities.getLastChildRoutename(navigation.state) !== tab.childStack) {
    try {
      navigation.dispatch(StackActions.popToTop());
    } catch(e) {
      console.log('Catch error', e);
    }
  } else {
    clearTimeout(refreshTimeOut);
    refreshTimeOut = setTimeout(() => {
      NavigationEmitter.emit('onRefresh', { screenName: tab.childStack });
    }, 300);
  }
}


function refreshActivity(screenName){
  let unreadNotification = reduxGetter.getNotificationUnreadFlag();
  if (unreadNotification){
    clearTimeout(refreshTimeOut);
    refreshTimeOut = setTimeout(() => {
    NavigationEmitter.emit('onRefresh', { screenName });
  }, 300);  
  }  
}


function logoutFlow(navigation, tab) {
  if (tab.navigationIndex == appConfig.tabConfig.tab1.navigationIndex) {
    clearTimeout(refreshTimeOut);
    refreshTimeOut = setTimeout(() => {
      NavigationEmitter.emit('onRefresh', { screenName: tab.childStack });
    }, 300);
  } else {
    LoggedOutCustomTabClickEvent.emit('pressed');
    LoginPopoverActions.show();
  }
}

const CustomTab = (props) => {
  let { navigation, unreadNotification } = props;
  previousTabIndex = navigation.state.index;
  return (
    <SafeAreaView forceInset={{ top: 'never' }}>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab1)} style={styles.tapArea} {...testProps('custom-navigation-tab-home')}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab1.navigationIndex ? homeSelected : homeNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab2)} style={styles.tapArea} {...testProps('custom-navigation-tab-search')}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab2.navigationIndex ? searchSelected : searchNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab3)} style={styles.tapArea} {...testProps('custom-navigation-tab-camera')}>
        <Image style={[styles.tabElementSkipFont]} source={videoNs} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab4)}
        style={{ position: 'relative' }}
        {...testProps('custom-navigation-tab-notifications')}
      >
        <React.Fragment>
          {unreadNotification ? (
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                width: 5,
                height: 5,
                backgroundColor: Colors.pinkRed,
                borderRadius: 2.5
              }}
            />
          ) : (
            <React.Fragment />
          )}
          <Image
            style={[styles.tabElementSkipFont]}
            source={navigation.state.index === appConfig.tabConfig.tab4.navigationIndex ? activitySelected : activityNs}
          />
        </React.Fragment>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab5)} style={styles.tapArea} {...testProps('custom-navigation-tab-profile')}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab5.navigationIndex ? profileSelected : profileNs}
        />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default connect(mapStateToProps)(CustomTab);
