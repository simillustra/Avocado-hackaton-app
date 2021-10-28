import React, {useState, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import * as Animatable from 'react-native-animatable';
const Loading = ({visible}) => {
  const fadeIn = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  };

  return (
    <AnimatedLoader
      visible={visible}
      overlayColor="rgba(255,255,255,0.75)"
      source={require('./../lottieFiles/loading.json')}
      animationStyle={styles.lottie}
      speed={1}>
      <Animatable.Text animation={fadeIn} easing="ease-out" iterationCount="infinite" style={styles.loadingText}>Processing please wait .....</Animatable.Text>
    </AnimatedLoader>
  );
};
const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  loadingText: {
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: 20,
    textAlign: 'center',
    color:'#000000'
  },
});

export default Loading;
