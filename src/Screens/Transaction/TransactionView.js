import React from 'react';
import {View, Text} from 'react-native';
import {List} from 'react-native-paper';

const TransactionView = ({route, navigation}) => {
  const {screenDetails, mode} = route.params;
  return (
    <View>
      <List.Section>
        <List.Subheader>Transaction Details</List.Subheader>
        <List.Item title="Amount" description={screenDetails.amount} />
        <List.Item
          title="Status"
          description={
            screenDetails.status
              ? screenDetails.status
              : screenDetails.tx_status
          }
        />
        <List.Item title="Date" description={screenDetails.date} />
        <List.Item
          title="Transaction ID"
          description={
            screenDetails.reference
              ? screenDetails.reference
              : screenDetails.tx_ref
          }
        />
        {mode === 'utility' ? (
          <>
            <List.Item
              title="Customer Email"
              description={
                screenDetails.customer_email ? screenDetails.customer_email : ''
              }
            />

            <List.Item
              title="Customer Phone"
              description={
                screenDetails.customer_phone ? screenDetails.customer_phone : ''
              }
            />

            <List.Item
              title="Utility Type"
              description={
                screenDetails.utility_type ? screenDetails.utility_type : ''
              }
            />
          </>
        ) : null}

        {screenDetails.reason !== undefined ? (
          <List.Item title="Reason" description={screenDetails.reason} />
        ) : null}
        {mode !== 'utility' ? (
          <List.Item
            title="Reciever Account"
            description={
              screenDetails.beneficially
                ? screenDetails.beneficially
                : screenDetails.account
            }
          />
        ) : null}
      </List.Section>
    </View>
  );
};

export default TransactionView;
