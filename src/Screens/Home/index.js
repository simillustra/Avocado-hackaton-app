/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolate,
} from 'react-native-reanimated';
import Avatar from '../../components/Avatar';
import Divider from '../../components/Divider';
import Typography from '../../components/Typography';
import AccountCards from './AccountCards';
import QuickView from './QuickView';
import helpers from './../../helpers';

const accounts = [];
const MyWallet = [
  {
    name: 'Fund your Account',
    service_type: 'transfer',
    icon: 'card-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  },
  {
    name: 'Accounts',
    service_type: 'account',
    icon: 'swap-horizontal-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  },
  {
    name: 'Wallets',
    service_type: 'wallet',
    icon: 'swap-horizontal-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  },
  {
    name: 'Virtual Account',
    service_type: 'virtual',
    icon: 'swap-horizontal-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  },
  {
    name: 'Help',
    service_type: 'help',
    icon: 'swap-horizontal-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  },
  {
    name: 'Messaging',
    service_type: 'message',
    icon: 'swap-horizontal-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  },
];
const billsAndUtility = [
  {
    name: 'E-pin',
    service_type: 'epin',
    icon: 'pricetags-outline',
    hasImage: false,
    url: './../../assets/nwsc.jpeg',
  }
];
// accounts = [
//   {
//     type: 'Bank Account',
//     id: 123456787,
//   },
//   {
//     type: 'Mobile Money',
//     id: 123456787,
//   },
//   {
//     type: 'Silicon Wallet',
//     id: 123456787,
//   },
// ];

const HomeScreen = () => {
  const navigation = useNavigation();
  const translationY = useSharedValue(0); //to track scroll offset to animate header
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [servicesCategory, setServicesCategory] = useState([])
  const scrollHandler = useAnimatedScrollHandler((event) => {
    //move header on initial scroll and show again when scroll offset exceeed 80
    translationY.value =
      Math.abs(event.contentOffset.y) < 80
        ? Math.abs(event.contentOffset.y)
        : 0;
  });
  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          translationY.value,
          [0, 80],
          [0, -80],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const loadServiceCategories = async () => {
    try {
      const servicesCategory = await helpers.getAction(
        'http://fsi.ng/api/v1/baxipay/billers/category/all',
      );
      // console.log('AUth', userAccountInfo);
      if (servicesCategory.data instanceof Array && servicesCategory.data.length > 0) {
        setServicesCategory([...billsAndUtility, ...servicesCategory.data]);
      }
    } catch (error) {
      console.log('Error - loadUserInfo', error);
      setServicesCategory(billsAndUtility);
    }
  };

  const loadUserInfo = async () => {
    try {
      const userAccountInfo = await helpers.genActiveUser();
      // console.log('AUth', userAccountInfo);
      if (userAccountInfo !== null) {
        setUsername(userAccountInfo.username);
        setBalance(userAccountInfo.due_amount);
        setUserInfo(userAccountInfo);
      }
    } catch (error) {
      console.log('Error - loadUserInfo', error);
    }
  };

  useEffect(() => {
    loadUserInfo();
    loadServiceCategories()
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Avatar />
        <View>
          <Typography text="Welcome back" color="white" />
          <Typography text={username} color="white" bold={true} fontSize={30} />
        </View>
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 80,
        }}
        onScroll={scrollHandler}>
        {/* <View
          style={{
            marginTop: 5,
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 10,
              padding: 10,
              backgroundColor: '#ffffff',
            }}>
            <Typography service_type="Account Balance" color="black" bold={true} />
            <Typography
              service_type={parseFloat(balance) === 0 ? '0.00' : parseFloat(balance)}
              color="black"
              bold={true}
              fontSize={30}
            />
            <Divider />
          </View>

          {accounts.length > 0 ? (
            <>
              <Typography service_type="My Accounts" color="black" bold={true} />
              <Animated.ScrollView
                pagingEnabled={true}
                snapToAlignment="end"
                scrollEventThrottle={16}
                contentContainerStyle={{
                  paddingHorizontal: 30,
                }}
                decelerationRate="fast"
                snapToInterval={Dimensions.get('window').width * 0.8}
                horizontal={true}>
                {accounts.map((account, index) => {
                  return (
                    <AccountCards
                      key={index}
                      accountNumber={account.id}
                      type={account.type}
                      onButtonPress={() =>
                        navigation.navigate('VerifyPassword', {
                          accountNumber: account.id,
                        })
                      }
                    />
                  );
                })}
              </Animated.ScrollView>
            </>
          ) : null}
        </View> */}
        <QuickView quickList={MyWallet} title={'Accounts'} />
        <QuickView quickList={servicesCategory} title={'Value Added Services'} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'whitesmoke',
    flex: 1,
  },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#4285f4',
    padding: 10,
    height: 80,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // marginBottom:10,
  },
  tabbar: {
    backgroundColor: '#ffffff',
  },
  indicator: {
    backgroundColor: 'red',
  },
  label: {
    fontWeight: '400',
    color: '#808080',
  },
  tabStyle: {
    width: 'auto',
  },
  scene: {
    flex: 1,
  },
});

export default HomeScreen;
