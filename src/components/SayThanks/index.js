import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Keyboard, BackHandler, Dimensions , ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import reduxGetter from '../../services/ReduxGetters';
import deepGet from 'lodash/get';
import inlineStyles from './Style';
import modalCross from '../../assets/modal-cross-icon.png';
import sendMessageIcon from '../../assets/tx_icon.png';
import ProfilePicture from '../ProfilePicture';
import FormInput from '../../theme/components/FormInput';
import PepoApi from '../../services/PepoApi';
import Theme from '../../theme/styles';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

class SayThanks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeDisabled: false,
      thanksMessage: '',
      server_errors: {},
      thanksError: '',
      posting: false
    };
  }

  componentWillMount() {
    this.defaultVals();
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  defaultVals() {}

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  _keyboardShown(e) {
    console.log('_keyboardShown', e);
    console.log(deepGet(e, 'endCoordinates.height'), '_keyboardShown', extraPadding);
    console.log(Dimensions.get('screen').height);
    let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;    
    bottomPaddingValue -= 50 ;

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
    this.setState({server_errors: {}, thanksError: ''});
    if(this.state.thanksMessage.trim().length == 0){
      this.setState({thanksError: 'Message can not be empty'});
      return;
    }
    this.setState({posting:true});
    return new PepoApi(`/users/thank-you`)
      .post({ notification_id: this.props.navigation.getParam('notificationId'), text: this.state.thanksMessage })
      .then((res) => {
        this.setState({posting:false});
        if (res && res.success) {
          this.closeModal();
          this.props.navigation.getParam('sendMessageSuccess')();
        } else {
          this.setState({server_errors: res});
        }
      })
      .catch((error) => {
        this.setState({posting:false});
      });
  };

  render() {

    return (
      <TouchableWithoutFeedback
      onPressOut={() => {
          console.log('HEY')
          if (!this.state.closeDisabled) {
            this.closeModal();
          }
        }}
      > 
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <TouchableWithoutFeedback>
      <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
        <View style={inlineStyles.headerWrapper}>
          <ProfilePicture style={{ marginLeft: 10 }} userId={this.props.navigation.getParam('userId')} />
          <Text style={inlineStyles.modalHeader}>
            {reduxGetter.getUserName(this.props.navigation.getParam('userId'))}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.closeModal();
            }}
            style={{
              position: 'absolute',
              right: 10,
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            disabled={this.state.closeDisabled}
          >
            <Image source={modalCross} style={{ width: 13, height: 12.6 }} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row'}}>
        <View style={{  margin: 10, width: '80%', height: 65 }}>
          <FormInput
            onChangeText={this.changeMessage}
            placeholder="Thanks for supporting me!"
            fieldName="text"
            style={[Theme.TextInput.textInputStyle]}
            style={{ flex: 1, borderColor: '#eee', borderWidth: 1, borderRadius: 10, height: 46, padding: 10, flexDirection: 'column' }}
            value={`${this.state.thanksMessage}`}
            isFocus={true}
            serverErrors={this.state.server_errors}
            errorMsg={this.state.thanksError}
            placeholderTextColor="#ababab"
          />
          </View>
          <TouchableOpacity onPress={this.sendMessage}>
            <Image style={{ height: 40, width: 40, marginLeft: 5, marginTop: 14 }} source={sendMessageIcon} />
          </TouchableOpacity>        
        </View>
        <View style={{height:15}}>
        {this.state.posting && (<ActivityIndicator size="small" color="#168dc1" />)}
        </View>
      </View>
      </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default SayThanks;