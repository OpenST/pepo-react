import React, { Component } from 'react';
import { View, Keyboard, FlatList } from 'react-native';

import User from './User';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import styles from './styles';

class InvitesList extends Component {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User userId={item} />;
  };

  getEmptyComponent = () => {
    if (this.props.noResultsFound) {
      this.renderNoResults();
    }
    return null;
  };

  renderNoResults() {
    return <View>No Invitees!</View>;
  }

  render() {
    return (
      <View style={styles.listWrapper}>
        <FlatList
          data={this.props.list}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps={'always'}
          onEndReached={this.props.getNext}
          keyExtractor={this._keyExtractor}
          refreshing={false}
          onEndReachedThreshold={5}
          renderItem={this._renderItem}
          ListEmptyComponent={this.getEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

export default flatlistHOC(InvitesList, {
  keyPath: 'payload.user_id',
  silentRefresh: true
});
