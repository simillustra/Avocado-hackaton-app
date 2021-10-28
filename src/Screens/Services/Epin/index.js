/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import EmptyState from '@freakycoder/react-native-empty-state';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import helpers from '../../helpers';
import SkeletonEffect from '../../components/SkeletonEffect';
import Loading from './../../components/Loading';

const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const emptyStateImage = require('./../../../assets/empty-icon.png');
const profileImageUri = 'https://via.placeholder.com/640';

const Epin = ({route, navigation}) => {
  const {screenData} = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAction, setUserAction] = useState({});

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

  const getServiceList = useCallback(
    async (params) => {
      try {
        setIsProcessing(true);
        var formData = {};
        formData.service_type = params.service_type;

        const epinPackage = await helpers.postAction(
          'http://fsi.ng/api/v1/baxipay/services/epin/bundles',
          formData,
        );
        if (epinPackage) {
          console.log('epinPackage.data', epinPackage);

          if (epinPackage.code !== 200) {
            setIsProcessing(false);
            Toast.show({
              type: 'error',
              text1: 'Request Status',
              text2: epinPackage.message,
              position: 'bottom',
            });
            return;
          } else {
            setIsProcessing(false);
            navigation.navigate('EpinBundleList', {
              screenData: epinPackage.data,
              merchantInfo: userAction,
            });
          }
        }
      } catch (error) {
        console.log('Error- epinPackage.data', error);
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

  const PurchaseAction = (params) => {
    setUserAction(params);
    getServiceList(params);
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
        placeholder="Search epin providers..."
        title="Epin"
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
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={emptyComponent}
          />
          <Loading visible={isProcessing} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Epin;

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
});
