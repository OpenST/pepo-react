import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Switch
} from 'react-native';
import { connect } from 'react-redux';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import reduxGetter from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';
import deepGet from 'lodash/get';
import inlineStyles from './Style';
import ProfilePicture from '../ProfilePicture';
import FormInput from '../../theme/components/FormInput';
import PepoApi from '../../services/PepoApi';
import Theme from '../../theme/styles';
import Colors from '../../theme/styles/Colors';
import TwitterAuth from '../../services/ExternalLogin/TwitterAuth';

const bottomSpace = getBottomSpace([true]),
    extraPadding = 10,
    safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

class SayThanks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeDisabled: false,
      thanksMessage: 'Thanks for supporting me!',
      server_errors: {},
      thanksError: '',
      posting: false,
      bottomPadding: safeAreaBottomSpace,
      focus: false,
      tweetOn: false,
      gettingTweetInfo: false
    };
    this.tweeterHandle = '';
    this.receivedTweetHandle = false;
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  _keyboardShown(e) {
    let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;
    bottomPaddingValue -= 50;
    if (this.state.bottomPadding == bottomPaddingValue) {
      return;
    }
    this.setState({
      bottomPadding: bottomPaddingValue
    });
  }

  _keyboardHidden(e) {
    if (this.state.bottomPadding == safeAreaBottomSpace) {
      return;
    }
    this.setState({
      bottomPadding: safeAreaBottomSpace
    });
  }

  closeModal() {
    this.setState({ thanksMessage: '' }, () => {
      this.props.navigation.goBack();
    });
  }

  handleBackButtonClick = () => {
    if (this.state.closeDisabled) {
      return true;
    }
  };

  changeMessage = (val) => {
    this.setState({ thanksMessage: val });
  };

  sendMessage = () => {
    let tweetNeeded = this.state.tweetOn === true ? 1 : 0;
    this.setState({ server_errors: {}, thanksError: '' });
    if (this.state.thanksMessage.trim().length == 0) {
      this.setState({ thanksError: 'Message can not be empty' });
      return;
    }
    this.setState({ posting: true });
    return new PepoApi(`/users/thank-you`)
        .post({
          notification_id: this.props.navigation.getParam('notificationId'),
          text: this.state.thanksMessage,
          tweet_needed: tweetNeeded
        })
        .then((res) => {
          this.setState({ posting: false });
          if (res && res.success) {
            this.closeModal();
            this.props.navigation.getParam('sendMessageSuccess')();
          } else {
            this.setState({ server_errors: res });
          }
        })
        .catch((error) => {
          this.setState({ posting: false });
        });
  };


  tweetSwitchChange = (value) => {
    if (value === true && !this.receivedTweetHandle) {
      this.setState({ gettingTweetInfo: true });
      return new PepoApi(`/users/tweet-info`)
          .get({ receiver_user_id: this.props.navigation.getParam('userId') })
          .then((response) => {
            this.setState({ gettingTweetInfo: false });
            if (response && response.success) {
              let twitterInfo =
                  response.data.twitter_users && response.data.twitter_users[this.props.navigation.getParam('userId')];
              this.tweeterHandle = twitterInfo && twitterInfo.handle;
              if (this.tweeterHandle){
                this.setState({thanksMessage: `@${this.tweeterHandle} ${this.state.thanksMessage}`})
              }              
              if (response.data.logged_in_user.twitter_auth_expired === 1) {
                console.log('tweeter auth expired');
                TwitterAuth.signIn().then((res) => {
                  if (res) {
                    return new PepoApi(`/auth/refresh-twitter-connect`)
                        .post(res)
                        .then((resp) => {
                          if (resp && resp.success) {
                            this.receivedTweetHandle = true;
                            this.setState({
                              tweetOn: value
                            });
                          } else {
                            //TODO: show error
                          }
                        })
                        .catch((error) => {});
                  }
                });
              } else {
                console.log('tweeter auth not expired');
                this.setState({
                  tweetOn: value
                });
                this.receivedTweetHandle = true;
              }
            }

            if (resp && resp.success) {
              this.setState({
                tweetOn: value
              });
            } else {
              //TODO: show error
            }
          })
          .catch((error) => {
            this.setState({ gettingTweetInfo: false });
          });
    } else {
      this.setState({
        tweetOn: value
      });
    }
  };

  render() {
    return (
        <TouchableWithoutFeedback
            onPressOut={() => {
              if (!this.state.closeDisabled) {
                this.closeModal();
              }
            }}
        >
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <TouchableWithoutFeedback>
              <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
                {this.state.gettingTweetInfo && (
                    <View style={[inlineStyles.backgroundStyle]}>
                      <View style={{ padding: 26 }}>
                        <ActivityIndicator />
                      </View>
                    </View>
                )}

                <View style={inlineStyles.headerWrapper}>
                  <View style={{ flexDirection: 'row' }}>
                    <ProfilePicture userId={this.props.navigation.getParam('userId')} />
                    <Text style={inlineStyles.modalHeader}>
                      {reduxGetter.getName(this.props.navigation.getParam('userId'))}
                    </Text>
                  </View>
                  <Text style={{ marginLeft: 'auto', marginRight: 5 }}>Tweet</Text>
                  <Switch
                      value={this.state.tweetOn}
                      trackColor={{ true: Colors.primary }}
                      ios_backgroundColor="#c9cdd2"
                      onValueChange={this.tweetSwitchChange}
                  />
                </View>
                <View style={{ marginTop: 14, width: '100%' }}>
                  <View style={{ flex: 1 }}>
                    <FormInput
                        onChangeText={this.changeMessage}
                        placeholder="Thanks for supporting me!"
                        fieldName="sayThanksInput"
                        style={[Theme.TextInput.textInputStyle, { height: 50, color: '#2a293b', marginTop: 0 }]}
                        value={`${this.state.thanksMessage}`}
                        isFocus={this.state.focus}
                        serverErrors={this.state.server_errors}
                        errorMsg={this.state.thanksError}
                        placeholderTextColor="#ababab"
                    />
                  </View>
                  <TouchableWithoutFeedback onPress={this.sendMessage}>
                    <View
                        style={{
                          backgroundColor: Colors.primary,
                          height: 40,
                          borderRadius: 4,
                          width: '100%',
                          justifyContent: 'center',
                          marginTop: 8
                        }}
                    >
                      <Text style={{ textAlign: 'center', color: Colors.white }}>Send</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{ height: 15 }}>
                  {this.state.posting && <ActivityIndicator size="small" color="#168dc1" />}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = ({ current_user }) => ({ current_user });
export default connect(mapStateToProps)(SayThanks);
