import React, { PureComponent } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import inlineStyles from './styles';
import { withNavigation } from 'react-navigation';
import currentUserModel from '../../models/CurrentUser';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import pricer from "../../services/Pricer";
import reduxGetter from "../../services/ReduxGetters";

import supportersIcon from "../../assets/supporters-icon-1.png";

class BottomStatus extends PureComponent {

  constructor(props) {
    super(props);
  }

  navigateToUserProfile = (e) => {
    if (currentUserModel.checkActiveUser()) {
      this.props.navigation.push('UsersProfileScreen' ,
      { userId: reduxGetter.getHomeFeedUserId(this.props.feedId) }
     );
    }
  };

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle(); 
    return priceOracle && priceOracle.btToFiat( btAmount  , 2) || 0;
  }

  render() {
    console.log('Bottom status rerender');
    return (
        <TouchableWithoutFeedback onPress={this.navigateToUserProfile} pointerEvents={'auto'}>
          <View style={inlineStyles.bottomBg}>
            <View style={{ flex: 0.7}}>
              <Text style={[{ marginBottom: 5 }, inlineStyles.bottomBgTxt]}>{`@${this.props.userName}`}</Text>
              {this.props.bio ? (<Text style={[{ paddingRight: 20, fontSize: 13, flexWrap: 'wrap' }, inlineStyles.bottomBgTxt]} ellipsizeMode={'tail'} numberOfLines={3}>{this.props.bio}</Text>) : <Text/>}
            </View>
            <View style={{flex: 0.3}}>
              {this.props.totalBt ?
                <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center' }} ellipsizeMode={'tail'} numberOfLines={1}>
                  <Text style={[{width: 12, textAlign: 'center', marginRight: 3}, inlineStyles.bottomBgTxt]}>$</Text>
                  <Text style={[inlineStyles.bottomBgTxt, {flex: 1}]} ellipsizeMode={'tail'} numberOfLines={1}>{`${ this.btToFiat( this.props.totalBt) } Raised`}</Text>
                </View> : <View/>
              }
              {
                <View style={[inlineStyles.bottomBgTxt, {flexDirection: 'row', alignItems: 'center'}]} >
                <Image source={supportersIcon} style={{width: 12, height: 10, marginRight: 3}} />
                <Text style={[inlineStyles.bottomBgTxt, {flex: 1}]} ellipsizeMode={'tail'} numberOfLines={1}>{`${this.props.supporters} Supporters`}</Text>
                </View>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(BottomStatus);
