import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // position: 'relative',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    // paddingBottom: 10,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    // borderColor: '#dd0017',
    borderWidth: 1,
    // borderBottomWidth: 0,
    // borderLeftWidth: 0.5,
    // borderRightWidth: 0.5,
    // overflow: 'hidden',
    //android shadow
    elevation: 8
    //ios shadow
    // shadowOffset: { width: 10, height: 10 },
    // shadowColor: 'black',
    // shadowOpacity: 1,
    // elevation: 3,
    // backgroundColor : "#0000" // invisible color
  },
  tabElement: {
    alignSelf: 'center',
    marginBottom: 3,
    height: 23,
    width: 23
  },
  tabElementFriends: {
    alignSelf: 'center',
    marginBottom: 3,
    height: 22,
    width: 35
  }
  // overlayBtn: {
  //   position: 'absolute',
  //   left: Dimensions.get('window').width / 2 - 27,
  //   top: -20,
  //   borderColor: 'rgb(233,233,233)',
  //   backgroundColor: 'rgb(233,233,233)',
  //   height: 55,
  //   width: 55,
  //   borderWidth: 2,
  //   borderRadius: 50
  // }
});
