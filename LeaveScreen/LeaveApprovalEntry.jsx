import React, {useEffect, useState} from 'react';
import {View,Text,FlatList,TouchableOpacity,ActivityIndicator,StyleSheet,Alert,ImageBackground} from 'react-native';
import BASEURL from '../Constants/BaseUrl';
import axios from 'axios';

const LeaveApprovalEntry = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = dateString => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchLeaveRequests();
    console.log(global.xx_user_id)
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASEURL}/ords/api/Get_leave_Approval/get?X_EMP_ID=${global.xx_emp_id}`,
      );
      const data = await response.json();
      console.log('Leave Requestsss:', data);
      setLeaveRequests(data.leave_approval);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

   const sendNotification = async (empId, leaveType, noOfDays, leaveStatus) => {
    try {
      const response = await fetch(
        'https://dwpcare.com.pk/azgard/send-approval-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            empId: empId,
            leaveType: leaveType,
            noOfDays: noOfDays,
            leaveStatus: leaveStatus,
          }),
        },
      );

      console.log('Notification Response:', response);
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Notification Error:', error);
    }
  };


const approveRequest = async (id, TYPE, empId, leaveType, noOfDays) => {
  try {
    setLoading(true);

    const L_STATUS = 'APPROVED';

    const formData = new FormData();
    formData.append('p_leave_id', id.toString());
    formData.append('L_TYPE', TYPE);
    formData.append('L_STATUS', L_STATUS);
    formData.append('USER_ID', global.xx_user_id?.toString());

    const response = await axios.put(`${BASEURL}/ords/api/PUT_LEAVE/UPDATE`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response.data);

    if (response) {
      await sendNotification(empId, leaveType, noOfDays, L_STATUS);
      Alert.alert('Success', 'Leave approved successfully');
      fetchLeaveRequests();
    } else {
      Alert.alert('Error', 'Failed to approve leave request');
    }
  } catch (error) {
    console.error('Approval Error:', error);
    Alert.alert('Error', 'Failed to approve leave request');
  } finally {
    setLoading(false);
  }
};
;

  const rejectRequest = async (id, TYPE, empId, leaveType, noOfDays) => {
    try {
      setLoading(true);
      const L_STATUS = 'REJECTED';
      const response = await fetch(
        `${BASEURL}/ords/api/api/update?LEAVE_ID=${id}&L_TYPE=${TYPE}&L_STATUS=${L_STATUS}&USER_ID=${global.xx_user_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({status: 'rejected'}),
        },
      );

      console.log('Response:', response);

      if (response.ok) {
        await sendNotification(empId, leaveType, noOfDays, L_STATUS);
        Alert.alert('Success', 'Leave rejected successfully');
        fetchLeaveRequests();
      } else {
        Alert.alert('Error', 'Failed to reject leave request');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reject leave request');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.text}>Employee: {item.EMP_NAME}</Text>
      <Text style={styles.text}>Reason: {item.REMARKS}</Text>
      <Text style={styles.text}>
        From: {formatDate(item.FROM_DATE)} To: {formatDate(item.TO_DATE)}{' '}
        {item.LEAVE_TYPE === 'Short Leave' ||
         item.LEAVE_TYPE === 'Out Door Duty'
          ? 'Hours: '
          : 'Days:'}
        {item.NO_OF_DAYS}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonApprove}
          onPress={() =>
            approveRequest(
              item.EMP_LEAVE_ID,
              item.TYPE,
              item.EMP_ID,
              item.LEAVE_TYPE,
              item.NO_OF_DAYS,
            )
          }>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonReject}
          onPress={() =>
            rejectRequest(
              item.EMP_LEAVE_ID,
              item.TYPE,
              item.EMP_ID,
              item.LEAVE_TYPE,
              item.NO_OF_DAYS,
            )
          }>
          <Text style={styles.buttonText}>Reject</Text>
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

  return loading ? (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <ImageBackground
      source={require('../assets/azgard_screen.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <FlatList
          data={leaveRequests}
          keyExtractor={item => item.EMP_LEAVE_ID.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No leave requests found</Text>
          }
        />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonApprove: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  buttonReject: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {textAlign: 'center', fontSize: 16, color: '#fff'},
});

export default LeaveApprovalEntry;