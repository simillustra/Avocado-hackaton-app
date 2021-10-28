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
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import Loading from '../../../components/Loading';

const MakePayTvPayment = ({route, navigation}) => {
  const {screenData, merchantInfo, payment_code} = route.params;
  const [amount, setAmount] = useState('');
  const [smartcard_number, setSmartCardNumber] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {height, width} = useWindowDimensions();
  const phoneInput = useRef(null);

  const makePayment = useCallback(async () => {
    try {
      setIsProcessing(true);

      const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
      const getNumberNoZero =
        phoneInput.current?.getNumberAfterPossiblyEliminatingZero();

      if (!smartcard_number.trim()) {
        setIsProcessing(false);
        Toast.show({
          type: 'error',
          text1: 'Form Error!',
          text2: 'Smart Card Number Required is required',
          position: 'bottom',
        });

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
      formData.product_code = screenData.product_code;
      formData.smart_card_number = smartcard_number;
      formData.phone = phone_number;
      formData.total_amount = amount;
      formData.product_monthsPaidFor = payment_code;
      formData.addon_code = screenData.product_code;
      formData.addon_monthsPaidFor = screenData.monthsPaidFor;
      formData.agentId = 207;
      formData.agentReference = 'AX14s68P2Z';

      const payTvPayment = await helpers.postAction(
        'http://fsi.ng/api/v1/baxipay/services/airtime/request',
        formData,
      );
      if (payTvPayment) {
        // console.log('R- payTvPayment.data', payTvPayment.data);
        if (payTvPayment.data.status !== 200) {
          setIsProcessing(false);
          Toast.show({
            type: 'error',
            text1: 'Request Status',
            text2: payTvPayment.data.transactionMessage,
            position: 'bottom',
          });
          return;
        } else {
          setIsProcessing(false);
          Toast.show({
            type: 'success',
            text1: 'Payment Status',
            text2: payTvPayment.data.transactionMessage,
            position: 'bottom',
          });
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      setIsProcessing(false);
      console.log('Error- payTvPayment.data', error);
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
    payment_code,
    phoneNumber,
    screenData.account_number,
    screenData.request_reference,
    screenData.txRef,
    userInfo.email,
    userInfo.encryption_key,
    userInfo.secrete_keys,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.listItem}>
          <List.Section>
            <List.Subheader>Account Summary</List.Subheader>
            <List.Item
              title="Customer name"
              description={screenData.customer_name}
            />

            <List.Item
              title="Account Number"
              description={screenData.account_number}
            />
            <List.Item
              title="Outstanding Balance"
              description={screenData.outstanding_balance}
            />
          </List.Section>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setSmartCardNumber(text)}
            value={smartcard_number}
            placeholder="Smart Card Number"
            keyboardType="numeric"
          />
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
            <Text style={styles.title}>Pay Now!</Text>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
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
export default MakePayTvPayment;
