import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';
import loggedOutIcon from '../../assets/drawer-logout-icon.png';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import referAndEarn from '../../assets/refer-and-earn.png';
import Toast from '../../theme/components/NotificationToast';

import BackArrow from '../../assets/back-arrow.png';

export default class CustomDrawerContent extends Component {
  constructor(props) {
    super(props);
    this.userName = reduxGetter.getName(CurrentUser.getUserId());
    this.state = {
      disableButtons: false
    };
  }

  twitterDisconnect = () => {
    this.setState(
      {
        disableButtons: true
      },
      () => {
        new PepoApi('/auth/twitter-disconnect')
          .post()
          .catch((error) => {
            Toast.show({
              text: 'Twitter Disconnect failed',
              icon: 'error'
            });
            this.setState({ disableButtons: false });
          })
          .then(async (res) => {
            if (res && res.success) {
              this.CurrentUserLogout();
            } else {
              Toast.show({
                text: 'Twitter Disconnect failed',
                icon: 'error'
              });
              this.setState({ disableButtons: false });
            }
          });
      }
    );
  };

  CurrentUserLogout = () => {
    let params = {
      device_id: DeviceInfo.getUniqueID()
    };
    this.setState(
      {
        disableButtons: true
      },
      async () => {
        await CurrentUser.logout(params);
        setTimeout(() => {
          this.setState({
            disableButtons: false
          });
        }, 300);
      }
    );
  };

  referAndEarn = () => {
    this.props.navigation.push('ReferAndEarn');
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView forceInset={{ top: 'always' }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={this.props.navigation.closeDrawer}
              style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
            >
              <Image style={{ width: 10, height: 18 }} source={BackArrow} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{this.userName}</Text>
          </View>
          <TouchableOpacity onPress={this.twitterDisconnect} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 25.3 }} source={twitterDisconnectIcon} />
              <Text style={styles.item}>Twitter Disconnect</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.referAndEarn} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 29 }} source={referAndEarn} />
              <Text style={styles.item}>Refer and Earn</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.CurrentUserLogout} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
              <Text style={styles.item}>Log out</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.whisper
  },
  header: {
    paddingVertical: 7,
    borderBottomColor: Colors.whisper,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center'
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    flex: 1,
    textAlign: 'center'
  },
  itemParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.whisper,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  item: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'AvenirNext-Regular'
  }
});
