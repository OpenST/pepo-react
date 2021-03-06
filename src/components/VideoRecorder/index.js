import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  BackHandler,
  AppState,
  Alert
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import deleteCameraSegment  from '../../assets/delete_camera_segment.png';
import flipIcon from '../../assets/flip_camera.png';
import styles from './styles';
import reduxGetters from '../../services/ReduxGetters';
import RNFS from 'react-native-fs';
import { ActionSheet } from 'native-base';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import closeIcon from '../../assets/camera-cross-icon.png';
import { withNavigation } from 'react-navigation';
import AppConfig from '../../constants/AppConfig';
import LinearGradient from "react-native-linear-gradient";
import multipleClickHandler from "../../services/MultipleClickHandler";
import Toast from "../../theme/components/NotificationToast";
import RecordActionButton from './RecordActionButton';
import Utilities from '../../services/Utilities';
import FfmpegProcesser from '../../services/FfmpegProcesser';
import ProgressBar from '../CommonComponents/ProgressBarWrapper';
import VideoLenthPreferences from './VideoLenthPreferences';
import CoachScreen from './CoachScreen';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Continue'];
const ACTION_SHEET_CONTINUE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;
const PROGRESS_REFRESH_INTERVAL = 300;
const MIN_VIDEO_LENGTH_IN_SEC = 1;

const TAP_TO_RECORD = AppConfig.videoRecorderConstants.tabToRecord;
const LONG_PRESS_TO_RECORD = AppConfig.videoRecorderConstants.longPressToRecord;

class VideoRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      acceptedCameraTnC: this.props.acceptedCameraTnC,
      showLightBoxOnReply: this.props.showLightBoxOnReply,
      cameraFrontMode: true,
      isLocalVideoPresent: false,
      currentMode: null,
      showDurationPreference: true
    };
    /*
     these variables are used because setting state variables is async task
   */
    this.shallowCurrentMode = null;
    this.shallowIsRecording = false;
    this.stoppedUnexpectedly = false;
    this.actionButtonDisabled = false;
    this.isBackgroundHonoured = false;
    this.lastUpdateProgressTimeStamp = 0;
    this._progressRef = null;
    this.progress = 0;
    this.intervalID = null;
    this.videoUrlsList = [];
    this.separationBars = [];
    this.camera = null;
    this.videoLength = 0;
    this.recordedVideoObj = reduxGetters.getRecordedVideo();
    this.correctedRecordingDelay = AppConfig.videoRecorderConstants.recordingDelay;
    this.currentVideoMaxLength = AppConfig.videoRecorderConstants.videoLenthPreferences['30'];


    Utilities.getItem(AppConfig.videoRecorderConstants.recordingDelayKey).then((value)=>{
      value =  Number(value);
      if(value){
        this.correctedRecordingDelay = value;
      }
    });

  }

  getCurrentVideoMaxLength = () => {
    return this.currentVideoMaxLength ;
  }

  setCurrentVideoMaxLength =( val ) => {
    if(!val) return;
    this.currentVideoMaxLength = val; 
  }

  getBufferdMaxDuration = () => {
    return ( this.getCurrentVideoMaxLength() -  MIN_VIDEO_LENGTH_IN_SEC  ) * 1000
  }

  progressFactor = () => (1/(this.getCurrentVideoMaxLength()*1000))*(this.actualProgressRefreshInterval || PROGRESS_REFRESH_INTERVAL);

  accidentalGoToPreviewScreen = () => {
    this.stoppedUnexpectedly = false;
    this.videoUrlsList.length && this.props.goToPreviewScreen(this.videoUrlsList, this.videoLength,  this.getCurrentVideoMaxLength());
  };

  _handleAppStateChange = (nextAppState) => {
      //On Android video recording is stopped by the module itself so no throttel.
      if(Utilities.isAndroid()){
        if(nextAppState === 'inactive' || nextAppState === 'background') {
          this._onAppStateChangeToBackground();
        }
      }else {
        if( !this.isBackgroundHonoured &&  (nextAppState === 'inactive' || nextAppState === 'background' )) {
          this.isBackgroundHonoured = true;
          this._onAppStateChangeToBackground();
        }
      }
  };

  _onAppStateChangeToBackground = ( ) => {
      if (this.isRecording()){
        this.stoppedUnexpectedly = true;
        this.stopRecording();
      } else {
        this.accidentalGoToPreviewScreen();
      }
    };


  componentDidUpdate(prevProps, prevState){
    if( prevProps.acceptedCameraTnC != this.props.acceptedCameraTnC ){
     this.setState({acceptedCameraTnC: this.props.acceptedCameraTnC })
    }
    if ( prevProps.showLightBoxOnReply != this.props.showLightBoxOnReply ) {
      this.setState({showLightBoxOnReply: this.props.showLightBoxOnReply })
    }
  }

  isStaleReduxObjectPresent(){
     let acceptableKeys = ['reply_obj', 'video_type', 'video_desc'];
     for (let key in this.recordedVideoObj) {
      if (! acceptableKeys.includes(key)){
        return true;
      }
     }
     return false;
  }

  async componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.actionSheetOnRecordVideo) {
      let isFileExists = await this.ifLocalVideoPresent();
      const oThis = this;
      if (isFileExists) {
        this.setState({ isLocalVideoPresent: true });
        setTimeout(function() {
          oThis.showActionSheet();
        }, 100);
      } else if (this.isStaleReduxObjectPresent()) {
        Store.dispatch(
          upsertRecordedVideo({
            do_discard: true
          })
        );
      } else {
        this.props.saveVideoPrimaryInfo();
      }
    }
  }

  showActionSheet() {
    ActionSheet.show(
      {
        options: ACTION_SHEET_BUTTONS,
        title: this.props.getActionSheetText(this.recordedVideoObj)
      },
      (buttonIndex) => {
        if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
          // This will start reshoot

          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          this.props.saveVideoPrimaryInfo();
        } else if (buttonIndex == ACTION_SHEET_CONTINUE_INDEX) {
          //navigate to previous page
          this.props.proceedWithExistingVideo(this.recordedVideoObj);
        }
      }
    );
  }

  cancelVideo = () => {
    this.stopRecording();
  };

  _handleBackPress = () => {
    this.cancelVideo();
  };

  cancleVideoHandling = () => {
    this.cancelVideo();
    this.props.navigation.goBack(null);
    ActionSheet.hide();
  };

  acceptCameraTerms = () => {
    this.setState({
      acceptedCameraTnC: 'true'
    });
  };

  replyToVideo = () => {
    this.setState({
      showLightBoxOnReply: false
    });
  };

  flipCamera = () => {
    this.setState({ cameraFrontMode: !this.state.cameraFrontMode });
  };


  ifLocalVideoPresent = async  () => {
    let recordedVideoList = this.recordedVideoObj.raw_video_list || [];
    recordedVideoList = recordedVideoList.map((ele)=>ele.uri);
    if (recordedVideoList.length === 0){
      return false;
    }

    for (let video of recordedVideoList){
      let isFileExists = await RNFS.exists(video);
      if (!isFileExists){
        return false;
      }
    }
    return true;
  };

  showCoachForPosting = () => {
    return <CoachScreen videoId={this.props.videoId}
                        isLocalVideoPresent={this.state.isLocalVideoPresent}
                        acceptedCameraTnC={this.state.acceptedCameraTnC}
                        acceptCameraTerms={this.acceptCameraTerms}
                        isVideoTypeReply={this.props.isVideoTypeReply}
                        showLightBoxOnReply={this.state.showLightBoxOnReply}
                        cancleVideoHandling={this.cancleVideoHandling}
                        replyToVideo={this.replyToVideo}
                        />
  };

  cameraView() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          keepAudioSession={true}
          style={styles.cameraViewSkipFont}
          type={this.state.cameraFrontMode ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          ratio={AppConfig.cameraConstants.RATIO}
          zoom={0}
          pictureSize={AppConfig.cameraConstants.PICTURE_SIZE}
          captureMode='video'
          notAuthorizedView={
            <View>
              <Text>The camera is not authorized!</Text>
            </View>
          }
          pendingAuthorizationView={
            <View>
              <Text>The camera is pending authorization!</Text>
            </View>
          }
          defaultVideoQuality={RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY]}
          defaultMuted={false}
        >
          {this.showCoachForPosting()}
          {this.showCameraActions()}
        </RNCamera>
      </View>
    );
  }


  shouldShowActionButtons = () => {

    if (this.state.isLocalVideoPresent){
      // If local video present, coach screen will not be seen. So we need to show action buttons.
      return true;
    }

    if (this.props.isVideoTypeReply){
      // If video type is reply and has video replies then we will not show coach and we need to show action buttons
      return !this.state.showLightBoxOnReply;
    } else {
      // If video type is post and terms and conditions are accepted then we will not show coach and we need to show action buttons
      return this.state.acceptedCameraTnC === 'true';
    }

  };

  plotSeparationBars = () => {
    let plotBars = this.separationBars.map((ele)=> ele);
    return plotBars;
  };

  askCancelConfirmation = () => {
    if (this.videoLength > 0){
      Alert.alert(
        '',
        'Video segments will be discarded. Do you want to continue?',
        [
          {text: 'Confirm', onPress:  this.cancleVideoHandling},
          {
            text: 'Cancel',
            style: 'cancel'
          }

        ],
        {cancelable: true},
      );
    } else {
      this.cancleVideoHandling();
    }
  };

  setProgressBarRef = (ref) => {
    this._progressRef = ref;
  };

  updateProgress = (val) => {
    this.progress = val;
    this._progressRef && this._progressRef.updateProgress(val);
  };



  showCameraActions = () => {
    if (this.shouldShowActionButtons()) {
      return (
        <React.Fragment>
          <View style={{position: 'relative', height: 7, width: '90%'}}>
            <ProgressBar ref={this.setProgressBarRef} style={styles.progressBar}/>
            <React.Fragment>
              {this.plotSeparationBars()}
            </React.Fragment>
          </View>
          {this.showCancelVideoCTA()}
          <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
            <View>
              {/*{this.showTooltip()}*/}
              <View style={styles.bottomWrapper }>
                {this.flipButton()}
                {this.getActionButton()}
                {this.previewButton()}
              </View>

              {/*{this.renderModeRow()}*/}
            </View>
          </View>
         {this.state.showDurationPreference && <VideoLenthPreferences getInitialPref={this.getCurrentVideoMaxLength}
                                onChange={this.setCurrentVideoMaxLength}/>}
        </React.Fragment>
      );
    }
  };

  showCancelVideoCTA = () => {
    if (this.isRecording()){
      return null;
    }
    return <TouchableOpacity onPressIn={this.askCancelConfirmation } style={styles.closeBtWrapper}>
      <Image style={styles.closeIconSkipFont} source={closeIcon} />
    </TouchableOpacity>

  };

  previewPressHandler = () => {
    if (this.isRecording()) return;
    // This will take from VideoRecorder to PreviewRecordedVideo component
    if(this.videoLength <= 1000) {
      Toast.show({text:'Please create longer video', icon: 'error' });
      return;
    }
    this.props.goToPreviewScreen(this.videoUrlsList, this.videoLength ,  this.getCurrentVideoMaxLength());
  };

  onBackPress = () => {
    Alert.alert(
      '',
      'Are you sure you want to delete last segment?',
      [
        {text: 'Confirm', onPress:  this.deleteLastSegment },
        {
          text: 'Cancel',
          style: 'cancel'
        }

      ],
      {cancelable: true},
    );
  };

  deleteLastSegment = () => {
    if(this.videoUrlsList.length > 0 ){
      let lastElementIndex = this.videoUrlsList.length - 1;
      let lastSegment = this.videoUrlsList[lastElementIndex] || {};
      this.videoLength = this.videoLength -  lastSegment.durationInMS;
      this.videoUrlsList.pop();
      let lastSegmentProgress = (this.videoUrlsList[lastElementIndex - 1] || {}).progress || 0;
      this.updateProgress(lastSegmentProgress);

      if(this.separationBars.length > 0){
        this.separationBars.pop();
      }

      if(this.videoUrlsList.length == 0){
        this.setState({showDurationPreference: true});
      }else{
        this.forceUpdate();
      }
      
    }
  };

  goToLastProgress = () => {
    let lastElementIndex = this.videoUrlsList.length - 1;
    let lastSegment = this.videoUrlsList[lastElementIndex] || {};
    let lastSegmentProgress =   lastSegment.progress || 0;
    this.updateProgress(lastSegmentProgress);
  };

  previewButton = () => {
    if (this.isRecording() || this.videoUrlsList.length === 0) {
      return <View style={{flex:1}}/>
    }
    return <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={this.onBackPress}>
        <Image style={styles.backIconSkipFont} source={deleteCameraSegment}/>
      </TouchableOpacity>
      <LinearGradient
        colors={['#ff7499', '#ff5566']}
        locations={[0, 1]}
        style={{
          borderRadius: 3,
          paddingLeft: 10,
          paddingRight: 10,
          marginLeft: 12
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          onPress={multipleClickHandler(() => {
            this.previewPressHandler()
          })}
            style={{ height: 40,  alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 12 }}>PREVIEW</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/*<View style={styles.triangleRight}></View>*/}
    </View>
    </View>
  };

  cameraStopRecording = () => {
    this.camera && this.camera.stopRecording();
  };

  stopRecording = (stopNativeRecording = true) => {
    // Stop camera recording
    // this.stoppedByAction = true;
    // Stop button animation
    stopNativeRecording && this.cameraStopRecording();
    this.recordActionButton && this.recordActionButton.stopAnimation();
    // Release button disabled status as soon as video recording completed or failed.
    this.recordActionButton && this.recordActionButton.styleAsDisabled(false);
    //Just incase of video recording ends before the time starts.
    clearTimeout(this.preRecordingTimeOut);
    // for clearInterval
    this.intervalManager(false);
    //Change recording flag to false and current mode to null
    this.stopRecordingStateUpdate();
  };

  stopRecordingStateUpdate(){
    this.changeIsRecording(false,  {currentMode: null});
  }

  appendNewBar = () => {
    let progress = this.progress * 100;
    // for last segment we need a invisible view else there will be a problem when segment is deleted.
    // That is why height :0 , width : 0 is given
    // Problem: On every delete segment, we delete one red segment line and one white separator.
    this.separationBars.push((
      <View key={`progress-${Date.now()}`} style={[styles.separationBarsStyle, {left: `${progress}%`}, progress >= 100 ? {height:0, width:0} : {}]}>
      </View>));
  };

  handleOnPressIn = () => {
    if(this.isRecording()){
      this.stopRecording();
    } else {
      this.recordVideoAsync();
    }
  };

  handleOnPressOut = () => {
     if (this.isLongPressRecordingMode() && this.isRecording()){
      this.stopRecording();
    }
  };

  handleOnPress = () => {
    if (this.isRecording()) {
      this.changeCurrentMode(TAP_TO_RECORD);
    } else {
      // Just for safety.
      this.changeCurrentMode(null);
    }
  };

  handleOnLongPress = () => {
    if (this.isRecording()) {
      this.changeCurrentMode(LONG_PRESS_TO_RECORD);
    } else {
      // Just for safety.
      this.changeCurrentMode(null);
    }
  };

  stopIcon = () => <View style={styles.squareIcon} />;

  captureIcon = () => <View style={[styles.innerCircle]} />;

  getIcon = () => {
    if (this.isRecording()){
      return this.state.currentMode === TAP_TO_RECORD ? this.stopIcon() : this.captureIcon();
    } else {
      return this.captureIcon();
    }
  };

  isVideoDurationBufferReached(length){
    return length >= this.getBufferdMaxDuration() ;
  }

  getActionButton() {
    if(this.isVideoDurationBufferReached(this.videoLength) ){
      this.actionButtonDisabled = true;
    } else {
      this.actionButtonDisabled = false;
    }

    return <RecordActionButton
      disabled={this.actionButtonDisabled}
      onPressIn={this.handleOnPressIn}
      onPressOut={this.handleOnPressOut}
      onPress={this.handleOnPress}
      onLongPress={this.handleOnLongPress}
      ref={(ref) => (this.recordActionButton = ref)}
    >{this.getIcon()}</RecordActionButton>
  }

  flipButton() {
    if (!this.isRecording()) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={this.flipCamera} activeOpacity={0.75}>
            <Image style={styles.flipIconSkipFont} source={flipIcon} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return ( <View style={{flex:1}} /> )
    }
  }

  progressBarStateUpdate = () => {
    if(!this.isRecording()) return;
    let currentProgress =  this.progress;
    this.actualProgressRefreshInterval = this.lastUpdateProgressTimeStamp ?
      (Date.now() - this.lastUpdateProgressTimeStamp) : PROGRESS_REFRESH_INTERVAL;
    this.lastUpdateProgressTimeStamp = Date.now();
    let factor = this.progressFactor();
    let progress = currentProgress + factor;
    if (currentProgress <= 1) {
      this.updateProgress(progress);
    } else {
      this.stopRecording();
    }
  };

  initProgressBar() {
    this.intervalManager(true , this.progressBarStateUpdate, PROGRESS_REFRESH_INTERVAL);
  }

  intervalManager(flag, animate, time) {
    if(flag){
      this.intervalID =  setInterval(animate, time);
    } else {
      clearInterval(this.intervalID);
    }

  }

  preRecording = () => {
    //Start after some delya as actual recording starts after some delay.
    clearTimeout(this.preRecordingTimeOut);
    this.preRecordingTimeOut = setTimeout(() => {
      this.progressBarStateUpdate();
      this.initProgressBar();
      this.recordActionButton && this.recordActionButton.styleAsDisabled(false);
      this.recordActionButton && this.recordActionButton.loopedAnimation().start();
    }, this.correctedRecordingDelay);
    this.recordActionButton && this.recordActionButton.styleAsDisabled(true);
    this.changeIsRecording(true , {showDurationPreference: false} );
  };

  getRecordingOptions = () => {
    return {
      quality: RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY],
      base64: true,
      muted: false,
      orientation:  'portrait',
      maxDuration: this.getCurrentVideoMaxLength()
    };
  };

  recordVideoAsync = async () => {
    if (!this.camera) return;
    this.lastUpdateProgressTimeStamp = 0;
    this.preRecording();
    let data, assumedStartTime, endTime
    ;
    try {
        assumedStartTime = Date.now() + this.correctedRecordingDelay;
        data = await this.camera.recordAsync(this.getRecordingOptions());
    } catch(exception) {
      this.goToLastProgress();
      this.stopRecording();
      return;
    }

    this.stopRecording(false);
    endTime = Date.now();

    //Stop recording

    //Sanitize Segments
    await this.sanitizeSegments(data, (endTime - assumedStartTime));

    // Just to re-render
    this.forceUpdate();

    //If application goes Inactive while recording go to preview screen
    if(this.stoppedUnexpectedly) {
      this.accidentalGoToPreviewScreen();
    }
  };

  recordingDelayCorrection = (duration, durationByCode) => {
      const correctionVal =  this.correctedRecordingDelay - (duration - durationByCode);
      this.setCorrectionValue( correctionVal );
      // let logMsg = `FFmpeg ${duration.toFixed(2)} Code ${durationByCode.toFixed(2)} Delay ${this.correctedRecordingDelay.toFixed(2)}`;
      // Toast.show({text:logMsg, icon: 'success'});
      Utilities.saveItem(AppConfig.videoRecorderConstants.recordingDelayKey, this.correctedRecordingDelay);
  };

  setCorrectionValue(val){
    if(!val) return;
    if (val < (5 * AppConfig.videoRecorderConstants.recordingDelay)){
      let valToSet = Utilities.isAndroid() ? Math.min(val, AppConfig.videoRecorderConstants.recordingDelay) : val;
      this.correctedRecordingDelay =  valToSet;
    }
  }

  getLastSegmentProgress = () => {
    if (this.videoUrlsList.length > 1){
      return this.progress - this.videoUrlsList[this.videoUrlsList.length - 2].progress;
    } else {
      return this.progress;
    }
  };

  sanitizeSegments = async (data, durationByCode ) => {
    let videoInfo;
    FfmpegProcesser.init([data.uri]);
    try{
      videoInfo = await FfmpegProcesser.getVideoInfo();
    } catch (e){
      this.goToLastProgress();
      return ;
    }

    // Try parsing to get the video duration else use durationByCode
    if(!videoInfo.duration) {
      let duration = this.getVideoDurationFromRawInformation(videoInfo.rawInformation);
      if(duration){
        videoInfo.duration = duration;
      } else {
        videoInfo.duration = durationByCode;
      }
    }

    if ( videoInfo.duration >= (MIN_VIDEO_LENGTH_IN_SEC * 1000)) {
      this.videoLength += videoInfo.duration;
      this.videoUrlsList.push({uri: data.uri, progress: this.progress, durationInMS: videoInfo.duration });
      this.recordingDelayCorrection(videoInfo.duration, durationByCode);
      this.correctProgress();
      this.appendNewBar();
    } else {
      this.goToLastProgress();
    }

    if(this.videoUrlsList.length == 0){
     this.setState({showDurationPreference: true});
    }
  };

  getVideoDurationFromRawInformation = (rawInformation) => {
    if(rawInformation && rawInformation.trim() === '') return;

    const regex = /duration:(\s)*([0-9]{2,2}:[0-9]{2,2}:[0-9]{2,2}[0-9.]*)/gi;
    let matches = regex.exec(rawInformation);

    if(matches && matches[2]){
      let timestamp = matches[2];
      let timestampParts = timestamp.split(':');
      let duration = (timestampParts[0] * (60*60*1000)) + (timestampParts[1] * (60*1000)) + (timestampParts[2] * (1000));
      if(duration > 1) return duration;
    }



  };

  correctProgress = () => {
    let correctedProgress = (this.videoLength / 1000) / this.getCurrentVideoMaxLength();
    this.updateVideoUrlsListProgress(correctedProgress);
    if(this.isVideoDurationBufferReached(this.videoLength)){
      correctedProgress =  1;
    }
    this.updateProgress(correctedProgress);
  };

  updateVideoUrlsListProgress = (correctedProgress) => {
    let lastIndex = this.videoUrlsList.length - 1;
    if (lastIndex < 0 ){
      return;
    }
    this.videoUrlsList[lastIndex] = {...this.videoUrlsList[lastIndex], ...{progress:correctedProgress}}
  };

  getCurrentSegmentProgress() {
    let progress = this._progressRef.getProgress();
    if (this.videoUrlsList.length >= 1){
      return progress - this.videoUrlsList[this.videoUrlsList.length - 1].progress ;
    } else {
      return progress;
    }
  }


  changeIsRecording = (isRecording , state={}) => {
    state["isRecording"] = isRecording;
    this.shallowIsRecording = isRecording;
    if(state.hasOwnProperty("currentMode")){
      this.shallowCurrentMode = state["currentMode"];
    }
    this.setState(state);
  };

  changeCurrentMode = (currentMode, state={}) => {
    state["currentMode"] = currentMode ;
    this.shallowCurrentMode = currentMode;
    this.setState(state);
  };

  isRecording = () => {
    return this.state.isRecording || this.shallowIsRecording ;
  };

  isLongPressRecordingMode =( ) => {
    return this.state.currentMode === LONG_PRESS_TO_RECORD || this.shallowCurrentMode === LONG_PRESS_TO_RECORD ;
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    this.recordVideoAsync = () => {};
    this.progressBarStateUpdate = () => {};
    this.stopRecording = () => {};
    this.goToLastProgress = () => {};
    this.acceptCameraTerms = () => {};
    this.replyToVideo = () => {};
    this.flipCamera = () => {};
    this.handleOnPressIn = () => {};
    this.handleOnPressOut = () => {};
    this.handleOnPress = () => {};
    this.handleOnLongPress = () => {};
  }

  render() {
    return this.cameraView();
  }
}

//make this component available to the app
export default withNavigation(VideoRecorder);
