import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import helpers from '../../helpers';
import Loading from '../../components/Loading';
const menuImage = require('./../../assets/menu.png');
const searchImage = require('./../../assets/search.png');
const profileImageUri = 'https://via.placeholder.com/640';

const More = ({navigation}) => {
  const [userInfo, setUserInfo] = useState({});
  const loadUserInfo = async () => {
    try {
      const userAccountInfo = await helpers.genActiveUser();
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
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <GorgeousHeader
          menuImageSource={menuImage}
          searchImageSource={searchImage}
          profileImageSource={{
            uri: profileImageUri,
          }}
          placeholder="Search Mores..."
          searchBarStyle={{height: 0}}
          searchInputStyle={{height: 0}}
          title="Settings"
          subtitle="Customise your App settings"
          menuImageOnPress={() => navigation.goBack()}
        />
        <View style={styles.container}></View>
        <Loading visible={isProcessing} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default More;

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
