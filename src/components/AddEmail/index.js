import React from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import FormInput from "../../theme/components/FormInput";
import LinearGradient from "react-native-linear-gradient";
import confirmEmail from "../../assets/confirm-your-email-icon.png";
import PepoApi from '../../services/PepoApi';
import Utilities from '../../services/Utilities';

//TODO @preshita block android hardware back and close modal if submitting invite code in process.

class AddEmailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email : null ,
      isSubmitting: false
    };
  }

  onEmail(){
    if( !this.state.email ){
       //TODO @preshita the validation should happen by FormInput itself but if not do it manually 
      return ;
    }

    new PepoApi()
    .post({email: this.state.email})
    .then((res)=> {
      if(res && res.success){
        this.onSuccess(res);
      }else{
        this.onError(res);
      }
    })
    .catch((error)=> {
      this.onError(error);
    })

  }  

  onSuccess(res){
    //TODO show success screen 
  }

  onError(error){
     //TODO show error, honor backend error. You should pass the response to  FormInput it will manage the display error , Check AuthScreen for refrences how to manage feild specific error and general error
  }

  //@TODO @preshita use this function on close modal and android hardware back
  closeModal(){
    if(!this.state.isSubmitting){
      this.props.navigation.goBack(null);
      Utilities.navigationDecision();
    }
    return true;
  }

  emailSignUp = () => {
    return (
      <React.Fragment>
        <Text style={[inlineStyles.desc, {marginBottom: 10, fontSize: 18}]}>Please enter email address to continue</Text>
        <Text style={[inlineStyles.desc, {fontFamily: 'AvenirNext-Regular'}]}>We will only send you important email related to you account activity and transaction.</Text>
        <FormInput
          onChangeText={{}}
          value={{}}
          placeholder="email@gmail.com"
          fieldName=""
          style={[Theme.TextInput.textInputStyle, {width: '100%', marginTop: 20, marginBottom: 10}]}
          placeholderTextColor="#ababab"
          keyboardType="numeric"
          isFocus={{}}
        />
        <LinearGradient
          colors={['#ff7499', '#ff7499', '#ff5566']}
          locations={[0, 0.35, 1]}
          style={{ borderRadius: 3, marginHorizontal: 20, borderWidth: 0, width: '100%' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableButton
            TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
            TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
            text={"Sign Up"}
          />
        </LinearGradient>
      </React.Fragment>
    )
  }

  confirmEmail = () => {
    return (
      <React.Fragment>
        <Image source={confirmEmail} style={{ width: 72, height: 72, marginBottom: 25 }} />
        <Text style={[inlineStyles.desc, {marginBottom: 10, fontSize: 18}]}>Please Confirm Your Email</Text>
        <Text style={[inlineStyles.desc, {marginBottom: 20, fontFamily: 'AvenirNext-Regular'}]}>We have sent a email on  prineel@ost.com, Please go to your inbox and click on the  confrim button to continue.</Text>
        <LinearGradient
          colors={['#ff7499', '#ff7499', '#ff5566']}
          locations={[0, 0.35, 1]}
          style={{ borderRadius: 3, marginHorizontal: 20, borderWidth: 0, width: '100%' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableButton
            TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
            TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
            text={"OK"}
          />
        </LinearGradient>
      </React.Fragment>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback >
        <View style={ inlineStyles.parent }>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container ]}>
              {/*{this.emailSignUp()}*/}
              {this.confirmEmail()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default AddEmailScreen;
