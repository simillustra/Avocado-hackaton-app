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
import {useValidation} from 'react-native-form-validator';
import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import GorgeousHeader from 'react-native-gorgeous-header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const menuImage = require('./../../assets/menu.png');
const searchImage = require('./../../assets/search.png');
const profileImageUri = 'https://via.placeholder.com/640';
import helpers from './../../helpers';
import APIKit from './../../helpers/axios';
import Typography from '../../components/Typography';
import Loading from './../../components/Loading';

const TransaferMobileMoney = ({navigation}) => {
  const {height, width} = useWindowDimensions();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [reason, setTransactionSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const phoneInput = useRef(null);

  const {validate, isFieldInError, getErrorsInField, getErrorMessages} =
    useValidation({
      state: {
        amount,
        reason,
      },
    });

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

      const collect_me = validate({
        amount: {required: true},
        reason: {minlength: 10, maxlength: 30, required: true},
      });

      // console.log('collect_me', collect_me);
      if(!collect_me){
        setIsProcessing(false);
        return;
      }

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
      formData.encryption_key = userInfo.encryption_key;
      formData.debit_wallet = 'UGX';
      formData.phone = phone_number;
      formData.currency = 'UGX';
      formData.reason = reason;
      formData.req = 'mm';
      formData.emailAddress = userInfo.email;
      formData.amount = amount;
      formData.txRef = makeid();
      formData.call_back = 'https://silicon-pay.com';

      // console.log('sent-formdata', JSON.stringify(formData));
      const secrete_key = userInfo.secrete_keys;
      const encryption_key = userInfo.encryption_key;
      const phone = phone_number;

      const msg = await JSHash(encryption_key, CONSTANTS.HashAlgorithms.sha256);
      const keyValue = `${msg}${phone}`;

      const signature = await JSHmac(
        keyValue,
        secrete_key,
        CONSTANTS.HmacAlgorithms.HmacSHA256,
      );

      const config = {
        headers: {
          signature: signature,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      // console.log('R- formData', formData);

      const detailResp = await APIKit.post(
        '/api_withdraw',
        JSON.stringify(formData),
        config,
      );
      if (detailResp) {
        console.log('R- detailResp.data', detailResp.data);
        if (detailResp.data.status !== 200) {
          setIsProcessing(false);
          Toast.show({
            type: 'error',
            text1: 'Transfer/Withdrawal Request',
            text2: detailResp.data.message,
            position: 'bottom',
          });
          return;
        } else {
          setIsProcessing(false);
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
      setIsProcessing(false);
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
    reason,
    userInfo.email,
    userInfo.encryption_key,
    userInfo.secrete_keys,
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
            placeholder="Search Mobile Money account..."
            profileImageSource={{
              uri: profileImageUri,
            }}
            title="Mobile Wallet"
            subtitle="Transfers and Payouts to Mobile Money Wallets"
            searchBarStyle={{height: 0}}
            searchInputStyle={{height: 0}}
            menuImageOnPress={() => navigation.goBack()}
            profileImageOnPress={() => navigation.goBack()}
          />
          <View style={styles.listItem}>
            <Typography
              text="Mobile Money Transfer Details"
              color="black"
              bold={true}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => setAmount(text)}
              value={amount}
              placeholder="Amount to Transfer/Withdraw"
              keyboardType="numeric"
            />
            {isFieldInError('amount') &&
              getErrorsInField('amount').map((errorMessage) => (
                <Text style={styles.inputError} key="amountError">
                  {errorMessage}
                </Text>
              ))}
            <TextInput
              style={styles.input}
              onChangeText={(text) => setTransactionSummary(text)}
              value={reason}
              placeholder="Reason for transfer"
            />
            {isFieldInError('reason') &&
              getErrorsInField('reason').map((errorMessage, index) => (
                <Text style={styles.inputError} key={`reasonError${index}`}>
                  {errorMessage}
                </Text>
              ))}
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
              <Text style={styles.title}>Transfer/Withdraw Now!</Text>
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
    paddingVertical: 5,
    paddingHorizontal: 5,
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
  inputError: {
    fontSize: 10,
    marginLeft: 12,
    marginBottom: 10,
    color: 'red',
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

export default TransaferMobileMoney;
