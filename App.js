import React from 'react';
import { Image, Text } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import Feed from './src/components/Feed';
import Users from './src/components/Users';
import PinInput from './src/components/PinInput';
import Settings from './src/components/Settings';
import LogoutComponent from './src/components/LogoutLink';
import SettingsIcon from './src/assets/settings_icon_selected.png';
import UsersIcon from './src/assets/user_icon_selected.png';
import FeedIcon from './src/assets/wallet_icon_selected.png';
import feedReduxHandler from './src/components/Feed/feedReduxHandler';

const HomeScreen = createBottomTabNavigator(
  {
    Feed: createStackNavigator(
      {
        FeedContent: {
          screen: feedReduxHandler,
          navigationOptions: {
            headerTitle: 'Feed',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        },
        PinScreen: {
          screen: PinInput,
          navigationOptions: {
            headerTitle: 'Pin Input',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        }
      },
      {
        navigationOptions: {
          tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={FeedIcon} style={{ tintColor }} />
        }
      }
    ),
    Users: createStackNavigator(
      {
        Users: {
          screen: Users,
          navigationOptions: {
            headerTitle: 'Users',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        }
      },
      {
        navigationOptions: {
          tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={UsersIcon} style={{ tintColor }} />
        }
      }
    ),
    Settings: createStackNavigator(
      {
        SettingsScreen: {
          screen: Settings,
          navigationOptions: {
            headerTitle: 'Settings',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        }
      },
      {
        navigationOptions: {
          tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={SettingsIcon} style={{ tintColor }} />
        }
      }
    )
  },
  {
    tabBarOptions: {
      activeTintColor: '#168dc1',
      inactiveTintColor: '#9b9b9b',
      style: {
        backgroundColor: '#f8f8f8',
        height: 50
      }
    }
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      AuthScreen,
      HomeScreen
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
