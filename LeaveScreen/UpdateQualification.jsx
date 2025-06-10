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
 // Make sure you install react-native-vector-icons or expo/vector-icons

const UpdateQualification = ({navigation}) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://hcm-azgard9.azgard9.com:8444/ords/api/emp_update/get`
      );
      const data = await response.json();
      setLeaveRequests(data.qualification_update);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch leave requests');
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
      Qualification: {item.QUALIFICATION}
      </Text>
      <Text style={styles.text}>
      Year: {item.YEAR}
      </Text>
      <Text style={styles.text}>
      CGPA: {item.CGPA}
      </Text>
      <Text style={styles.text}>
      Grade: {item.GRADE}
      </Text>
      <Text style={styles.text}>
      Institute: {item.INSTITUTE}
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
          keyExtractor={(item) => item.EMP_DEGREE_ID.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No leave requests found</Text>
          }
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('UpdateQualificationAdd')}
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

export default UpdateQualification;