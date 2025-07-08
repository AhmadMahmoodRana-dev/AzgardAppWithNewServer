import React, {useEffect, useState} from 'react';
import {View,Text,FlatList,TouchableOpacity,ActivityIndicator,StyleSheet,Alert,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';
import BASEURL from '../Constants/BaseUrl';
const AdvanceSalaryView = ({navigation}) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = dateString => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASEURL}/ords/api/adv/get?EMP_ID=${global.xx_emp_id}`,
      );
      const data = await response.json();
      setLeaveRequests(data.salary);
    } catch (error) {
      ///  Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async id => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASEURL}/ords/AZ/api/update?LEAVE_ID=${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({status: 'approved'}),
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Leave request approved successfully');
        fetchLeaveRequests();
      } else {
        Alert.alert('Error', 'Failed to approve leave request');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve leave request');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = amount => {
    return numeral(amount).format('0,0'); // Format number with commas
  };
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.text}>Requset #: {item.SAL_ADVANCE_NO}</Text>
      <Text style={styles.text}>
        Requset Date: {formatDate(item.ADVANCE_DATE)}{' '}
      </Text>
      <Text style={styles.text}>Remarks: {item.REMARKS}</Text>
      <Text style={styles.text}>Amount :{formatAmount(item.AMOUNT)}</Text>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => approveRequest(item.SAL_ADVANCE_ID)}>
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity> */}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return loading ? (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <ImageBackground
      source={require('../assets/cover.png')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <FlatList
          data={leaveRequests}
          keyExtractor={item => item.SAL_ADVANCE_ID.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Advance found</Text>
          }
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AdvanceSalary')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 1},
  overlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20},
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    elevation: 2,
  },
  text: {fontSize: 16, marginBottom: 5, color: '#000'},
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {textAlign: 'center', fontSize: 16, color: '#fff'},
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AdvanceSalaryView;