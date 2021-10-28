/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Accordion from '../../components/Accordion';
import IconButton from './IconButton';

const QuickView = ({quickList, title}) => {
  return (
    <Accordion heading={title} open={true}>
      <View style={styles.listConatiner}>
        {quickList.map((_) => {
          return (
            <IconButton
              key={_.name}
              iconName={_.icon}
              hasImage={_.hasImage}
              text={_.name}
              color="red"
              screenName={_.service_type}
            />
          );
        })}
      </View>
    </Accordion>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  listConatiner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
});

export default QuickView;
