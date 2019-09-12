import React, { PureComponent } from 'react';
import { View, Text, Linking, Image } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import inlineStyles from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import reduxGetter from '../../services/ReduxGetters';

import multipleClickHandler from '../../services/MultipleClickHandler';
import { getSocialIcon } from '../../helpers/helpers';
import InAppBrowser from '../../services/InAppBrowser';
import BrowserEmitter from '../../helpers/BrowserEmitter';
import Utilities from '../../services/Utilities';

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    description: reduxGetter.getVideoDescription(reduxGetter.getVideoDescriptionId(ownProps.videoId, state), state),
    link: reduxGetter.getVideoLink(reduxGetter.getVideoLinkId(ownProps.videoId, state), state),
    supporters: reduxGetter.getVideoSupporters(ownProps.videoId),
    totalBt: reduxGetter.getVideoBt(ownProps.videoId, state)
  };
};

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
  }

  onWrapperClick = (e) => {
    this.props.onWrapperClick && this.props.onWrapperClick();
  };

  render() {
    return (
      <View style={inlineStyles.bottomBg}>
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.onWrapperClick())} pointerEvents={'auto'}>
          <View style={{ paddingTop: 8, paddingBottom: 5, paddingHorizontal: 12 }}>
            <Text style={[inlineStyles.handle]} ellipsizeMode={'tail'} numberOfLines={1}>
              {`@${this.props.userName}`}
            </Text>
            {this.props.description ? (
              <Text
                style={[{ fontSize: 14, flexWrap: 'wrap' }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={3}
              >
                {this.props.description}
              </Text>
            ) : (
              <Text />
            )}
          </View>
        </TouchableWithoutFeedback>
        {this.props.link ? (
          <TouchableWithoutFeedback
            onPress={multipleClickHandler(() => {
              BrowserEmitter.emit('browserOpened');
              setTimeout(() => {
                InAppBrowser.openBrowser(this.props.link);
              }, 0);
            })}
            pointerEvents={'auto'}
          >
            <View
              style={{
                borderTopWidth: 0.5,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image style={{ height: 20, width: 20 }} source={getSocialIcon(this.props.link, 'HOME_FEED')} />
              <Text
                style={[{ fontSize: 14, paddingVertical: 8, paddingLeft: 8 }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {this.props.link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <React.Fragment />
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(BottomStatus));
