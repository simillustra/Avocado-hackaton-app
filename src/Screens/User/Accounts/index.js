/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Modal,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {APP_KEY, API_KEY} from '@env';
import EmptyState from '@freakycoder/react-native-empty-state';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import helpers from '../../../helpers';
import APIKit from '../../../helpers/axios';
import Loading from '../../../components/Loading';

const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const emptyStateImage = require('./../../../assets/empty-icon.png');
const profileImageUri = 'https://via.placeholder.com/640';

const Account = ({navigation}) => {
  const [accountList, setAccountList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const getCustomerDetails = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `${API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      const detailResp = await APIKit.get(
        'https://fsi.ng/api/heritagebank/accounts/CustomerInquiry?customerId=r1',
        config,
      );

      const {accountLists} = detailResp.data.data;

      if (detailResp) {
        console.log('R- detailResp.data', detailResp.data);
        console.log('accountLists', accountLists);

        if (detailResp.data.status === 201) {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: detailResp.data.message,
            text2: detailResp.data.description,
            position: 'bottom',
          });
          return;
        } else {
          setIsLoading(false);
          setAccountList(detailResp.data.customerAccounts);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error- detailResp.data', error);
      Toast.show({
        type: 'error',
        text1: 'Request status',
        text2: error.message,
        position: 'bottom',
      });
    }
  }, []);

  const getAccountBalance = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `${API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      const detailResp = await APIKit.get(
        'https://fsi.ng/api/heritagebank/accounts/BalanceInquiry?AccountNumber=5900406170',
        config,
      );

      if (detailResp) {
        console.log('R- detailResp.data', detailResp.data);

        if (detailResp.data.responseMessage !== 'Approved') {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Request Status',
            text2: 'Error! We could not perform your last request',
            position: 'bottom',
          });
          return;
        } else {
          setIsLoading(false);
          setAccountBalance(detailResp.data);
          setShowAlert(true);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error- detailResp.data', error);
      Toast.show({
        type: 'error',
        text1: 'Request status',
        text2: error.message,
        position: 'bottom',
      });
    }
  }, []);

  const getAccountHistoy = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `${API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };

      const detailResp = await APIKit.get(
        'https://fsi.ng/api/heritagebank/accounts/MiniStatementInquiry?AccountNumber=5900406176',
        config,
      );

      if (detailResp) {
        console.log('R- detailResp.data', detailResp.data);

        if (detailResp.data.transactionReference === undefined) {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Request Status',
            text2: 'Error! we could not load your request',
            position: 'bottom',
          });
          return;
        } else {
          setIsLoading(false);
          setAccountList(detailResp.data.transactionHistory);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error- detailResp.data', error);
      Toast.show({
        type: 'error',
        text1: 'Request status',
        text2: error.message,
        position: 'bottom',
      });
    }
  }, []);

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

  useEffect(() => {
    const loadInfo = await loadUserInfo();
    if (loadInfo) {
      getCustomerDetails();
    }
  }, []);

  const EmptyListMessage = ({item}) => {
    return (
      <EmptyState
        enableButton
        buttonText="Create New Wallet Account"
        imageSource={emptyStateImage}
        title="Opps! Nothing here :("
        description="We cannot find anything here, try again sometime"
      />
    );
  };

  const ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => accountView(item)}>
        <Text style={styles.itemStyle}>{item.accountName.toUpperCase()}</Text>
        <Text style={styles.itemStyle}>{item.accountNumber}</Text>
        <Text style={styles.itemStyle}>{item.schemeType}</Text>
        <Text style={styles.itemStyle}>{item.accountOpenDate}</Text>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const accountView = (item) => {};

  const goTo = (navParams) => {
    switch (navParams) {
      case 'Activate':
        setModalVisible(!isModalVisible);
        navigation.navigate('ActivateSavingsScreen', {
          savingsDetails: {...screenParams, activate_amount: 200},
        });
        break;
      case 'Deposit':
        setModalVisible(!isModalVisible);
        navigation.navigate('');
        break;
      case 'Account':
        setModalVisible(!isModalVisible);
        navigation.navigate('SavingsEdit', {
          formAction: 2,
          formParams: screenParams,
        });
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <GorgeousHeader
          menuImageSource={menuImage}
          searchImageSource={searchImage}
          profileImageSource={{
            uri: profileImageUri,
          }}
          placeholder="Search Accounts..."
          searchBarStyle={{height: 0}}
          searchInputStyle={{height: 0}}
          title="Account"
          subtitle="Quick and easy account search"
          menuImageOnPress={() => navigation.goBack()}
        />
        {isLoading ? (
          <SkeletonEffect />
        ) : (
          <FlatList
            data={accountList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            ListEmptyComponent={EmptyListMessage}
          />
        )}

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={isModalVisible}
          style={styles.modelContainer}
          onRequestClose={() => {}}>
          <MaterialCommunityIcon
            name="information-variant"
            style={styles.image}
          />
          <Text style={styles.text}>What action do you want to perform?</Text>
          <View
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              flex: 1,
              flexDirection: 'column',
            }}>
            <TouchableOpacity
              style={styles.button_2}
              onPress={() => {
                goTo('Activate');
              }}>
              <Text style={styles.closeText}>Request Account Balance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button_1}
              onPress={() => {
                goTo('Deposit');
              }}>
              <Text style={styles.closeText}> Make Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button_4}
              onPress={() => {
                goTo('Account');
              }}>
              <Text style={styles.closeText}>Account History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button_3} onPress={toggleModal}>
              <Text style={styles.closeText}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Account Balance"
          message={accountBalance}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="close"
          confirmText="Ok, Thanks"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            setShowAlert(false);
          }}
        />
        <Loading visible={isProcessing} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  listItem: {
    marginTop: '40%',
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
  },
  modelContainer: {
    padding: 25,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_1: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#3a4276',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  button_2: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#6379F4',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  button_3: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#e92f3c',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  button_4: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#F56040',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  closeButton: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3974',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  image: {
    marginTop: 50,
    marginBottom: 10,
    alignItems: 'center',
    color: Colors.lightRed,
    width: '100%',
    height: 150,
    fontSize: 150,
  },
  text: {
    fontSize: 24,
    marginBottom: 30,
    padding: 40,
  },
  closeText: {
    fontSize: 24,
    color: Colors.white,
    textAlign: 'center',
  },
});
