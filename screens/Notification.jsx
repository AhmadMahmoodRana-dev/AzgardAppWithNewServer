import React, { useEffect, useState } from 'react';
import { View, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const Notification = () => {

  const EMP_ID = global.xx_emp_id; // Replace with dynamic EMP_ID if needed
  const [notificationData, setNotificationData] = useState(null);

  // Function to create a notification channel with sound
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: notifee.AndroidImportance.HIGH,
    });
  };



  // Request notification permissions
  const requestPermissions = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('Notification Permission:', authStatus);
  };

  useEffect(() => {
    createNotificationChannel();
    requestPermissions();

    // Listen for foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
     // console.log('Foreground message received:', remoteMessage);

      if (remoteMessage.data && remoteMessage.data.EMP_ID) {
        const receivedEmpId = String(remoteMessage.data.EMP_ID).trim(); // Ensure both are strings
       // console.log(`Received EMP_ID: ${receivedEmpId} (Type: ${typeof receivedEmpId})`);
       // console.log(`Expected EMP_ID: ${EMP_ID} (Type: ${typeof EMP_ID})`);

        if (receivedEmpId === String(EMP_ID)) {
          setNotificationData({
            title: remoteMessage.notification?.title || 'Leave Request',
            body: remoteMessage.notification?.body || 'You have a new leave request.',
          });

          await notifee.displayNotification({
            title: remoteMessage.notification?.title || 'Leave Request',
            body: remoteMessage.notification?.body || 'You have a new leave request.',
            android: {
              channelId: 'default',
              smallIcon: 'ic_launcher',
            },
          });
        } else {
          console.log('❌ EMP_ID mismatch - Notification not shown.');
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text style={{ fontSize: 20, marginBottom: 20 }}>Home Screen</Text> */}


      {/* Display Notification Data */}
      {notificationData && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f8d7da', borderRadius: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#721c24' }}>
            {notificationData.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#721c24' }}>{notificationData.body}</Text>
        </View>
      )}
    </View>
  );
};

export default Notification;
