import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1
  },
  heading: {
    color: Colors.valhalla,
    fontSize: 20,
    marginBottom: 10
  },
  content: {
    color: Colors.valhalla,
    opacity: 0.7,
    textAlign: 'center'
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 25,
    padding: 30
  },
  topWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: Colors.white,
    borderRadius: 7,
    marginBottom: 0
  },
  inviteCode: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bottomWrapper: {
    margin: 25
  },
  middleWrapper: {
    margin: 25
  },
  imageWrapper: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
