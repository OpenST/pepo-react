import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import FormInput from "../../theme/components/FormInput";
import LinearGradient from "react-native-linear-gradient";
import TwitterAuth from "../../services/ExternalLogin/TwitterAuth";
import CurrentUser from '../../models/CurrentUser';
import Utilities from '../../services/Utilities';


//TODO @preshita this.state.isSubmitting block android hardware back and close modal if submitting invite code in process.

class InviteCodeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inviteCode : null ,
      isSubmitting : false
    };    
    this.payload  = this.props.navigation.getParam('payload');
  }


  onInviteCodeSumit = ( ) => {

    if(!this.state.inviteCode){
      //TODO @preshita the validation should happen by FormInput itself but if not do it manually 
      return;
    }
     
    this.setState({isSubmitting: true});

    let twitterAccessToken =  TwitterAuth.getCachedTwitterResponse();
    twitterAccessToken["invite_code"] = this.state.inviteCode;

    CurrentUser.twitterConnect( twitterAccessToken )
      .then((res)=> {
        if(res && res.success){
          this.onSuccess(res);
        }else{
          this.onError( res );
        }
      }).catch((error)=> {
        this.onError(error);
      }).finally(()=> {
        this.setState({isSubmitting: false});
      });

  }

  onSuccess( res ){
   if(this.handleGoTo( res )){
     return ;
   }
   this.props.navigation.goBack();
   Utilities.navigationDecision();
  }

  onError(error){
    if( this.handleGoTo(error)){
      return ;
    }
  }
  
  handleGoTo( res ){
      //On success goto can ge hanled by the generic utility 
      if(Utilities.handleGoTo(res , this.props.navigation)){
        return;
      } 
      //TODO @preshita 
      //Is error and error for invite code , show inline errors, honor backend error. You should pass the response to  FormInput it will manage the display error. Check AuthScreen for refrences , how to manage feild specific error and general error  
      //If access token error , show error below send button. Auto close after 2 second.
      //DOnt forget to return true or false ,if handleGoTo has taken a decission return true or false  
  }

  //@TODO @preshita use this function on close modal and android hardware back
  closeModal(){
    if(!this.state.isSubmitting){
      this.props.navigation.goBack();
    }
    return true;
  }

  render() {
    return (
      <TouchableWithoutFeedback >
        <View style={ inlineStyles.parent }>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container ]}>
              <Text style={[inlineStyles.desc, {marginBottom: 10, fontSize: 18}]}>Looks like your account is not whitelisted</Text>
              <Text style={[inlineStyles.desc, {fontFamily: 'AvenirNext-Regular'}]}>To activite your account you can either join via a invite link enter a referal code below.</Text>
              <FormInput
                onChangeText={{}}
                value={{}}
                placeholder="1-2-2-1-2-1"
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
                  text={"Enter"}
                />
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default InviteCodeScreen;
