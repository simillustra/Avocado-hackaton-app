/* eslint-disable prettier/prettier */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Icon from '../../components/Icon';
import helpers from './../../helpers';
/**
 * This buttons are located on the home page and lead to other parts of the app
 * @param {Object} props
 * @param {String} props.iconName This is the name of the icon (from IonicIcon library) that will be used in the button
 * @param {String} props.text The text shown in the button
 * @param {String} props.color The refers to the color of the text
 * @param {Object|String} props.screenName The refers to the name of the screen the button navgagtes to
 */
const IconButton = ({
  iconName,
  text,
  hasImage,
  color = 'black',
  screenName,
}) => {
  const navigation = useNavigation();

  var imageIcon = '';

  switch (screenName) {
    case 'NWSC':
      imageIcon = require('./../../assets/nwsc.jpeg');
      break;
    case 'UMEME YAKA':
      imageIcon = require('./../../assets/umeme.jpeg');
      break;
    case 'URA':
      imageIcon = require('./../../assets/ura.jpeg');
      break;
    case 'PAY TV':
      imageIcon = require('./../../assets/paytv.jpeg');
      break;

    default:
      break;
  }

  const handlePress = async () => {
    switch (screenName) {
      case 'airtime':
        const airtimeProviders = await helpers.getAction(
          'http://fsi.ng/api/v1/baxipay/services/airtime/providers',
        );

        console.log('airtimeProviders.data.providers', airtimeProviders);
        if (
          airtimeProviders.data.providers instanceof Array &&
          airtimeProviders.data.providers.length > 0
        ) {
          navigation.navigate('Airtime', {
            screenData: airtimeProviders.data.providers,
          });
        }
        break;
      case 'databundle':
        const dataProviders = await helpers.getAction(
          'http://fsi.ng/api/v1/baxipay/services/airtime/providers',
        );
        if (
          dataProviders.data.providers instanceof Array &&
          dataProviders.data.providers.length > 0
        ) {
          navigation.navigate('DataBundle', {
            screenData: dataProviders.data.providers,
          });
        }

        break;
      case 'cabletv':
        const cableTvProviders = await helpers.getAction(
          'http://fsi.ng/api/v1/baxipay/services/cabletv/providers',
        );
        if (
          cableTvProviders.data.providers instanceof Array &&
          cableTvProviders.data.providers.length > 0
        ) {
          navigation.navigate('PayTVPayment', {
            screenData: cableTvProviders.data.providers,
          });
        }

        break;
      case 'electricity':
        const electProviders = await helpers.getAction(
          'http://fsi.ng/api/v1/baxipay/services/electricity/billers',
        );
        if (
          electProviders.data.providers instanceof Array &&
          electProviders.data.providers.length > 0
        ) {
          navigation.navigate('Electricity', {
            screenData: electProviders.data.providers,
          });
        }

        break;

      case 'epin':
        const epinProviders = await helpers.getAction(
          'http://fsi.ng/api/v1/baxipay/services/epin/providers',
        );
        if (
          epinProviders.data.providers instanceof Array &&
          epinProviders.data.providers.length > 0
        ) {
          navigation.navigate('Epin', {
            screenData: epinProviders.data.providers,
          });
        }

        break;

      case 'wallet':
        navigation.navigate('Wallet');
        break;

      case 'account':
        navigation.navigate('Account');
        break;

      case 'virtual':
        navigation.navigate('VirtualAccount');
        break;

      case 'help':
        navigation.navigate('Help');
        break;

      case 'message':
        navigation.navigate('');
        break;

      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, styles.boxShadow]}
      onPress={handlePress}>
      {hasImage ? (
        <Image style={styles.tinyLogo} source={imageIcon} />
      ) : (
        <Icon name={iconName} size={30} color={color} />
      )}
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 5,
    width: '30%',
    height: 120,
    margin: '1%',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  tinyLogo: {
    width: 85,
    height: 50,
    borderRadius: 5,
    marginBottom: 5,
  },
});

// React Native cross-platform box shadow
const generateBoxShadowStyle = (
  xOffset,
  yOffset,
  shadowColorIos,
  shadowOpacity,
  shadowRadius,
  elevation,
  shadowColorAndroid,
) => {
  if (Platform.OS === 'ios') {
    styles.boxShadow = {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
    };
  } else if (Platform.OS === 'android') {
    styles.boxShadow = {
      elevation,
      shadowColor: shadowColorAndroid,
    };
  }
};

generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717');

export default React.memo(IconButton);
