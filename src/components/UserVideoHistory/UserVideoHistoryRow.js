import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import VideoWrapper from '../Home/VideoWrapper';
import PepoApi from '../../services/PepoApi';
import TransactionPepoButton from '../Home/TransactionPepoButton';
import tx_icon from '../../assets/tx_icon.png';
import share_icon from '../../assets/share_icon.png';
import CurrentUser from '../../models/CurrentUser';

import BottomStatus from '../Home/BottomStatus';
import VideoAmountStat from '../CommonComponents/VideoAmoutStat';
import ShareVideo from '../../services/shareVideo';
import inlineStyles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';
import utilities from '../../services/Utilities';

class UserVideoHistoryRow extends PureComponent {
  constructor(props) {
    super(props);
  }

  refetchVideo = () => {
    new PepoApi(`/videos/${this.props.videoId}`)
      .get()
      .then((res) => {})
      .catch((error) => {});
  };

  navigateToTransactionScreen = (e) => {
    if (this.userId == CurrentUser.getUserId()) return;
    if (utilities.checkActiveUser() && CurrentUser.isUserActivated(true)) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.props.userId,
        videoId: this.props.videoId,
        requestAcknowledgeDelegate: this.refetchVideo
      });
    }
  };

  isCurrentUser() {
    return this.props.userId == CurrentUser.getUserId();
  }

  shareVideo = () => {
    let shareVideo = new ShareVideo(this.props.videoId);
    shareVideo.perform();
  };

  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <VideoWrapper
          userId={this.props.userId}
          videoId={this.props.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
        />

        {!!this.props.videoId && !!this.props.userId && (
          <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
            <View style={inlineStyles.touchablesBtns}>
              {!this.isCurrentUser() && (
                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                  <TransactionPepoButton
                    resyncDataDelegate={this.refetchVideo}
                    userId={this.props.userId}
                    videoId={this.props.videoId}
                  />
                  <TouchableOpacity
                    pointerEvents={'auto'}
                    style={inlineStyles.txElem}
                    onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}
                  >
                    <Image style={{ height: 57, width: 57 }} source={tx_icon} />
                  </TouchableOpacity>

                  <TouchableOpacity pointerEvents={'auto'} style={inlineStyles.txElem} onPress={multipleClickHandler(() => this.shareVideo())}>
                    <Image style={{ height: 48, width: 48 }} source={share_icon} />
                  </TouchableOpacity>
                </View>
              )}

              {this.isCurrentUser() && (
                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                  <TouchableOpacity pointerEvents={'auto'} style={inlineStyles.txElem} onPress={multipleClickHandler(() => this.shareVideo())}>
                    <Image style={{ height: 48, width: 48 }} source={share_icon} />
                  </TouchableOpacity>
                </View>
              )}

              <VideoAmountStat videoId={this.props.videoId} userId={this.props.userId} onWrapperClick={this.props.onWrapperClick} />
            </View>

            <BottomStatus userId={this.props.userId} videoId={this.props.videoId} onWrapperClick={this.props.onWrapperClick} />
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(UserVideoHistoryRow);
