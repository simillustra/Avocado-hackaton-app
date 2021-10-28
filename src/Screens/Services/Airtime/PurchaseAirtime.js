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
import PhoneInput from 'react-native-phone-number-input';
import {List} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import helpers from '../../../helpers';
import Loading from '../../../components/Loading';

const PurchaseAirtime = ({route, navigation}) => {
  const {screenDetails, userInfo} = route.params;
  const {height, width} = useWindowDimensions();
  const phoneInput = useRef(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      formData.agentId = 207;
      formData.agentReference = 'AX14s68P2Z';
      formData.service_type = screenDetails.service_type;
      formData.phone = phone_number;
      formData.amount = parseInt(amount, 10);
      formData.plan = screenDetails.plan[0];

      const detailResp = await helpers.postAction(
        'http://fsi.ng/api/v1/baxipay/services/airtime/request',
        formData,
      );
      if (detailResp) {
        console.log('R- detailResp.data', detailResp.data);

        if (detailResp.data.code !== 200) {
          setIsProcessing(false);
          Toast.show({
            type: 'error',
            text1: detailResp.data.message,
            text2: detailResp.data.description,
            position: 'bottom',
          });

          return;
        } else {
          setIsProcessing(false);
          Toast.show({
            type: 'success',
            text1: 'Airtime Purchase Status',
            text2: detailResp.data.data.transactionMessage,
            position: 'bottom',
          });

          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.log('Error- detailResp.data', error);
      setIsProcessing(false);
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
            <List.Subheader>Payment Summary</List.Subheader>
            <List.Item title="Customer name" description={screenDetails.name} />

            <List.Item
              title="Account Number"
              description={screenDetails.plan[0]}
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
            defaultCode="NG"
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
            <Text style={styles.title}>Purchase Airtime Now!</Text>
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
export default PurchaseAirtime;
