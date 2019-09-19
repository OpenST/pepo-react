import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover } from '../../actions';
import TwitterAuthService from '../../services/TwitterAuthService';
import loggedOutLogo from '../../assets/logged-out-logo.png';
import twitterBird from '../../assets/twitter-bird.png';
import modalCross from '../../assets/modal-cross-icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';

const mapStateToProps = ({ login_popover }) => ({
  show: login_popover.show
});

const btnPreText = 'Connect with Twitter';
const btnPostText = 'Connecting...';

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false,
      btnText: btnPreText
    };
    this.isTwitterConnecting = false;
  }

  componentWillUnmount() {
    this.state.disableLoginBtn = false;
    this.state.btnText = btnPreText;
    this.isTwitterConnecting = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && this.props.show !== prevProps.show) {
      this.setState({ disableLoginBtn: false, btnText: btnPreText });
    }
  }

  onSignUp = () => {
    this.setState({ disableLoginBtn: true, btnText: btnPostText });
    this.isTwitterConnecting = true;
    TwitterAuthService.signUp();
  };

  //Use this function if needed to handle hardware back handling for android.
  closeModal = () => {
    if (!this.isTwitterConnecting) {
      Store.dispatch(hideLoginPopover());
    }
    return true;
  };

  render() {
    return (
      <React.Fragment>
        {this.props.show && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={true}
            onRequestClose={() => console.log('onRequestClose')}
          >
            <TouchableWithoutFeedback onPressIn={this.closeModal}>
              <View style={inlineStyles.parent}>
                <TouchableWithoutFeedback>
                  <View style={inlineStyles.container}>
                    <TouchableOpacity
                      onPress={this.closeModal}
                      style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        width: 38,
                        height: 38,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Image source={modalCross} style={{ width: 19.5, height: 19 }} />
                    </TouchableOpacity>
                    <Image source={loggedOutLogo} style={{ width: 261, height: 70, marginBottom: 20 }} />
                    <Text
                      style={[
                        inlineStyles.desc,
                        {
                          fontWeight: '500'
                        }
                      ]}
                    >
                      Pepo is a place to discover and support creators.
                    </Text>
                    <Text style={inlineStyles.desc}>
                      Pepo is currently invite only, connect with Twitter to know if your account is whitelisted!
                    </Text>
                    <TouchableButton
                      TouchableStyles={[
                        Theme.Button.btnSoftBlue,
                        {
                          marginTop: 30,
                          flexDirection: 'row',
                          height: 55,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '85%'
                        },
                        this.state.disableLoginBtn ? Theme.Button.disabled : null
                      ]}
                      TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
                      text={this.state.btnText}
                      onPress={this.onSignUp}
                      source={twitterBird}
                      imgDimension={{ width: 28, height: 22.5, marginRight: 8 }}
                      disabled={this.state.disableLoginBtn}
                    />
                    <View style={inlineStyles.tocPp}>
                      <Text style={inlineStyles.termsTextBlack}>By signing up, you confirm that you agree to our </Text>
                      <TouchableOpacity
                        onPress={multipleClickHandler(() => {
                          InAppBrowser.openBrowser(
                            'https://www.dropbox.com/s/v9e7hsdx9yc3eg7/Pepo%20Terms%20of%20Service.pdf?dl=0'
                          );
                        })}
                      >
                        <Text style={inlineStyles.termsTextBlue}>Terms of use </Text>
                      </TouchableOpacity>
                      <Text style={inlineStyles.termsTextBlack}>and have read and agree to our </Text>
                      <TouchableOpacity
                        onPress={multipleClickHandler(() => {
                          InAppBrowser.openBrowser(
                            'https://www.dropbox.com/s/yg4zq9z4cz2zynb/Pepo%20Privacy%20Policy.pdf?dl=0'
                          );
                        })}
                      >
                        <Text style={inlineStyles.termsTextBlue}>Privacy Policy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export const LoginPopover = connect(mapStateToProps)(loginPopover);
export const LoginPopoverActions = {
  show: () => {
    Store.dispatch(showLoginPopover());
  },
  hide: () => {
    Store.dispatch(hideLoginPopover());
  }
};
