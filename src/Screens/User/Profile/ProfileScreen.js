import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const ProfileEditScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Profile Edit Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked!')} />
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
