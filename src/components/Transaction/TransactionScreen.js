import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import Giphy from '../Giphy';

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Giphy />
      </View>
    );
  }
}

export default TransactionScreen;
