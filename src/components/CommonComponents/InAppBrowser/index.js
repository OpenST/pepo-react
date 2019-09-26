import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-navigation';
import { Image, TouchableOpacity, Text, View, Share } from 'react-native';

import inlineStyles from './styles';
import crossIcon from '../../../assets/cross_icon.png';
import BrowserMenu from './BrowserMenu';
import {getHostName} from '../../../helpers/helpers';

export default class InAppBrowserComponent extends Component {
    static navigationOptions = (props) => {
        return {
          headerStyle: inlineStyles.headerStyles,
          headerLeft: <BrowserHeaderLeft {...props}/>,
          headerRight: <BrowserHeaderRight {...props}/>,
          headerTitle: <BrowserHeaderTitle {...props}/>
        };
      };

    constructor(props){
        super(props);
        this.url =  this.props.navigation.getParam('browserUrl');
        this.props.navigation.setParams({
         reload: this.reload,
         share: this.share
        })
        this.webview = null;
    }

    componentWillUnmount(){
      this.url = "about:blank"
    }

    reload = ()=>{
      this.webview.reload();
    }

    share = async()=>{
      let content = {
        message: this.props.navigation.getParam('browserUrl'),
        title: this.props.navigation.getParam('title')
      };
      try {
        const result = await Share.share(content);
      } catch (error) {
        alert(error.message);
      }
    }

    setHeader = ( title )=>{
      this.props.navigation.setParams({
        title: title,
        url: getHostName(this.url)
      })
    }

    render() {
        return (
          <SafeAreaView style={{flex: 1}}>
            <WebView
                style={{flex: 1}}
                ref={ref => (this.webview = ref)}
                source={{ uri: this.url }}
                // renderError={errorName => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Wrong URL </Text></View>}
                onLoad={syntheticEvent => {
                  const { nativeEvent } = syntheticEvent;
                  this.setHeader(nativeEvent.title);
                }}
            />
           </SafeAreaView>
        );
    }
}

const BrowserHeaderLeft = (props)=>{
  return (
    <TouchableOpacity
    onPress={() => {
      props.navigation.goBack(null);
    }}
    style={inlineStyles.iconWrapper}
  >
    <Image style={inlineStyles.crossIconSkipFont} source={crossIcon}></Image>
  </TouchableOpacity>
  )
}

const BrowserHeaderRight = (props)=>{
  const url =  props.navigation.getParam('browserUrl');
  const reloadDelegate =  props.navigation.getParam('reload');
  const shareDelegate =  props.navigation.getParam('share');
  return (
    <BrowserMenu url={url} share={shareDelegate} reload={reloadDelegate}/>
  )
}

const BrowserHeaderTitle = (props)=>{
  return (
    <View>
      <Text numberOfLines={1} style={inlineStyles.headerText}>{props.navigation.getParam('title')}</Text>
      <Text style={inlineStyles.headerSubText}>{props.navigation.getParam('url')}</Text>
    </View>
  )
}