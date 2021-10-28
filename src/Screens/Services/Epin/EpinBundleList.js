/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import EmptyState from '@freakycoder/react-native-empty-state';
import GorgeousHeader from 'react-native-gorgeous-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonEffect from './../../components/SkeletonEffect';

const menuImage = require('./../../../assets/menu.png');
const searchImage = require('./../../../assets/search.png');
const emptyStateImage = require('./../../../assets/empty-icon.png');
const profileImageUri = 'https://via.placeholder.com/640';

const EpinBundleList = ({route, navigation}) => {
  const {screenData, merchantInfo} = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = (params) => {
    navigation.navigate('PurchaseEpin', {
      screenData: merchantInfo,
      dataInfo: params,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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

  const footer = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.titleStyle}>This is the footer</Text>
      </View>
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
        placeholder="Search E-pin Bundles..."
        title="Epin Bundles"
        subtitle="Select your prefered bundle"
        menuImageOnPress={() => navigation.goBack()}
        searchBarStyle={{height: 0}}
        searchInputStyle={{height: 0}}
      />
      {isLoading ? (
        <SkeletonEffect />
      ) : (
        <View style={styles.containerPad}>
          <FlatList
            data={screenData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => toggleModal(item)}>
                <View style={styles.metaInfo}>
                  <Text style={styles.title}>{item.amount}</Text>
                  <Text style={styles.title1}>
                    {item.available === 1 ? 'Available' : 'Not-Available'}
                  </Text>
                  <Text style={styles.title2}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={emptyComponent}
            ListFooterComponent={footer}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EpinBundleList;

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
    borderRadius: 8,
  },
  metaInfo: {
    marginLeft: 1,
  },
  title: {
    fontSize: 12,
    padding: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 18,
    padding: 5,
  },
  title2: {
    fontSize: 10,
    padding: 5,
  },
  title3: {
    fontSize: 11,
    padding: 5,
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
