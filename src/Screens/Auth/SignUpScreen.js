/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from '../../components/context';
import APIKit from './../../helpers/axios';
import Toast from 'react-native-toast-message';

const SignInScreen = ({navigation}) => {
  const {signUp} = useContext(AuthContext);
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    password: '',
    confirm_password: '',
    check_name: false,
    check_email: false,
    check_phone: false,
    check_address: false,
    check_country: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const textInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        name: val,
        check_name: true,
      });
    } else {
      setData({
        ...data,
        name: val,
        check_name: false,
      });
    }
  };
  const emailInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        email: val,
        check_email: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_email: false,
      });
    }
  };
  const phoneInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        phone: val,
        check_phone: true,
      });
    } else {
      setData({
        ...data,
        phone: val,
        check_phone: false,
      });
    }
  };
  const addressInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        address: val,
        check_address: true,
      });
    } else {
      setData({
        ...data,
        address: val,
        check_address: false,
      });
    }
  };
  const countryInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        country: val,
        check_country: true,
      });
    } else {
      setData({
        ...data,
        country: val,
        check_country: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleRegister = async (params) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      let payload = {};
      payload.name = data.name;
      payload.email = data.email;
      payload.tel = data.phone;
      payload.address = data.address;
      payload.country = data.country;
      payload.pass = data.password;

      // console.log('sent', payload);

      const newAccount = await APIKit.post(
        '/register_user',
        JSON.stringify(payload),
        config,
      );
      if (newAccount) {
        let response = newAccount.data;
        if (response.status === 'successfull') {
          // console.log('Returned', newAccount.data);
          const foundUser = newAccount.data;
          signUp(foundUser);
        } else {
          // console.log('xxxxxx', newAccount.data);
          Toast.show({
            type: 'error',
            text1: 'Registeration Status',
            text2: `${response.message} 👋`,
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      console.log('Error', error);
      Toast.show({
        type: 'error',
        text1: 'Registeration Status',
        text2: `${error.message} 👋`,
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer} />
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Merchant Name/Company name / Username"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
            />
            {data.check_name ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Your Email Address"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => emailInputChange(val)}
            />
            {data.check_email ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <View style={styles.action}>
            <FontAwesome name="phone" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter your Phone number"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => phoneInputChange(val)}
            />
            {data.check_phone ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <View style={styles.action}>
            <FontAwesome name="home" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Address"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => addressInputChange(val)}
            />
            {data.check_address ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <View style={styles.action}>
            <FontAwesome name="map-pin" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter your Country's Name"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => countryInputChange(val)}
            />
            {data.check_country ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
              By signing up you agree to our
            </Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
              Terms of service
            </Text>
            <Text style={styles.color_textPrivate}> and</Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
              Privacy policy
            </Text>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                handleRegister(data);
              }}>
              <LinearGradient
                colors={['#08d4c4', '#01ab9d']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign Up
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.signIn,
                {
                  borderColor: '#009387',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#009387',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  actionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionPad: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'grey',
  },
});
