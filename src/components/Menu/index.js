import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Menu = (props) => (
  <React.Fragment>
    {props.navigation && props.navigation.state.routeName === 'ProfileScreen' && (
      <TouchableOpacity
        style={{ height: 32, width: 35, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
        onPress={props.navigation.openDrawer}
        activeOpacity={0.2}
      >
        <Text style={{ width: 20, height: 2, borderWidth: 1 }}></Text>
        <Text style={{ width: 20, height: 2, borderWidth: 1, marginVertical: 5 }}></Text>
        <Text style={{ width: 20, height: 2, borderWidth: 1 }}></Text>
      </TouchableOpacity>
    )}
  </React.Fragment>
);

export default Menu;
