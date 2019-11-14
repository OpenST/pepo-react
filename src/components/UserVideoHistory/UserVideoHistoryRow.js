import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';

import CurrentUser from '../../models/CurrentUser';

import VideoBottomStatus from '../BottomStatus /VideoBottomStatus';
import inlineStyles from './styles';

import utilities from '../../services/Utilities';
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';

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
    if (this.isCurrentUser()) return;
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

  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <FanVideo
          shouldPlay={this.props.shouldPlay}
          userId={this.props.userId}
          videoId={this.props.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
        />

        {!!this.props.videoId && !!this.props.userId && (
          <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
            <View style={inlineStyles.touchablesBtns}>

              <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                <PepoTxBtn
                  resyncDataDelegate={this.refetchVideo}
                  userId={this.props.userId}
                  entityId={this.props.videoId}
                />
                <ReplyIcon videoId={this.props.videoId} userId={this.props.userId}/>
                <ShareIcon  userId={this.props.userId} videoId={this.props.videoId} />
                <ReportVideo  userId={this.props.userId} videoId={this.props.videoId} />
              </View>

              <VideoSupporterStat
                videoId={this.props.videoId}
                userId={this.props.userId}
              />
            </View>

            <VideoBottomStatus
              userId={this.props.userId}
              videoId={this.props.videoId}
            />
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(UserVideoHistoryRow);
