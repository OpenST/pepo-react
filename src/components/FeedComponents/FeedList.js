import React, { Component } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import FeedRow from '../FeedComponents/FeedRow';
import { FetchServices } from '../../services/FetchServices';

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      refreshing: false,
      loadingNext: false
    };
    if (this.props.fetchUrl) {
      this.fetchServices = new FetchServices(this.props.fetchUrl);
    }
  }

  componentDidMount() {
    if (!this.fetchServices) return;
    this.initList();
  }

  initList() {
    this.refresh();
  }

  refresh() {
    if (this.state.refreshing) return;
    this.beforeRefresh();
    this.fetchServices
      .refresh()
      .then((res) => {
        this.onRefresh(res);
      })
      .catch((error) => {  
        this.onRefreshError(error);
      });
  }

  beforeRefresh() {
    this.setState({ refreshing: true });
    this.props.beforeRefresh && this.props.beforeRefresh();
  }

  onRefresh(res) {
    this.setState({ refreshing: false, feeds: this.fetchServices.getIDList() });
    this.props.onRefresh && this.props.onRefresh(res);
  }

  onRefreshError(error) {
    this.setState({ refreshing: false });
    this.props.onRefreshError && this.props.onRefreshError(error);
  }

  getNext = () => {
    if (this.state.loadingNext || this.state.refreshing) return;
    this.beforeNext();
    this.fetchServices
      .fetch()
      .then((res) => {
        this.onNext(res);
        this.setState({ feeds: this.fetchServices.getIDList() });
      })
      .catch((error) => {
        this.onNextError(error);
        console.log('getFeedList error', error);
      });
  };

  beforeNext() {
    this.setState({ loadingNext: true });
    this.props.beforeNext && this.props.beforeNext();
  }

  onNext(res) {
    this.setState({ loadingNext: false });
    this.props.onNext && this.props.onNext(res);
  }

  onNextError(error) {
    this.setState({ loadingNext: false });
    this.props.onNextError && this.props.onNextError(error);
  }

  renderFooter = () => {
    if (!this.state.loadingNext) return null;
    return <ActivityIndicator />;
  };

  render() {
    return (
      <FlatList
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        style={[this.props.style]}
        data={this.state.feeds}
        onEndReached={this.getNext}
        onRefresh={() => {
          this.refresh();
        }}
        keyExtractor={(item, index) => `id_${item}`}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
        refreshing={this.state.refreshing}
        ListHeaderComponent={this.props.ListHeaderComponent ? this.props.ListHeaderComponent : <View></View>}
        ListFooterComponent={this.renderFooter}
        renderItem={({ item }) => <FeedRow id={item} nestedNavigation={this.props.nestedNavigation ? true : false} />}
      />
    );
  }
}

export default FeedList;
