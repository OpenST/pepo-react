import React, { PureComponent } from 'react';
import {View,Image,TouchableOpacity} from 'react-native';
import VideoRowComponent from "../../UserVideoHistory/UserVideoHistoryRow";
import TopStatus from "../../Home/TopStatus";
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";
import inlineStyles from './styles'
import historyBack from "../../../assets/user-video-history-back-icon.png";
import Utilities from '../../../services/Utilities';
import reduxGetter from '../../../services/ReduxGetters';
import ReduxGetters from '../../../services/ReduxGetters';
import DataContract from '../../../constants/DataContract';
import DeletedVideoInfo from '../DeletedVideoInfo';
import VideoReplyRow from '../../FullScreenReplyCollection/VideoReplyRow';

class VideoReplyPlayer extends PureComponent {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          headerBackTitle: null,
          header: null
        };
      };

    constructor(props){
        super(props);
        this.replyDetailId =  this.props.navigation.getParam('replyDetailId');
        this.videoId = ReduxGetters.getReplyEntityId(this.replyDetailId); //Check for entity deleted 
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null,
          isDeleted : reduxGetter.isVideoEntityDeleted(this.videoId)
        };
        this.refetchVideo();
        this.isActiveScreen = true;
    }

    componentDidMount(){
      this.willFocusSubscription = this.props.navigation.addListener('willFocus', (payload) => {
        this.isActiveScreen = true ;
      });

      this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
        this.isActiveScreen =  false ;
      });
    }

    componentWillUnmount(){
      this.onRefetchVideo = () => {};
      this.willFocusSubscription && this.willFocusSubscription.remove();
      this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
      return this.isActiveScreen;
    };

    refetchVideo = () => {
      if (this.state.isDeleted) return;
      new PepoApi(DataContract.replies.getSingleVideoReplyApi(this.replyDetailId))
        .get()
        .then((res) => { this.onRefetchVideo(res) })
        .catch((error) => {});
    };

    onRefetchVideo = ( res ) => {
      if(Utilities.isEntityDeleted(res)){
        this.setState({isDeleted: true});
        return;
      }
      const users = deepGet(res , "data.users") || {} ,
            userKeys =  Object.keys(users) || [] ,
            userId = userKeys[0] || null;
      if(userId){
        this.setState({ userId : userId});
      }
    };

    render() {
        if(this.state.isDeleted){
         return <DeletedVideoInfo/>
        }else{
          return (
            <View style={{flex:1}}>
              <TopStatus />
              <VideoReplyRow shouldPlay={this.shouldPlay}
                    isActive={true}
                    doRender={true}
                    userId={this.state.userId}
                    replyDetailId={this.replyDetailId}
              />
             {/* // {TODO @Preshita move to common component } */}
              <TouchableOpacity onPressOut={()=>this.props.navigation.goBack()} style={inlineStyles.historyBackSkipFont}>
                <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
              </TouchableOpacity>
            </View>
          )
        }
    }
}

export default  VideoReplyPlayer ;