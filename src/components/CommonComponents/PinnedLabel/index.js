import React, { PureComponent } from 'react';
import {View, Image , Text} from "react-native";
import reply_video from '../../../assets/video-reply.png';
import inlineStyle from "./styles";

export default (props) => {
    if( props.isPinned ){
      return   <View style={inlineStyle.wrapper}>
        <Image source={reply_video} style={inlineStyles.image} />
        <Text style={inlineStyles.text}>Pinned Video</Text>
      </View>
    }
    return  null;
};
