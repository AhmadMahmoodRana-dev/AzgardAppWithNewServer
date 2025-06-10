import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const SalarySlip = () => {
  const payslips = [
    { id: '1', month: 'February 2022' },
    { id: '2', month: 'January 2022' },
    { id: '3', month: 'December 2021' },
    { id: '4', month: 'November 2021' },
  ];

  const renderPayslipItem = ({ item }) => (
    <TouchableOpacity style={styles.payslipItem}>
      <Image
      //  source={require('./path/to/your/icon.png')} // Replace with your icon path
        style={styles.icon}
      />
      <Text style={styles.monthText}>{item.month}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ESS</Text>
      <Text style={styles.subHeader}>View Payslips</Text>
      <FlatList
        data={payslips}
        keyExtractor={(item) => item.id}
        renderItem={renderPayslipItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  payslipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  monthText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 16,
  },
});

export default SalarySlip;
