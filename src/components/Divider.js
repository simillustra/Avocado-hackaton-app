/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

export default function Divider({bgcolor = 'black', verticalMargin = 0}) {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: bgcolor,
        marginVertical: verticalMargin,
        marginBottom: 10,
      }}
    />
  );
}
