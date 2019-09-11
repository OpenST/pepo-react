import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';
import Colors from '../../theme/styles/Colors';
import Theme from '../../theme/styles';
import arrowRight from '../../assets/arrowRight.png';
import InAppBrowser from '../../services/InAppBrowser';
import BackArrow from '../CommonComponents/BackArrow';

const COPY = {
  CREATOR_INITIAL: {
    inviteHeader: 'You have Unlimited Invites',
    inviteText:
      'Pepo Invites will let your friends skip the queue and join the community immediately. When someone signs up for Pepo with your Invite, they will get     500 to support you and other creators. When they start earning, you will get 5% of their earnings in  Coins.'
  },
  USER_INITIAL: {
    inviteHeader: 'You have 50 Invites',
    inviteText:
      'Pepo Invites will let your friends skip the queue and join the community immediately. When someone signs up for Pepo with your Invite, they will get     500 to support you and other creators. When they start earning, you will get 5% of their earnings in  Coins.'
  },
  AFTER_INVITE: {
    inviteHeader: 'Amazing 50 People Joined Pepo Via Your Link',
    inviteText:
      'As your friends start earning you will get 5% of their earnings in Pepo Coins. Contact us if you need  more Invites.'
  }
};

class ReferAndEarn extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Refer and Earn',
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      inviteHeader: '',
      inviteText: '',
      inviteCoide: ''
    };
  }

  onShare = () => {};

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.wrapper, styles.topWrapper, { flex: 0.3 }]}>
          <Text style={styles.heading}>You have Unlimited Invites</Text>
          <Text style={styles.content}>
            Pepo Invites will let your friends skip the queue and join the community immediately. When someone signs up
            for Pepo with your Invite, they will get 500 to support you and other creators. When they start earning, you
            will get 5% of their earnings in Coins.
          </Text>
        </View>
        <View style={[styles.middleWrapper, { flex: 0.3 }]}>
          <View style={{ backgroundColor: '#fbfbfb', padding: 15 }}>
            <Text style={[styles.content, { marginBottom: 10 }]}>Your Invite Code, Tap to Copy</Text>
            <Text style={styles.inviteCode}>PE0AY</Text>
          </View>
          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ marginTop: 25, borderRadius: 3 }}
          >
            <TouchableOpacity
              onPress={multipleClickHandler(() => {
                this.onShare();
              })}
              style={[Theme.Button.btn, { borderWidth: 0 }]}
            >
              <Text style={[Theme.Button.btnPinkText, { textAlign: 'center' }]}>Share Invite Link</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={[styles.bottomWrapper, { flex: 0.4 }]}>
          <View
            style={{
              position: 'relative',
              marginBottom: 10,
              borderTopColor: Colors.whisper,
              borderTopWidth: 1,
              paddingTop: 10
            }}
          >
            <Text style={styles.heading}>Invites and Earnings</Text>
            <Text style={[styles.content, { textAlign: 'left' }]}>
              You will see your accepted invites here and the amount of pepos earned
            </Text>
            <TouchableOpacity
              onPress={multipleClickHandler(() => {
                InAppBrowser.openBrowser('http://invitesandearnings');
              })}
              style={styles.imageWrapper}
            >
              <Image style={{ width: 25, height: 22 }} source={arrowRight}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ position: 'relative', borderTopColor: Colors.whisper, borderTopWidth: 1, paddingTop: 10 }}>
            <Text style={styles.heading}>Terms and Conditions</Text>
            <Text style={[styles.content, { textAlign: 'left' }]}>
              For anything related to payouts, waiting lists and more information please look at our Terms and
              Conditions
            </Text>
            <TouchableOpacity
              onPress={multipleClickHandler(() => {
                InAppBrowser.openBrowser('http://termsandconditions');
              })}
              style={styles.imageWrapper}
            >
              <Image style={{ width: 25, height: 22 }} source={arrowRight}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ReferAndEarn;
