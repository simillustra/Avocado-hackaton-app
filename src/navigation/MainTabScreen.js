import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../Screens/Home';
import DetailsScreen from '../Screens/Notifications/DetailsScreen';
import ProfileScreen from '../Screens/User/Profile';
import Airtime from '../Screens/Services/Airtime';
import PurchaseAirtime from '../Screens/Services/Airtime/PurchaseAirtime';
import DataBundle from './../Screens/Services/DataBundle';
import DataBundleList from '../Screens/Services/DataBundle/DataBundleList';
import PurchaseDataBundle from '../Screens/Services/DataBundle/PurchaseDataBundle';
import Electricity from '../Screens/Services/Electricity';
import PurchaseElectricity from '../Screens/Services/Electricity/PurchaseElectricity';
import Epin from '../Screens/Services/Epin';
import EpinBundleList from '../Screens/Services/Epin/EpinBundleList';
import PurchaseEpin from '../Screens/Services/Epin/PurchaseEpin';
import PayTVPayment from '../Screens/Services/PayTV';
import TarrifsAndPackage from '../Screens/Services/PayTV/TarrifsAndPackage';
import MakePayTvPayment from '../Screens/Services/PayTV/MakePayTvPayment';
import Account from '../Screens/User/Accounts';
import Wallet from '../Screens/User/Wallet';
import MakeWalletTransfer from '../Screens/User/Wallet/MakeWalletTransfer';
import Cards from '../Screens/User/Cards';
import VirtualAccount from '../Screens/User/VirtualAccount';
import Transfer from '../Screens/User/Transfer';
import TransaferMobileMoney from '../Screens/User/Transfer/TransferMobileMoney';
import ScreenHeader from '../components/ScreenHeader';
import VerifyPassword from '../Screens/User/Password';
import Notifications from '../Screens/Notifications';
import Help from '../Screens/User/Help';
import More from '../Screens/More';
import Transactions from '../Screens/Transaction';
import TransactionView from '../Screens/Transaction/TransactionView';

const Stack = createStackNavigator();
const DetailsStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const noHeaderArray = [
  'Home',
  'Airtime',
  'Electricity',
  'Epin',
  'EpinBundleList',
  'Account',
  'VerifyPassword',
  'Profile',
  'Wallet',
  'PayTVPayment',
  'VirtualAccount',
  'Transfer',
  'TransaferMobileMoney',
  'TarrifsAndPackage',
];

