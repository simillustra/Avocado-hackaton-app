/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState, useRef, useMemo} from 'react';
import {View, StyleSheet, Text, AppState} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';
import {APP_KEY, API_KEY} from '@env';
import {AuthContext} from './src/components/context';
import {DrawerContent} from './src/navigation/DrawerContent';
import HomeStackScreen from './src/navigation/MainTabScreen';
import RootStackScreen from './src/navigation/RootStackScreen';
import SupportScreen from './src/Screens/User/Help/SupportScreen';
import SettingsScreen from './src/Screens/User/Settings/SettingsScreen';
import BookmarkScreen from './src/Screens/BookmarkScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const App = ({navigation}) => {
  // const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [appInActiveStart, setInActiveStart] = useState(0);
  const [appInactiveEnd, setInactiveEnd] = useState(0);

  const opacity = useSharedValue(0);
  const fadeinStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, {duration: 200}),
  }));

  const initialLoginState = {
    isLoading: true,
    userId: null,
    userName: null,
    userInfo: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userInfo: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userId: action.id,
          userName: action.username,
          userInfo: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userId: null,
          userName: null,
          userInfo: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userId: action.id,
          userName: action.username,
          userInfo: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = useMemo(
    () => ({
      signIn: async (foundUser) => {
        const userId = foundUser.id;
        const userName = foundUser.username;
        const userInfo = foundUser;

        try {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (e) {
          console.log(e);
        }
        // console.log('user token: ', userInfo);
        dispatch({
          type: 'LOGIN',
          id: userId,
          username: userName,
          token: userInfo,
        });
      },
      signOut: async () => {
        // setUserInfo(null);
        // setIsLoading(false);
        try {
          await AsyncStorage.removeItem('userInfo');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
      signUp: async (foundUser) => {
        // setUserInfo('fgkj');
        // setIsLoading(false);
        const userId = foundUser.id;
        const userName = foundUser.username;
        const userInfo = foundUser;

        try {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (e) {
          console.log(e);
        }
        // console.log('user token: ', userInfo);
        dispatch({
          type: 'REGISTER',
          id: userId,
          username: userName,
          token: userInfo,
        });
      },
      toggleTheme: () => {
        setIsDarkTheme((isDarkTheme) => !isDarkTheme);
      },
    }),
    [],
  );

  const onNavigationReady = () => {
    // console.log('call two');
    //SplashScreen.hide();
  };

  const handleAppStateChange = (nextAppState) => {
    console.log('App State: ' + nextAppState);
    if (appState.current !== nextAppState) {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App State: ' + 'App has come to the foreground!');
        alert('App State: ' + 'App has come to the foreground!');
      } else {
        if (nextAppState == 'inactive') {
          setInActiveStart(new Date());
        }
        if (nextAppState === 'background') {
          setInactiveEnd(new Date());

          const timeOutPeriod = appInactiveEnd - appInActiveStart;
          // call enter master pin code
          if (loginState.userInfo !== null) {
            // navigation.navigate('',{
            //   userDetails:loginState.userInfo,
            //   pageNav: 'HomeStackScreen'
            // })
            console.log('navigation', navigation);
          }
        }
      }
      alert('App State: ' + nextAppState);
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      console.log('navigation', navigation);
    }
  };

  useEffect(() => {
    const susbcription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
      susbcription.remove();
    };
  }, []);

  useEffect(() => {
    opacity.value = 1;
    let userInfo = null;
    setTimeout(async () => {
      try {
        userInfo = await AsyncStorage.getItem('userInfo');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: JSON.parse(userInfo)});
    }, 1000);

    SplashScreen.hide();
  }, [opacity]);

  if (loginState.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          marginBottom: 100,
          alignItems: 'center',
        }}>
        <Spinner
          visible={loginState.isLoading}
          textContent={'...loading App, Please wait!'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer theme={theme} onReady={onNavigationReady}>
            <Animated.View style={[styles.container]}>
              {loginState.userInfo !== null ? (
                <Drawer.Navigator
                  drawerContent={(props) => <DrawerContent {...props} />}>
                  <Drawer.Screen
                    name="HomeDrawer"
                    component={HomeStackScreen}
                  />
                  <Drawer.Screen
                    name="SupportScreen"
                    component={SupportScreen}
                  />
                  <Drawer.Screen
                    name="SettingsScreen"
                    component={SettingsScreen}
                  />
                  <Drawer.Screen
                    name="BookmarkScreen"
                    component={BookmarkScreen}
                  />
                </Drawer.Navigator>
              ) : (
                <RootStackScreen />
              )}
              <Toast ref={(ref) => Toast.setRef(ref)} />
            </Animated.View>
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#FFF',
    fontSize: 10,
  },
});
export default App;
