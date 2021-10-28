/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import helpers from '../../../helpers';
import EmptyState from '@freakycoder/react-native-empty-state';
import SkeletonEffect from '../../../components/SkeletonEffect';
import Loading from '../../../components/Loading';
const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const emptyStateImage = require('./../../../assets/empty-icon.png');
const profileImageUri = 'https://via.placeholder.com/640';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );

const PayTVPayment = ({route, navigation}) => {
  const {screenData} = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [userAction, setUserAction] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorTag, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const getServiceList = useCallback(
    async (params) => {
      try {
        setIsProcessing(true);
        var formData = {};
        formData.service_type = params.service_type;

        const cableTvPackage = await helpers.postAction(
          'http://fsi.ng/api/v1/baxipay/services/multichoice/list',
          formData,
        );
        if (cableTvPackage) {
          console.log('R- cableTvPackage.data', cableTvPackage);

          if (cableTvPackage.code !== 200) {
            setIsProcessing(false);
            Toast.show({
              type: 'error',
              text1: 'Request Status',
              text2: cableTvPackage.message,
              position: 'bottom',
            });
            return;
          } else {
            setIsProcessing(false);
            navigation.navigate('TarrifsAndPackage', {
              screenData: cableTvPackage.data,
              merchantInfo: userAction,
            });
          }
        }
      } catch (error) {
        console.log('Error- cableTvPackage.data', error);
        Toast.show({
          type: 'error',
          text1: 'Request status',
          text2: error.message,
          position: 'bottom',
        });
        setIsProcessing(false);
      }
    },
    [navigation],
  );

  const loadUserInfo = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const userAccountInfo = await helpers.genActiveUser();
        // console.log('AUth', userAccountInfo);
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

  const toggleModal = (params) => {
    setUserAction(params);
    getServiceList(params);
  };

  useEffect(async () => {
    const loadInfo = await loadUserInfo();
    if (loadInfo) {
      setIsLoading(false);
    }
  }, []);

  if (errorTag) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18}}>
          Error fetching data... Check your network connection!
        </Text>
      </View>
    );
  }

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

  const renderComponent = (item) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => toggleModal(item)}>
        <View style={styles.metaInfo}>
          <Text style={styles.title}>{`${item.name}`}</Text>
          <Text style={styles.title1}>{`${item.shortname}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <GorgeousHeader
        menuImageSource={menuImage}
        searchImageSource={searchImage}
        profileImageSource={{
          uri: profileImageUri,
        }}
        placeholder="Search CableTv..."
        title="Cable TV"
        subtitle="Quick payment for your CableTv subscription"
        menuImageOnPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <SkeletonEffect />
      ) : (
        <View style={styles.containerPad}>
          <FlatList
            data={screenData}
            keyExtractor={(item) => item.name}
            numColumns={3}
            renderItem={({item}) => renderComponent(item)}
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
              <Text style={styles.titleStyle}>
                Do you want to View Tv Providers package?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 10,
                  padding: 10,
                }}>
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => toggleModal(null)}
                />
                <Button
                  title="Continue"
                  color="green"
                  onPress={() => listTraffis()}
                />
              </View>
            </View>
          </Modal>
        </View>
      )}
      <Loading visible={isProcessing} />
    </SafeAreaView>
  );
};

export default PayTVPayment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  containerPad: {
    marginTop: 20,
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
    width: 85,
    height: 50,
    borderRadius: 8,
  },
  metaInfo: {
    marginLeft: 1,
  },
  titleStyle: {
    color: 'black',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    padding: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 10,
    padding: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
