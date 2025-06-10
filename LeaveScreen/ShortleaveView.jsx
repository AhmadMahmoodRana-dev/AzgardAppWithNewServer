import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, ImageBackground } from 'react-native';

const ShortleaveView = ({navigation}) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
      const response = await fetch(`http://hcm-azgard9.azgard9.com:8444/ords/api/view/shortLeave`);
      const data = await response.json();
      setLeaveRequests(data.short_leave);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://hcm-azgard9.azgard9.com:8444/ords/AZ/api/update?LEAVE_ID=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>Emp No {item.EMP_NO} {item.EMP_NAME}</Text>
      <Text style={styles.text}>Reason: {item.REMARKS}</Text>
      <Text style={styles.text}>
        From: {formatDate(item.FROM_DATE)} To: {formatDate(item.TO_DATE)} Hours:{item.HOURS}
      </Text>
   <View style={styles.Btn}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ShortLeaveForm')}
      >
        <Text style={styles.buttonText}>+Add</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => approveRequest(item.EMP_LEAVE_ID)}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => approveRequest(item.EMP_LEAVE_ID)}
      >
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>
      </View>  
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    loading ? (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : (
      <ImageBackground
        source={require('../assets/cover.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <FlatList
            data={leaveRequests}
            keyExtractor={(item) => item.EMP_LEAVE_ID.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>No leave requests found</Text>}
          />
        </View>
      </ImageBackground>
    )
  );
  
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20 },
  card: { padding: 15, marginBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8, elevation: 2 },
  text: { fontSize: 16, marginBottom: 5, color: '#000' },
  button: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#fff' },
  Btn:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin:3

  }
});

export default ShortleaveView;


