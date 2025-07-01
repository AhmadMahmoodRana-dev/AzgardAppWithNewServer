import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BASEURL from '../Constants/BaseUrl';
 // Make sure you install react-native-vector-icons or expo/vector-icons

const UpdatePersonal = ({navigation}) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASEURL}/ords/api/emp_update/get`
      );
      const data = await response.json();
      setLeaveRequests(data.cinic_update);
    } catch (error) {
    //  Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>
        Emp No :{item.EMP_NO} Name: {item.EMP_NAME}
      </Text>
      <Text style={styles.text}>Card No: {item.CARD_ID}</Text>
      <Text style={styles.text}>
      Mobile No: {item.MOBILE_NO}
      </Text>
      <Text style={styles.text}>
      Email: {item.EMAIL}
      </Text>
      <Text style={styles.text}>
      Temp Address: {item.TEMP_ADDRESS}
      </Text>
      <Text style={styles.text}>
      Per Address: {item.PER_ADDRESS}
      </Text>
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
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <FlatList
          data={leaveRequests}
          keyExtractor={(item) => item.EMP_INFO_ID.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No leave requests found</Text>
          }
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('UpdatePersonalAdd')}
        >
        <Ionicons name="add" size={24} color="white"/>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20 },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    elevation: 2,
  },
  text: { fontSize: 16, marginBottom: 5, color: '#000' },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#fff' },
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

export default UpdatePersonal;