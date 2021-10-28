/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Accordion from '../../components/Accordion';
import Divider from '../../components/Divider';
import List from '../../components/List';
import Typography from '../../components/Typography';
import getActivityIconName from '../../helpers/getActivityIconName';

/**
 * This shows a list of all current activities that occured in a bank account
 */

const Activities = ({title, dataList, mode}) => {
  const navigation = useNavigation();
  const viewTransaction = (item) => {
    navigation.navigate('TransactionView', {
      screenDetails: item,
      mode: mode,
    });
  };

  return (
    <Accordion heading={title} open={true}>
      <View>
        {dataList instanceof Array && dataList.length > 0 ? (
          <View>
            {dataList.map((action, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => viewTransaction(action)}>
                  <List elevateIcon iconName={getActivityIconName(mode)}>
                    <View style={styles.listChildern}>
                      <Typography text={action.amount} bold />
                      <Typography
                        text={
                          mode !== 'utility'
                            ? action.status.toUpperCase()
                            : action.tx_status.toUpperCase()
                        }
                        color={
                          mode !== 'utility'
                            ? action.status.toUpperCase() === 'FAILED'
                              ? 'red'
                              : 'green'
                            : action.tx_status.toUpperCase() === 'FAILED'
                            ? 'red'
                            : 'green'
                        }
                      />
                      <Typography text={action.date} color="gray" />
                    </View>
                  </List>
                  <Divider bgcolor="lightgray" />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyListStyle}>
            <Text style={styles.emptyMessageStyle}>No Data Available ...</Text>
          </View>
        )}
      </View>
    </Accordion>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  listChildern: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 20,
    overflow: 'hidden',
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyMessageStyle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f2f2f2',
  },
});

export default Activities;
