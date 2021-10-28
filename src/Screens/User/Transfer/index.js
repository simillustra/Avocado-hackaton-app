/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import PhoneInput from 'react-native-phone-number-input';
import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GorgeousHeader from 'react-native-gorgeous-header';
const menuImage = require('./../../assets/menu.png');
const searchImage = require('./../../assets/search.png');
const profileImageUri = 'https://via.placeholder.com/640';
import helpers from './../../helpers';
import APIKit from './../../helpers/axios';
import Typography from '../../components/Typography';
import Loading from './../../components/Loading';

const Transfer = ({navigation}) => {
  const {height, width} = useWindowDimensions();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const phoneInput = useRef(null);

  // const [phoneNumber, setphoneNumber] = useState('');
  const makeid = () => {
    var text = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };
  const makePayment = useCallback(async () => {
    try {
      setIsProcessing(true);

      const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
      const getNumberNoZero =
        phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
      if (amount === '') {
        setIsProcessing(false);
        Toast.show({
          type: 'error',
          text1: 'Form Error!',
          text2: 'Amount is required',
          position: 'bottom',
        });

        return;
      }

      if (!checkValid) {
        setIsProcessing(false);
        Toast.show({
          type: 'error',
          text1: 'Form Error',
          text2:
            'Phone number is Invalid Please try again or change the number',
          position: 'bottom',
        });

        return;
      }

      const phone_number = parseInt(getNumberNoZero.formattedNumber, 10);

      var formData = {};
      formData.req = 'card_payment';
      formData.currency = 'UGX';
      formData.encryption_key = userInfo.encryption_key;
      formData.amount = amount;
      formData.phone = phone_number;
      formData.emailAddress = userInfo.email;

      formData.fname = userInfo.username;
      formData.lname = userInfo.username;

      formData.txRef = makeid();
      formData.call_back = 'https://silicon-pay.com';
      formData.success_url = 'https://silicon-pay.com';
      formData.failure_url = 'https://silicon-pay.com';
      formData.description = '';


      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      const detailResp = await APIKit.post(
        '/process_payments',
        JSON.stringify(formData),
        config,
      );
      if (detailResp) {
        // console.log('R- detailResp.data', detailResp.data);
        if (detailResp.data.status !== 200) {
          Toast.show({
            type: 'error',
            text1: detailResp.data.message,
            text2: detailResp.data.description,
            position: 'bottom',
          });
          return;
        } else {
          Toast.show({
            type: 'success',
            text1: 'Payment Status',
            text2: detailResp.data.message,
            position: 'bottom',
          });
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.log('Error- detailResp.data', error);
      Toast.show({
        type: 'error',
        text1: 'Request status',
        text2: error.message,
        position: 'bottom',
      });
    }
  }, [
    amount,
    navigation,
    phoneNumber,
    userInfo.email,
    userInfo.encryption_key,
  ]);

  const loadUserInfo = async () => {
    try {
      const userAccountInfo = await helpers.genActiveUser();
      // console.log('AUth', userAccountInfo);
      if (userAccountInfo !== null) {
        setUserInfo(userAccountInfo);
      }
    } catch (error) {
      console.log('Error - loadUserInfo', error);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <>
      <SafeAreaView>
        <KeyboardAwareScrollView>
          <GorgeousHeader
            menuImageSource={menuImage}
            searchImageSource={searchImage}
            placeholder="Search Bank Transfer account..."
            profileImageSource={{
              uri: profileImageUri,
            }}
            title="Fund Account"
            subtitle="Fund your Account or Mobile Wallet"
            searchBarStyle={{height: 0}}
            searchInputStyle={{height: 0}}
            menuImageOnPress={() => navigation.goBack()}
            profileImageOnPress={() => navigation.goBack()}
          />
          <View style={styles.listItem}>
            <Typography text="Account Details" color="black" bold={true} />
            <TextInput
              style={styles.input}
              onChangeText={(text) => setAmount(text)}
              value={amount}
              placeholder="Amount to Fund Account"
              keyboardType="numeric"
            />
            <PhoneInput
              ref={phoneInput}
              containerStyle={{marginBottom: 20, width: width - 50}}
              defaultValue={phoneNumber}
              defaultCode="UG"
              layout="first"
              placeholder="Receiver's Phone number/ MSISDN number"
              onChangeText={(text) => {
                setphoneNumber(text);
              }}
              onChangeFormattedText={(text) => {
                // setFormattedValue(text);
              }}
              withDarkTheme
              withShadow
              autoFocus
            />
            <TouchableOpacity style={styles.button} onPress={makePayment}>
              <Text style={styles.title}>Fund Account Now!</Text>
            </TouchableOpacity>
          </View>
          <Loading visible={isProcessing} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  listItem: {
    marginTop: '30%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    height: 50,
  },
});

export default Transfer;
