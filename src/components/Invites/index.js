import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

import styles from './styles';
import Colors from '../../theme/styles/Colors';
import BackArrow from '../CommonComponents/BackArrow';
import PepoApi from '../../services/PepoApi';
import CurrentUser from '../../models/CurrentUser';
import Pagination from '../../services/Pagination';
import User from './User';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import InvitesList from './InvitesList';

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
    this.state = {
      noResultsFound: false
    };
  }

  onRefresh = (result) => {
    let noResultsFound = result && result.length === 0;
    this.setState({
      noResultsFound
    });
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
        <Text style={styles.header}>Accepted Invites</Text>
        <InvitesList
          fetchUrl={`/users/search?q=test`}
          onRefresh={this.onRefresh}
          noResultsFound={this.state.noResultsFound}
        />
      </SafeAreaView>
    );
  }
}

export default flatlistHOC(Invites);
