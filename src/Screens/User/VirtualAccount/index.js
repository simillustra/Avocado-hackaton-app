import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import EmptyState from '@freakycoder/react-native-empty-state';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import helpers from '../../../helpers';
import Loading from '../../../components/Loading';
import SkeletonEffect from '../../../components/SkeletonEffect';
const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const emptyStateImage = require('./../../../assets/empty-icon.png');
const profileImageUri = 'https://via.placeholder.com/640';

const VirtualAccount = ({navigation}) => {
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
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
      <Text style={styles.itemStyle} onPress={() => accountView(item)}>
        {item.id} {'.'}
        {item.title.toUpperCase()}
      </Text>
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

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <GorgeousHeader
          menuImageSource={menuImage}
          searchImageSource={searchImage}
          profileImageSource={{
            uri: profileImageUri,
          }}
          placeholder="Search VirtualAccounts..."
          searchBarStyle={{height: 0}}
          searchInputStyle={{height: 0}}
          title="VirtualAccount"
          subtitle="Quick and easy virtual accounts search"
          menuImageOnPress={() => navigation.goBack()}
        />
        <View style={styles.container}></View>

        {isLoading ? (
          <SkeletonEffect />
        ) : (
          <FlatList
            data={dataSource}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            ListEmptyComponent={EmptyListMessage}
          />
        )}
        <Loading visible={isProcessing} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default VirtualAccount;

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
});
