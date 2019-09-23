import React, {PureComponent} from 'react';
import {Alert, FlatList, Linking, Platform, Text, TouchableWithoutFeedback, View, Image, Clipboard} from 'react-native';
import inlineStyle from './walletDetailsStyles';
import {LoadingModal} from '../../theme/components/LoadingModalCover';
import Colors from "../../theme/styles/Colors";
import BackArrow from '../CommonComponents/BackArrow';

import iconCopy from '../../assets/icon-copy.png';
import viewIcon from '../../assets/open-view.png';

import { OstWalletSdk, OstWalletSdkUI, OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';
import OstWalletSdkHelper from "../../helpers/OstWalletSdkHelper";
import {ostSdkErrors} from "../../services/OstSdkErrors";
import CurrentUser from "../../models/CurrentUser";
import {IS_STAGING, TOKEN_ID} from "../../constants";

import InAppBrowser from '../../services/InAppBrowser';
import Toast from '../../theme/components/NotificationToast';



class WalletDetails extends PureComponent {
  static navigationOptions = (options) => {
    return {
      title: 'Wallet Details',
      headerBackTitle: null,
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
      list: [],
      refreshing: false
    };
  }

  componentDidMount() {
    this.userId   = CurrentUser.getOstUserId();
    this.ostUser = null;
    this.ostDevice =null;
    this.cells =
    this.onRefresh();
  }


  onRefresh() {
    if( this.state.refreshing ) {
      return;
    }
    this.setState({
      refreshing: true
    });
    this._fetchUser();
  }

  _fetchUser() {
    OstWalletSdk.getUser(this.userId, (userData) => {
      if ( !userData ) {
        // What to do here?
      }

      // Store user data.
      this.ostUser = userData;

      // Get the device.
      this._fetchDevice();
    });
  }

  _fetchDevice() {
    OstWalletSdk.getCurrentDeviceForUserId(this.userId, (device) => {
      if( device && OstWalletSdkHelper.canDeviceMakeApiCall( device ) ) {
        this._fetchDeviceFromServer(device);
        return;
      }
      // Make do with what we have.
      this._onDeviceFetch(device);
    });
  }

  _fetchDeviceFromServer(localDevice) {
    OstJsonApi.getCurrentDeviceForUserId(this.userId,( deviceApiResponse ) => {
      this._onDeviceFetch(deviceApiResponse)
    }, ( error ) => {
      let ostError = OstWalletSdkHelper.jsonToOstRNError( error );
      let errorMessage = ostSdkErrors.getErrorMessage( null, ostError );
      LoadingModal.showFailureAlert(errorMessage, "", "OK", ()=> {
        // Close this view.
        this.props.navigation.goBack(null);
      });
    });
  }

  _onDeviceFetch(deviceApiResponse) {
    let resultType = deviceApiResponse["result_type"];
    let device = deviceApiResponse[ resultType ];
    this.ostDevice = device;
    this._buildList();
  }

  _buildList() {
    let cells = [];
    //Ordering Cells Logic.
    if ( IS_STAGING ) {
        cells.push( this._buildUserIdData() );
    }
    cells.push( this._buildUserStatusData() );
    cells.push( this._buildTokenIdData() );
    cells.push( this._buildTokenHolderAddressData() );
    cells.push( this._buildDeviceAddressData() );
    cells.push( this._buildDeviceStatusData() );
    cells.push( this._buildDeviceManagerAddressData() );
    cells.push( this._buildRecoveryKeyAddressData() );
    cells.push( this._buildRecoveryOwnerAddressData() );
    this.setState({
      list: cells,
      refreshing: false
    })
  }

  _buildTokenIdData() {
    return {
      "cellType": "text",
      "heading": "Token ID",
      "text": TOKEN_ID
    };
  }

  _buildUserIdData() {
    return {
      "cellType": "copy",
      "heading": "OST User ID",
      "text": this.ostUser.id
    };
  }

  _buildUserStatusData() {
    return {
      "cellType": "status",
      "heading": "User Status",
      "text": this.ostUser.status
    };
  }

  _buildTokenHolderAddressData() {
    return {
      "cellType": "link",
      "heading": "Token Holder Address",
      "text": this.ostUser.token_holder_address
    };
  }

  _buildDeviceManagerAddressData() {
    return {
      "cellType": "link",
      "heading": "Device Manager Address",
      "text": this.ostUser.device_manager_address
    };
  }

  _buildRecoveryKeyAddressData() {
    return {
      "cellType": "copy",
      "heading": "Recovery Key Address",
      "text": this.ostUser.recovery_address
    };
  }

  _buildRecoveryOwnerAddressData() {
    return {
      "cellType": "link",
      "heading": "Recovery Owner Address",
      "text": this.ostUser.recovery_owner_address
    };
  }

  _buildDeviceAddressData() {
    return {
      "cellType": "copy",
      "heading": "Device Address",
      "text": this.ostDevice.address
    };
  }

  _buildDeviceStatusData() {
    return {
      "cellType": "status",
      "heading": "Device Status",
      "text": this.ostDevice.status
    };
  }

  onCopyCellTapped = async (item) => {
    await Clipboard.setString(item.text);
    Toast.show({text: "Copied to Clipboard", icon:'success'});

    console.log("copied Text: ", await Clipboard.getString());
  };

  onLinkCellTapped = (item) => {
    InAppBrowser.openBrowser("https://google.com");
  };

  render() {
    return (
      <View style= {inlineStyle.list}>
        <FlatList
          data={this.state.list}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          visible={false}
        />
      </View>
    );
  }

  _keyExtractor = (item, index) => `id_${item.heading}_${item.text}`;

  _renderItem = ({ item, index }) => {
    switch ( item.cellType ) {
      case "text":
        return this._renderTextCell({item, index});
      case "status":
        return this._renderStatusCell({item, index});
      case "copy":
        return this._renderCopyCell({item, index});
      case "link":
        return this._renderLinkCell({item, index});
      default:
        return this._renderTextCell({item, index});
    }
  };

  _renderTextCell = ({item, index}) => {
    return (
      <View style={inlineStyle.listComponent}>
        <Text style={inlineStyle.title}>{item.heading}</Text>
        <Text style={inlineStyle.text}>{item.text}</Text>
      </View>
    );
  };

  _renderStatusCell = ({item, index}) => {
    return (
      <View style={inlineStyle.listComponent}>
        <Text style={inlineStyle.title}>{item.heading}</Text>
        <Text style={inlineStyle.statusText}>{item.text}</Text>
      </View>
    );
  };

  _renderCopyCell = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onCopyCellTapped(item)}>
        <View style={inlineStyle.listComponent}>
          <Text style={inlineStyle.title}>{item.heading}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[inlineStyle.linkView, {marginRight: 10}]}>
              <Text style={inlineStyle.text}>{item.text}</Text>
            </View>
            <Image style={{ height: 22, width: 22 }} source={iconCopy} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderLinkCell = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onLinkCellTapped(item)}>
        <View style={inlineStyle.listComponent}>
          <Text style={inlineStyle.title}>{item.heading}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[inlineStyle.linkView, {marginRight: 10}]}>
              <Text style={inlineStyle.linkText}>{item.text}</Text>
            </View>
            <Image style={{ height: 16, width: 24}} source={viewIcon} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default WalletDetails;
