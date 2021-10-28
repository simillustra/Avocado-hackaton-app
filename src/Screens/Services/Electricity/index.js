/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  ScrollView,
  TextInput,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import GorgeousHeader from 'react-native-gorgeous-header';
import EmptyState from '@freakycoder/react-native-empty-state';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import helpers from '../../helpers';
import SkeletonEffect from '../../components/SkeletonEffect';

const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const emptyStateImage = require("./../../../assets/empty-icon.png");
const profileImageUri = 'https://via.placeholder.com/640';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );

const Electricity = ({route, navigation}) => {
  const {screenData} = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [account_number, onChangeNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAction, setUserAction] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  const loadUserInfo = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const userAccountInfo = await helpers.genActiveUser();
        if (userAccountInfo !== null) {
          setUserInfo(userAccountInfo);
          resolve(true);
        }
      } catch (error) {
        console.log('Error - loadUserInfo', error);
        reject(error);
      }
    });
  };

  const verifyAccountRequest = useCallback(
    async (params) => {
      try {
        setIsProcessing(true);

        if (account_number === '') {
          setIsProcessing(true);
          Toast.show({
            type: 'error',
            text1: 'Request status',
            text2: 'Account number is required, please try again',
            position: 'bottom',
          });
          return;
        }

        var formData = {};
        formData.service_type = params.service_type;
        formData.account_number = account_number.trim();

        const verifyAccount = await helpers.postAction(
          'http://fsi.ng/api/v1/baxipay/services/electricity/verify',
          formData,
        );
        if (verifyAccount) {
          //console.log('R- verifyAccount.data', verifyAccount);

          if (verifyAccount.code !== 200) {
            setIsProcessing(false);
            Toast.show({
              type: 'error',
              text1: 'Request Status',
              text2: verifyAccount.message,
              position: 'bottom',
            });
            return;
          } else {
            setIsProcessing(false);
            navigation.navigate('PurchaseElectricity', {
              screenData: verifyAccount.data,
              merchantInfo: userAction,
            });
          }
        }
      } catch (error) {
        console.log('Error- verifyAccount.data', error);
        Toast.show({
          type: 'error',
          text1: 'Request status',
          text2: 'Uncaught Error please try again',
          position: 'bottom',
        });
        setIsProcessing(false);
      }
    },
    [navigation, userInfo],
  );

  const PurchaseAction = (params) => {
    //console.log('params', params);
    setUserAction(params);
    setModalVisible(!isModalVisible);
  };

  useEffect(async () => {
    const loadInfo = await loadUserInfo();
    if (loadInfo) {
      setIsLoading(false);
    }
  }, []);

  const emptyComponent = () => {
    return (
      <EmptyState     
        buttonText=""
        imageSource={emptyStateImage}
        title="Opps! Nothing here :("
        description="We cannot find anything here, try again sometime"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GorgeousHeader
        menuImageSource={menuImage}
        searchImageSource={searchImage}
        profileImageSource={{
          uri: profileImageUri,
        }}
        placeholder="Search airtime providers..."
        title="Electricity"
        subtitle="Search or select your favourite provider"
        menuImageOnPress={() => navigation.goBack()}
        profileImageOnPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <SkeletonEffect />
      ) : (
        <View style={styles.containerPad}>
          <FlatList
            data={screenData}
            keyExtractor={(item) => item.name}
            numColumns={3}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => PurchaseAction(item)}>
                <Image
                  source={{
                    uri: `https://via.placeholder.com/640x640.png?text=${item.name.toUpperCase()}`,
                  }}
                  style={styles.coverImage}
                />
                <View style={styles.metaInfo}>
                  <Text style={styles.title}>{`${item.name}`}</Text>
                  {/* <Text style={styles.plan}>{`${item.shortname}`}</Text> */}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={emptyComponent}
          />

          <Modal
            isVisible={isModalVisible}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            onSwipeComplete={() => setModalVisible(false)}
            hideModalContentWhileAnimating={true}
            swipeDirection="left">
            <View
              style={{
                backgroundColor: '#f2f2f2',
                justifyContent: 'center',
                marginHorizontal: 16,
                paddingVertical: 20,
                paddingHorizontal: 20,
              }}>
              <Text>Your Account number</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={account_number}
                placeholder="Enter your Account number"
                keyboardType="numeric"
              />
              <View style={styles.listItem1}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!isModalVisible);
                  }}
                  style={[styles.btn, {backgroundColor: 'red'}]}>
                  <Text> Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!isModalVisible);
                    verifyAccountRequest();
                  }}
                  style={[styles.btn, {backgroundColor: 'green'}]}>
                  <Text> validate Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Electricity;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  containerPad: {
    marginTop: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#101010',
    marginTop: 60,
    fontWeight: '700',
  },
  listItem: {
    marginTop: 10,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: Dimensions.get('window').width / 3 - 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'rgba(128, 128, 128, 0.479)',
  },
  coverImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
    borderRadius: 8,
  },
  metaInfo: {
    marginLeft: 1,
  },
  title: {
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  service: {
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  plan: {
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  scrollview: {
    width: '100%',
    padding: 12,
  },
  listItem1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    height: 50,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0.3 * 4, height: 0.5 * 4},
    shadowOpacity: 0.2,
    shadowRadius: 0.7 * 4,
  },
});
