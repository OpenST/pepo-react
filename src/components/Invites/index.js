import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import styles from './styles';
import Colors from '../../theme/styles/Colors';
import BackArrow from '../CommonComponents/BackArrow';
import PepoApi from '../../services/PepoApi';
import CurrentUser from '../../models/CurrentUser';

class Invites extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Invites',
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
    this.state = {};
  }

  componentDidMount() {
    // new PepoApi(`/${CurrentUser.getUserId()}/invites`)
    //   .get()
    //   .then((res) => {
    //     this.onInit(res);
    //   })
    //   .catch((error) => {});
    this.onInit(res);
  }

  onInit(res) {}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Accepted Invites & Pepos You’ve Earned</Text>
      </View>
    );
  }
}

export default Invites;
