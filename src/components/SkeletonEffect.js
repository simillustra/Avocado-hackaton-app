/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from '@thevsstech/react-native-skeleton';

const SkeletonEffect = ({}) =>
  Array.from({length: 5}).map((_, index) => (
    <View key={index} style={{margin: 12, backgroundColor:'#ffffff'}}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row">
          <SkeletonPlaceholder.Item width={100} height={100} borderRadius={6} />
          <SkeletonPlaceholder.Item
            flex={1}
            justifyContent={'space-between'}
            marginLeft={12}>
            <SkeletonPlaceholder.Item
              width="50%"
              height={20}
              borderRadius={6}
            />
            <SkeletonPlaceholder.Item
              width="30%"
              height={20}
              borderRadius={6}
            />
            <SkeletonPlaceholder.Item
              width="80%"
              height={20}
              borderRadius={6}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  ));

SkeletonEffect.propTypes = {};
SkeletonEffect.defaultProps = {};

export default SkeletonEffect;
