/* eslint-disable prettier/prettier */
import React from 'react';
import {default as Ionicon} from 'react-native-vector-icons/Ionicons';

const Icon = ({name, size, color}) => {
  return <Ionicon name={name} style={{marginTop:12}} size={size} color={color} />;
};

export default Icon;
