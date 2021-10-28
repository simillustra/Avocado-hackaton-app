import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {List} from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';
import {SafeAreaView} from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import APIKit from '../../../helpers/axios';
import Loading from '../../../components/Loading';

const MakeWalletTransfer = ({route, navigation}) => {
  const {screenDetails, userInfo} = route.params;
  const [amount, setAmount] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {height, width} = useWindowDimensions();
  const phoneInput = useRef(null);
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
      formData.encryption_key = userInfo.encryption_key;
      formData.account_number = screenDetails.account_number;
      formData.phone = phone_number;
      formData.emailAddress = userInfo.email;
      formData.amount = amount;
      formData.tx_ref = makeid();
      formData.call_back = 'https://silicon-pay.com';

      // console.log('sent-formdata', JSON.stringify(formData));
      const secrete_key = userInfo.secrete_keys; //'94327899'; //
      const encryption_key = userInfo.encryption_key; //'7f3cb4e4b2c9c28974e1fb16c972e9c4'; // ;
      const phone = phone_number;

      const msg = await JSHash(encryption_key, CONSTANTS.HashAlgorithms.sha256);
      //hash('sha256', encryption_key).phone_number;
      //   console.log('msg', msg);
      const keyValue = `${msg}${phone}`;
      //   console.log('keyValue', keyValue, secrete_key);
      const signature = await JSHmac(
        keyValue,
        secrete_key,
        CONSTANTS.HmacAlgorithms.HmacSHA256,
      );

      //console.log('signature', signature);
      //   // hash_hmac('sha256', msg, secrete_key);

      const config = {
        headers: {
          signature: signature,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      const detailResp = await APIKit.post(
        '/pay_yaka',
        JSON.stringify(formData),
        config,
      );
      if (detailResp) {
        //console.log('R- detailResp.data', detailResp.data);
        if (detailResp.data.status !== 200) {
          setIsProcessing(false);
          Toast.show({
            type: 'error',
            text1: 'Payment Request Status',
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
  }, [amount, navigation, phoneNumber, screenDetails.account_number, userInfo]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
      <View style={styles.listItem}>
        <List.Section>
          <List.Subheader>Account Summary</List.Subheader>
          <List.Item
            title="Customer name"
            description={screenDetails.customer_name}
          />
          <List.Item
            title="Account Number"
            description={screenDetails.account_number}
          />
          <List.Item
            title="Outstanding Balance"
            description={screenDetails.outstanding_balance}
          />
        </List.Section>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setAmount(text)}
          value={amount}
          placeholder="Amount to Pay"
          keyboardType="numeric"
        />
        <PhoneInput
          ref={phoneInput}
          containerStyle={{marginBottom: 20, width: width - 50}}
          defaultValue={phoneNumber}
          defaultCode="UG"
          layout="first"
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
          <Text style={styles.title}>Pay UMEME YAKA Now!</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={isProcessing} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  listItem: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    height: 50,
  },
});
export default MakeWalletTransfer;
