/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Typography from '../../../components/Typography';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import helpers from '../../../helpers';
import SkeletonEffect from '../../../components/SkeletonEffect';

const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const profileImageUri = 'https://via.placeholder.com/640';

const Airtime = ({route, navigation}) => {
  const {screenData} = route.params;
  const [userInfo, setUserInfo] = useState({});
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

  const PurchaseAction = (params) => {
    // console.log('params', params);
    navigation.navigate('PurchaseAirtime', {
      screenDetails: params,
      userInfo: userInfo,
    });
  };

  useEffect(async () => {
    const loadInfo = await loadUserInfo();
    if (loadInfo) {
      setIsLoading(false);
    }
  }, []);

  const emptyComponent = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.titleStyle}>oops! There's no data here!</Text>
      </View>
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
        title="Airtime"
        subtitle="Search or select your favourite provider"
        menuImageOnPress={() => navigation.goBack()}
        profileImageOnPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <SkeletonEffect />
      ) : (
        <View style={styles.containerPad}>
          <Typography text="Available Choices" color="black" bold={true} />

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
                  <Text style={styles.plan}>{`${item.plan[0]}`}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={emptyComponent}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Airtime;

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
