import React from 'react';
import { View, Dimensions, Easing, Animated } from 'react-native';
import { Root } from 'native-base';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createAppContainer
} from 'react-navigation';
import deepGet from 'lodash/get';

import NavigationService from './src/services/NavigationService';
import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import CustomTab from './src/components/CustomTab';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import SayThanksScreen from './src/components/SayThanks';
import Colors from './src/theme/styles/Colors';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import ProfileEdit from './src/components/Profile/ProfileEditScreen';
import HomeScreen from './src/components/Home/HomeScreen';
import { LoadingModalCover } from './src/theme/components/LoadingModalCover';
import UserActivatingScreen from './src/components/UserActivating';
import { LoginPopover } from './src/components/LoginPopover';
import UsersProfileScreen from './src/components/UsersProfile';
import SupportingListScreen from './src/components/SupportingList';
import SupportersListScreen from './src/components/SupportersList';
import CameraWorker from './src/services/CameraWorker';
import PictureWorker from './src/services/PictureWorker';
import UserVideoHistory from './src/components/UserVideoHistory';
import CaptureImage from './src/components/CaptureImage';
import ImageGallery from './src/components/ImageGallery';
import BioScreen from './src/components/Bio';
import CaptureVideo from './src/components/CaptureVideo';
import NotificationScreen from './src/components/Notification';
import { StatusBarManager } from './src/services/StatusBarManager';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import AllowAccessModalScreen from './src/components/AllowAccessModalScreen';
import VideoPlayer from './src/components/CommonComponents/VideoPlayer';
import utilities from './src/services/Utilities';
import { NotificationToastComponent } from './src/theme/components/NotificationToast';
import SocketManager from './src/components/SocketManager';
import SearchScreen from './src/components/Search';
import FanVideoDetails from './src/components/FanVideoDetails';

const customTabHiddenRoutes = ['CaptureVideo'];

const modalStackConfig = {
  headerLayoutPreset: 'center',
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: ({ navigation }) => {
    const routeName = utilities.getLastChildRoutename(navigation.state);
    return {
      tabBarVisible: !customTabHiddenRoutes.includes(routeName)
    };
  }
};

const txModalConfig = {
  transparentCard: true,
  cardStyle: { backgroundColor: 'rgba(0,0,0,0.5)' },
  gesturesEnabled: false,
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;

      const height = layout.initHeight;
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  })
};

const CaptureVideoStack = createStackNavigator({
  CaptureVideo: CaptureVideo,
  FanVideoDetails: FanVideoDetails
});

const HomePushStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const HomeStack = createStackNavigator(
  {
    HomePushStack: HomePushStack,
    TransactionScreen: TransactionScreen,
    CaptureVideo: CaptureVideoStack
  },
  {
    ...modalStackConfig,
    ...txModalConfig
  }
);

const NotificationPushStack = createStackNavigator(
  {
    NotificationScreen: NotificationScreen,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    VideoPlayer: VideoPlayer,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const NotificationStack = createStackNavigator(
  {
    NotificationPushStack: NotificationPushStack,
    TransactionScreen: TransactionScreen,
    SayThanksScreen: SayThanksScreen,
    CaptureVideo: CaptureVideoStack
  },
  { ...modalStackConfig, ...txModalConfig }
);

const ProfilePushStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen,
    UsersProfileScreen: {
        screen: UsersProfileScreen,
        path: 'profile/:userId'
    },
    ProfileEdit: ProfileEdit,
    BioScreen: BioScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const ProfileStack = createStackNavigator(
  {
    ProfilePushStack: ProfilePushStack,
    CaptureImageScreen: CaptureImage,
    ImageGalleryScreen: ImageGallery,
    TransactionScreen: TransactionScreen,
    CaptureVideo: CaptureVideoStack
  },
  {
    headerLayoutPreset: 'center',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: ({ navigation }) => {
      return {
        tabBarVisible: deepGet(navigation, 'state.index') === 0
      };
    },
    ...txModalConfig
  }
);

const SearchPushStack = createStackNavigator(
  {
    SearchScreen: SearchScreen,
    UsersProfileScreen: UsersProfileScreen,
    SupportingListScreen: SupportingListScreen,
    SupportersListScreen: SupportersListScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const SearchStack = createStackNavigator(
  {
    SearchPushStack: SearchPushStack,
    CaptureVideo: CaptureVideoStack
  },
  {
    ...modalStackConfig,
    ...txModalConfig
  }
);

const CustomTabStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Notification: NotificationStack,
    Profile: ProfileStack
  },
  {
    tabBarComponent: CustomTab,
    tabBarPosition: 'bottom',
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: Colors.dark
      },
      headerStyle: {
        backgroundColor: Colors.white
      }
    },
    lazy: true
  }
);

const PinStack = createStackNavigator(
  {
    SetPinScreen: SetPin,
    ConfirmPinScreen: ConfirmPin
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: Colors.dark,
        flex: 1,
        textAlign: 'center'
      },
      headerStyle: {
        backgroundColor: Colors.white
      },
      headerRight: <View />
    }
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    CustomTabStack: CustomTabStack
  },
  {
    drawerPosition: 'right',
    drawerBackgroundColor: '#fff',
    overlayColor: 'rgba(0, 0, 0, 0.8)',
    drawerWidth: Dimensions.get('window').width - Dimensions.get('window').width / 5,
    contentComponent: CustomDrawerContent,
    drawerLockMode: 'locked-closed'
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      AuthScreen,
      PinStack,
      UserActivatingScreen,
      DrawerNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

const uriPrefix = 'pepo://';

const RootNavigationContainer = () => (
  <Root>
    <AppContainer
      uriPrefix={uriPrefix}
      onNavigationStateChange={(prevState, currentState, action) => StatusBarManager(action)}
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
    <CameraWorker />
    <PictureWorker />
    <LoadingModalCover />
    <LoginPopover />
    <AllowAccessModalScreen />
    <NotificationToastComponent />
    <SocketManager />
  </Root>
);

export default RootNavigationContainer;
