import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import reduxGetter from '../../services/ReduxGetters';
import BackArrow from '../CommonComponents/BackArrow';

import UserInfo from '../../components/CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';
import UserProfileFlatList from '../../components/CommonComponents/UserProfileFlatList';
import multipleClickHandler from '../../services/MultipleClickHandler';
import tx_icon from '../../assets/tx_icon.png';
import user_not_exist from '../../assets/user-not-exist.png';
import video_not_available from '../../assets/video-not-available.png';

import { fetchUser } from '../../helpers/helpers';
import utilities from '../../services/Utilities';
import BalanceHeader from "../Profile/BalanceHeader";
import inlineStyles from './styles';

export default class UsersProfile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: reduxGetter.getName(navigation.getParam('userId')),
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#ffffff',
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
    this.userId = this.props.navigation.getParam('userId');
  }

  navigateToTransactionScreen = () => {
    if (utilities.checkActiveUser() && CurrentUser.isUserActivated()) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        requestAcknowledgeDelegate: this.fetchUser
      });
    }
  };

  fetchUser = () => {
    fetchUser(this.userId);
  };

  _headerComponent() {
    return <UserInfo userId={this.userId}/>;
  }

  _subHeader() {
    return <Text style={{color: 'transparent'}}>Videos</Text>;
  }

  render() {
    return (
      <React.Fragment>
        <UserProfileFlatList
          listHeaderComponent={this._headerComponent()}
          listHeaderSubComponent={this._subHeader()}
          userId={this.userId}
        />
        <TouchableOpacity
          pointerEvents={'auto'}
          onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}
          style={{ position: 'absolute', right: 20, bottom: 30 }}
        >
          <Image style={{ height: 57, width: 57 }} source={tx_icon} />
        </TouchableOpacity>

        {/*<View style={inlineStyles.container}>*/}
          {/*<Image style={inlineStyles.imgSize} source={user_not_exist} />*/}
          {/*<Text style={inlineStyles.desc}>The user you were looking for does not exist!</Text>*/}
        {/*</View>*/}

        {/*<View style={inlineStyles.container}>*/}
          {/*<Image style={inlineStyles.imgSize} source={video_not_available} />*/}
          {/*<Text style={inlineStyles.desc}>Looks like the Video you were looking for isn’t available and might have been deleted by the creator!</Text>*/}
        {/*</View>*/}

      </React.Fragment>
    );
  }
}