const MainTabScreen = () => (
  <Tab.Navigator initialRouteName="Home" activeColor="#fff">
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#009387',
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={Notifications}
      options={{
        tabBarLabel: 'Updates',
        tabBarColor: '#1f65ff',
        tabBarIcon: ({color}) => (
          <Icon name="notifications-outline" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Transactions"
      component={Transactions}
      options={{
        tabBarLabel: 'Transactions',
        tabBarColor: '#694fad',
        tabBarIcon: ({color}) => (
          <Icon name="ios-stats-chart-outline" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="More"
      component={More}
      options={{
        tabBarLabel: 'More',
        tabBarColor: '#d02860',
        tabBarIcon: ({color}) => (
          <Icon name="ios-settings-outline" size={26} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const HomeStackScreen = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <Stack.Screen
      name="Home"
      component={MainTabScreen}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Home');
          return showHeader && <ScreenHeader heading={'Home'} />;
        },
      }}
    />
    <Stack.Screen
      name="Airtime"
      component={Airtime}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Airtime');
          return showHeader && <ScreenHeader heading={'Airtime'} />;
        },
      }}
    />

    <Stack.Screen
      name="PurchaseAirtime"
      component={PurchaseAirtime}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('PurchaseAirtime');
          return showHeader && <ScreenHeader heading={'Purchase Airtime'} />;
        },
      }}
    />

    <Stack.Screen
      name="DataBundle"
      component={DataBundle}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('DataBundle');
          return showHeader && <ScreenHeader heading={'DataBundle'} />;
        },
      }}
    />

    <Stack.Screen
      name="DataBundleList"
      component={DataBundleList}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('DataBundleList');
          return showHeader && <ScreenHeader heading={'DataBundleList'} />;
        },
      }}
    />

    <Stack.Screen
      name="PurchaseDataBundle"
      component={PurchaseDataBundle}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('PurchaseDataBundle');
          return showHeader && <ScreenHeader heading={'Purchase DataBundle'} />;
        },
      }}
    />
    <Stack.Screen
      name="Electricity"
      component={Electricity}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Electricity');
          return showHeader && <ScreenHeader heading={'Electricity'} />;
        },
      }}
    />

    <Stack.Screen
      name="PurchaseElectricity"
      component={PurchaseElectricity}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('PurchaseElectricity');
          return (
            showHeader && <ScreenHeader heading={'Purchase Electricity'} />
          );
        },
      }}
    />
    <Stack.Screen
      name="Epin"
      component={Epin}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Epin');
          return showHeader && <ScreenHeader heading={'Epin'} />;
        },
      }}
    />

    <Stack.Screen
      name="EpinBundleList"
      component={EpinBundleList}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('EpinBundleList');
          return showHeader && <ScreenHeader heading={'EpinBundleList'} />;
        },
      }}
    />

    <Stack.Screen
      name="PurchaseEpin"
      component={PurchaseEpin}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('PurchaseEpin');
          return showHeader && <ScreenHeader heading={'Purchase Epin'} />;
        },
      }}
    />
    <Stack.Screen
      name="VerifyPassword"
      component={VerifyPassword}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('VerifyPassword');
          return showHeader && <ScreenHeader heading={'VerifyPassword'} />;
        },
      }}
    />
    <Stack.Screen
      name="Wallet"
      component={Wallet}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Wallet');
          return showHeader && <ScreenHeader heading={'Wallet'} />;
        },
      }}
    />
    <Stack.Screen
      name="Account"
      component={Account}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Account');
          return showHeader && <ScreenHeader heading={'Account'} />;
        },
      }}
    /> 
    <Stack.Screen
      name="PayTVPayment"
      component={PayTVPayment}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('PayTVPayment');
          return showHeader && <ScreenHeader heading={'PayTVPayment'} />;
        },
      }}
    />
    <Stack.Screen
      name="VirtualAccount"
      component={VirtualAccount}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('VirtualAccount');
          return showHeader && <ScreenHeader heading={'VirtualAccount'} />;
        },
      }}
    />
    <Stack.Screen
      name="Transfer"
      component={Transfer}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Transfer');
          return showHeader && <ScreenHeader heading={'Transfer'} />;
        },
      }}
    />
    <Stack.Screen
      name="TransaferMobileMoney"
      component={TransaferMobileMoney}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('TransaferMobileMoney');
          return (
            showHeader && <ScreenHeader heading={'TransaferMobileMoney'} />
          );
        },
      }}
    />
    <Stack.Screen
      name="Transactions"
      component={Transactions}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Transactions');
          return showHeader && <ScreenHeader heading={'Transactions'} />;
        },
      }}
    />
    <Stack.Screen
      name="TransactionView"
      component={TransactionView}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('TransactionView');
          return showHeader && <ScreenHeader heading={'TransactionView'} />;
        },
      }}
    />
     <Stack.Screen
      name="MakeWalletTransfer"
      component={MakeWalletTransfer}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('MakeWalletTransfer');
          return (
            showHeader && <ScreenHeader heading={'Make Wallet Transfer'} />
          );
        },
      }}
    />

    <Stack.Screen
      name="TarrifsAndPackage"
      component={TarrifsAndPackage}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('TarrifsAndPackage');
          return (
            showHeader && <ScreenHeader heading={' PAY TV Tariffs/ Packages'} />
          );
        },
      }}
    />
    <Stack.Screen
      name="MakePayTvPayment"
      component={MakePayTvPayment}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('MakePayTvPayment');
          return (
            showHeader && <ScreenHeader heading={'Pay TV Customer Details'} />
          );
        },
      }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Profile');
          return showHeader && <ScreenHeader heading={'Profile'} />;
        },
      }}
    />

    <Stack.Screen
      name="Cards"
      component={Cards}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Cards');
          return showHeader && <ScreenHeader heading={'Cards'} />;
        },
      }}
    />
    <Stack.Screen
      name="Help"
      component={Help}
      options={{
        headerShown: true,
        header: ({route}) => {
          const showHeader = !noHeaderArray.includes('Help');
          return showHeader && <ScreenHeader heading={'Help'} />;
        },
      }}
    />
  </Stack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1f65ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <DetailsStack.Screen
      name="Details"
      component={DetailsScreen}
      options={{
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </DetailsStack.Navigator>
);

export default HomeStackScreen;
