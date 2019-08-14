import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  animatedToastView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    height: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  toastBoxInsideText: {
    fontSize: 15,
    textAlign: 'center',
    zIndex: -1
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);