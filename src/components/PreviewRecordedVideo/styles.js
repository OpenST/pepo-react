import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions, StatusBar } from 'react-native';

let stylesMap = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height    
  },
  previewVideoSkipFont: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  progressBar: {
    position: 'absolute',
    top: 40,
    borderRadius: 3.5,
    borderColor: Colors.white,
    borderWidth: 0.5,
    height: 7,
    width: '90%',
    alignSelf: 'center'
    // marginLeft: 10,
    // marginRight: 10
  },
  cancelButton: {
    position: 'absolute',
    top: 55,
    height: 50,
    width: 50,
    marginLeft: 20
  },
  cancelText: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  bottomControls: {
    // flex: 1,
    position: 'absolute',
    bottom: 40,
    zIndex: 2,
    flexDirection: 'row',
    width: '50%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playIconSkipFont: {
    width: 65,
    height: 65,
    paddingHorizontal: 20,
    marginLeft: -32.5
  },
  // tickIconSkipFont: {
  //   width: 45,
  //   height: 45,
  //   marginRight: 20
  // },
  closeBtWrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: 60,
    width: 60
  },
  closeIconSkipFont: {
    marginTop: 44,
    marginLeft: 20,
    height: 20,
    width: 20
  },
  triangleRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 22,
    borderTopWidth: 22,
    borderLeftWidth: 16,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: '#ff5566'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
