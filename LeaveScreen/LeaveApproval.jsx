import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BASEURL from '../Constants/BaseUrl';

const ApprovalsScreen = ({navigation}) => {
  const [data, setData] = useState([
    {id: '1', title: 'Leaves', icon: 'file-document-outline', approval: 0},
    {id: '2', title: 'Loans', icon: 'file-multiple-outline', approval: 0},
    {id: '3', title: 'Advance',icon: 'file-multiple-outline', approval: 0},
    {id: '4', title: 'OverTime',icon: 'file-multiple-outline', approval: 0},
    {id: '5', title: 'Vehicle', icon: 'car', approval: 0},
    {id: '6', title: 'Laptop', icon: 'laptop', approval: 0},
    {id: '7', title: 'SIM', icon: 'sim', approval: 0},
    {id: '8', title: 'Promotion/Salary Changes',icon: 'file-multiple-outline', approval: 0},
    {id: '9', title: 'Transfer',icon: 'file-multiple-outline', approval: 0},
    {id: '10', title: 'Probation',icon: 'file-multiple-outline', approval: 0},
    {id: '11', title: 'Interview Assessment',icon: 'file-multiple-outline', approval: 0},
    {id: '12', title: 'Appraisal',icon: 'file-multiple-outline', approval: 0},
    {id: '13', title: 'Travelling',icon: 'file-multiple-outline', approval: 0},
    {id: '14', title: 'Budget', icon: 'finance', approval: 0},
    {id: '15', title: 'Trail Slip',icon: 'file-multiple-outline', approval: 0},

  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovalCount();
  }, []);

  const fetchApprovalCount = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASEURL}/ords/api/Pending/Approval?SUP_ID=${global.xx_emp_id}`,
      );
      const json = await response.json();
      console.log('Fetched Data:', json);

      const pendingCount = json?.Pending_approval?.[0]?.PENDING_APPROVAL ?? 0;
      console.log('Pending Approval Count:', pendingCount);

      setData(prevData =>
        prevData.map(item =>
          item.id === '1' ? {...item, approval: pendingCount} : item,
        ),
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch approval count.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = id => {
    if (id === '1') {
      navigation.navigate('LeaveApprovalEntry');
    } else if (id === '2') {
      navigation.navigate('ShowLoanApprovalEntry');
    } 
     else if (id === '3') {
      navigation.navigate('ShowAdvanceApprovalEntry');
    } 
     else if (id === '4') {
      navigation.navigate('ShowOvertimeApprovalEntry');
    } 
     else if (id === '5') {
      navigation.navigate('ShowVehicleApprovalEntry');
    } 
     else if (id === '6') {
      navigation.navigate('ShowLaptopApprovalEntry');
    } 
     else if (id === '7') {
      navigation.navigate('ShowSimApprovalEntry');
    } 
     else if (id === '8') {
      navigation.navigate('ShowSalaryChangesApprovalEntry');
    } 
     else if (id === '9') {
      navigation.navigate('ShowTransferApprovalEntry');
    } 
     else if (id === '10') {
      navigation.navigate('ShowProbationApprovalEntry');
    } 
     else if (id === '11') {
      navigation.navigate('ShowInterviewAssesmentApprovalEntry');
    } 
     else if (id === '12') {
      navigation.navigate('ShowAppraisalApprovalEntry');
    } 
     else if (id === '13') {
      navigation.navigate('ShowTravellingApprovalEntry');
    } 
     else if (id === '14') {
      navigation.navigate('ShowBudgetApprovalEntry');
    } 
     else if (id === '15') {
      navigation.navigate('ShowTrailSlipApprovalEntry');
    } 
    else {
      Alert.alert('Info', 'Coming Soon');
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {loading && item.id === '1' ? (
        <ActivityIndicator size="small" color="#2c6ed5" />
      ) : (
        <Text style={styles.subtitle}>{item.approval} Pending Approval</Text>
      )}

      <Icon name="chevron-right" size={24} color="#000000" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2c6ed5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'right',
    minWidth: 120,
  },
});

export default ApprovalsScreen;