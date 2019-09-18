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
                    <Text style={inlineStyles.desc}>
                      Pepo is a place to discover and support your favorite creators.
                    </Text>
                    <Text style={inlineStyles.desc}>Please create a account to continue</Text>
                    <TouchableButton
                      TouchableStyles={[
                        Theme.Button.btnSoftBlue,
                        {
                          marginTop: 30,
                          flexDirection: 'row',
                          height: 55,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '80%'
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
