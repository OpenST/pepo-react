import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from "../VideoWrapper/FanVideo";
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';
import deepGet from 'lodash/get';

import inlineStyles from './styles';

import ReplyPepoTxBtn from '../PepoTransactionButton/ReplyPepoTxBtn';
import VideoReplySupporterStat from '../CommonComponents/VideoSupporterStat/VideoReplySupporterStat';

import VideoBottomStatus from '../BottomStatus /VideoBottomStatus';


class VideoReplyRow extends PureComponent {
    constructor(props) {
        super(props);
        this.userId = deepGet(this.props.payload, 'user_id');
        this.replyId = deepGet(this.props.payload, 'video_id');
    }

    refetchVideoReply = () => {
        new PepoApi(`/replies/${this.replyId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

  //Required from Backend , we need video  stats entity 

    render() {
        return (
            <View style={inlineStyles.fullScreen}>
                <FanVideo
                    shouldPlay={this.props.shouldPlay}
                    userId={this.userId}
                    videoId={this.replyId}
                    doRender={this.props.doRender}
                    isActive={this.props.isActive}
                />

                {!!this.replyId && !!this.userId && (
                    <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                        <View style={inlineStyles.touchablesBtns}>

                            <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                <ReplyPepoTxBtn
                                    resyncDataDelegate={this.refetchVideoReply}
                                    userId={this.userId}
                                    entityId={this.replyId}
                                />
                                <ShareIcon  userId={this.userId} videoId={this.replyId} />
                                <ReportVideo  userId={this.userId} videoId={this.replyId} />
                            </View>

                            <VideoReplySupporterStat
                                videoId={this.replyId}
                                userId={this.userId}
                            />
                        </View>

                        <VideoBottomStatus
                            userId={this.userId}
                            videoId={this.replyId}
                        />
                    </View>
                )}
            </View>
        );
    }
}

export default withNavigation(VideoReplyRow);
