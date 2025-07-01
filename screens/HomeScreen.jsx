import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASEURL from '../Constants/BaseUrl';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [approvalCount, setApprovalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState(null); // Store emp_id

  useEffect(() => {
    getEmpIdAndFetchAttendance();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Exit', 'Are you sure you want to exit the app?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  const getEmpIdAndFetchAttendance = async () => {
    try {
      const userData = await AsyncStorage.getItem('username');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const emp_id = parsedData?.emp_id; // Extract emp_id
        console.log(userData)
        if (emp_id) {
          setEmpId(emp_id); // Save in state (optional)
          fetchApprovalCount(emp_id); // Use emp_id directly
        }
      }
    } catch (error) {
      console.error('Error fetching emp_id:', error);
      
    }
  };


  const fetchApprovalCount = async (emp_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASEURL}/ords/api/Pending/Approval?SUP_ID=${emp_id}`,
      );
      const data = await response.json();
      console.log("data" ,data)
      setApprovalCount(data.Pending_approval[0].PENDING_APPROVAL || 0);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch approval count.');
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/MobileVersion.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('LeaveNavigation')}>
            <Image source={require('../assets/lbb.png')} style={styles.icon} />
            <Text style={styles.cardText}>Leave Management{'\n'}System</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Attenance')}>
            <Image source={require('../assets/BT.png')} style={styles.icon} />
            <Text style={styles.cardText}>Attendance{'\n'}Management</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row1}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PersonalInfo')}>
            <Image
              source={require('../assets/PERSONALINFO.png')}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Personal Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RequisitionsType')}>
            <Image
              source={require('../assets/requisition.png')}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Requisitions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row1}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('LeaveApproval')}>
            <Image
              source={require('../assets/approval_screen.png')}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Approval</Text>
            <View style={styles.badge}>
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.badgeText}>{approvalCount}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: wp('5%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp('18%'),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: wp('3%'),
    width: wp('35%'),
    height: hp('15%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: wp('2%'),
    elevation: 5,
    position: 'relative',
  },
  icon: {
    width: wp('20%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
  cardText: {
    color: '#000000',
    fontSize: wp('3%'),
    textAlign: 'center',
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: wp('5%'),
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
});

export default HomeScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ImageBackground,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for bell icon

// const HomeScreen = () => {
//   const navigation = useNavigation();

//   // Set header options including the notification bell
//   useEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity style={styles.bellIconContainer}onPress={() => navigation.navigate('Notification')}>
//           <Icon name="notifications-outline" size={24} color="#1E90FF" />
//         </TouchableOpacity>
//       ),
//       title: 'Home', // Set title for the screen
//      headerStyle: { backgroundColor: '#fff' }, // Change header background color
//    //   headerTintColor: '#fff', // Set text color in header
//     });
//   }, [navigation]);

//   return (
//     <ImageBackground source={require('../assets/MobileVersion.jpg')} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         {/* Row of Cards */}
//         <View style={styles.row}>
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LeaveNavigation')}>
//             <Image source={require('../assets/lbb.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Leave Management{'\n'}System</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Attenance')}>
//             <Image source={require('../assets/BT.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Attendance{'\n'}Management</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.row1}>
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PersonalInfo')}>
//             <Image source={require('../assets/PERSONALINFO.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Personal Info</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequisitionsType')}>
//             <Image source={require('../assets/requisition.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Requisitions</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.row1}>
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LeaveApproval')}>
//             <Image source={require('../assets/approval_screen.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Approval</Text>
//           </TouchableOpacity>

//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flex: 1,
//     padding: wp('5%'),
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginTop: hp('18%'),
//   },
//   row1: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginTop: hp('2%'),
//   },
//   card: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderRadius: wp('3%'),
//     width: wp('35%'),
//     height: hp('15%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: wp('2%'),
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: wp('2%'),
//     elevation: 5,
//   },
//   icon: {
//     width: wp('20%'),
//     height: hp('10%'),
//     resizeMode: 'contain',
//   },
//   cardText: {
//     color: '#000000',
//     fontSize: wp('3%'),
//     textAlign: 'center',
//     fontWeight: '900',
//   },
//   bellIconContainer: {
//     marginRight: 15, // Adds padding to the right
//   },

//   });

// export default HomeScreen;
//-----------------------------///

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Switch,
//   ImageBackground,
//   Alert,
// } from 'react-native';

// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const HomeScreen = ({ navigation }) => {
//   // const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

//   // useEffect(() => {
//   //   (async () => {
//   //     const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
//   //     setIsFingerprintEnabled(fingerprintEnabled === 'true');
//   //   })();
//   // }, []);

//   // const toggleFingerprintAuth = async () => {
//   //   try {
//   //     await AsyncStorage.setItem('fingerprintEnabled', isFingerprintEnabled ? 'false' : 'true');
//   //     setIsFingerprintEnabled(!isFingerprintEnabled);
//   //   } catch (error) {
//   //     Alert.alert('Error', 'Unable to update fingerprint setting');
//   //   }
//   // };

//   return (
//     <ImageBackground
//       source={require('../assets/MobileVersion.jpg')}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>

//         {/* <View style={styles.topImageContainer}>
//           <View style={styles.fingerprintContainer}>
//             <Text style={styles.fingerprintText}>Please enable fingerprint</Text>
//             <Switch value={isFingerprintEnabled} onValueChange={toggleFingerprintAuth} />
//           </View>
//         </View> */}

//         {/* Row of Cards */}
//         <View style={styles.row}>
//           {/* Card 1 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LeaveNavigation')}>
//             <Image source={require('../assets/lbb.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Leave Management{'\n'}System</Text>
//           </TouchableOpacity>

//           {/* Card 2 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Attenance')}>
//             <Image source={require('../assets/BT.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Attendance{'\n'}Management</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.row1}>
//           {/* Card 3 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PersonalInfo')}>
//             <Image source={require('../assets/PERSONALINFO.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Personal Info</Text>
//           </TouchableOpacity>

//           {/* Card 4 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequisitionsType')}>
//             <Image source={require('../assets/requisition.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Requisitions</Text>
//           </TouchableOpacity>

//         </View>
//         <View style={styles.row1}>

//           {/* Card 5 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LeaveApproval')}>
//             <Image source={require('../assets/approval_screen.png')} style={styles.icon} />
//             <Text style={styles.cardText}>Approval</Text>
//           </TouchableOpacity>

//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flex: 1,
//     padding: wp('5%'),
//   },
//   topImageContainer: {
//     alignItems: 'center',
//     marginBottom: hp('2%'),
//   },
//   fingerprintContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: wp('2%'),
//     padding: wp('5%'),
//     width: wp('90%'),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   fingerprintText: {
//     fontSize: wp('4%'),
//     color: '#4A4A4A',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginTop: hp('18%'),
//   },
//   row1: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginTop: hp('2%'),
//   },
//   card: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderRadius: wp('3%'),
//      width: wp('35%'),
//     height: hp('15%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: wp('2%'),
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: wp('2%'),
//     elevation: 5,
//   },
//   icon: {
//     width: wp('20%'),
//     height: hp('10%'),
//     resizeMode: 'contain',
//   },
//   cardText: {
//     color: '#000000',
//     fontSize: wp('3%'),
//     textAlign: 'center',
//     fontWeight:900
//   },
// });

// export default HomeScreen;

// import React, { useEffect } from 'react';
// import { Alert } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import notifee,{AuthorizationStatus} from '@notifee/react-native'; // For better local notifications (optional)

// const HomeScreen = () => {
//   useEffect(() => {
//     async function requestUserPermission  () {
//       const setting = await notifee.requestPermission();

//       if(setting.authorizationStatus>=AuthorizationStatus.AUTHORIZED){
//         console.log('Authorization status:', setting);
//        } else{
//         console.log('Not Authorization status:');
//         }
//       }
//       // const authStatus = await messaging().requestPermission();
//       // const enabled =
//         // authStatus === messaging..AUTHORIZED ||
//         // authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       // if (enabled) {
//         // console.log('Authorization status:', authStatus);
//         // getFcmToken();
//       // }
//     // };

//     /*const getFcmToken = async () => {
//       const token = await messaging().getToken();
//       console.log('FCM Token:', token);
//       // Save the token to your backend for sending notifications
//     };

//     const onMessageReceived = messaging().onMessage(async (remoteMessage) => {
//       console.log('Notification received in foreground:', remoteMessage);
//       showNotification(remoteMessage.notification);
//     });

//     const showNotification = async (notification) => {
//       // Using Notifee for local notifications (optional)
//       await notifee.displayNotification({
//         title: notification.title,
//         body: notification.body,
//         android: {
//           channelId: 'default',
//           smallIcon: 'ic_launcher', // Use your app's small icon
//         },
//       });
//     };
// */

//     // Request permission and get FCM token
//     requestUserPermission();

//     const subscribeToTopic = async () => {
//       try {
//         await messaging().subscribeToTopic('all-users');
//         console.log('Subscribed to topic: all-users');
//       } catch (error) {
//         console.error('Error subscribing to topic:', error);
//       }
//     };

//     subscribeToTopic();
//   /*  return () => {AuthorizationStatus
//       onMessageReceived(); // Cleanup listener
//     };*/
//   }, []);

//  // return null; // Replace with your app's main component
// };

// export default HomeScreen;

// import React, { useEffect } from 'react';
// import { Alert } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native'; // For better local notifications (optional)

// const App = () => {
//   useEffect(() => {
//     const requestUserPermission = async () => {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('Authorization status:', authStatus);
//         getFcmToken();
//       }
//     };

//     const getFcmToken = async () => {
//       const token = await messaging().getToken();
//       console.log('FCM Token:', token);
//       // Save the token to your backend for sending notifications
//     };

//     const onMessageReceived = messaging().onMessage(async (remoteMessage) => {
//       console.log('Notification received in foreground:', remoteMessage);
//       showNotification(remoteMessage.notification);
//     });

//     const showNotification = async (notification) => {
//       // Using Notifee for local notifications (optional)
//       await notifee.displayNotification({
//         title: notification.title,
//         body: notification.body,
//         android: {
//           channelId: 'default',
//           smallIcon: 'ic_launcher', // Use your app's small icon
//         },
//       });
//     };

//     // Request permission and get FCM token
//     requestUserPermission();

//     return () => {
//       onMessageReceived(); // Cleanup listener
//     };
//   }, []);

//   return null; // Replace with your app's main component
// };

// export default App;

// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const EMP_ID = global.xx_emp_id; // Replace with dynamic EMP_ID if needed
//   const [notificationData, setNotificationData] = useState(null);

//   // Function to create a notification channel with sound
//   const createNotificationChannel = async () => {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       sound: 'default',
//       importance: notifee.AndroidImportance.HIGH,
//     });
//   };

//   // Request notification permissions
//   const requestPermissions = async () => {
//     const authStatus = await messaging().requestPermission();
//     console.log('Notification Permission:', authStatus);
//   };

//   useEffect(() => {
//     createNotificationChannel();
//     requestPermissions();

//     // Listen for foreground notifications
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground message received:', remoteMessage);

//       if (remoteMessage.data && remoteMessage.data.EMP_ID) {
//         const receivedEmpId = String(remoteMessage.data.EMP_ID).trim(); // Ensure both are strings
//         console.log(`Received EMP_ID: ${receivedEmpId} (Type: ${typeof receivedEmpId})`);
//         console.log(`Expected EMP_ID: ${EMP_ID} (Type: ${typeof EMP_ID})`);

//         if (receivedEmpId === String(EMP_ID)) {
//           setNotificationData({
//             title: remoteMessage.notification?.title || 'Leave Request',
//             body: remoteMessage.notification?.body || 'You have a new leave request.',
//           });

//           await notifee.displayNotification({
//             title: remoteMessage.notification?.title || 'Leave Request',
//             body: remoteMessage.notification?.body || 'You have a new leave request.',
//             android: {
//               channelId: 'default',
//               smallIcon: 'ic_launcher',
//             },
//           });
//         } else {
//           console.log('❌ EMP_ID mismatch - Notification not shown.');
//         }
//       }
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 20, marginBottom: 20 }}>Home Screen</Text>

//       {/* Notification Bell Icon */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate('Notifications')}
//         style={{ position: 'absolute', top: 40, right: 20 }}
//       >
//         <Icon name="notifications-outline" size={30} color="black" />
//       </TouchableOpacity>

//       <Text style={{ marginTop: 20, fontSize: 16, color: 'gray' }}>
//         Push notifications enabled for EMP_ID: {EMP_ID}
//       </Text>

//       {/* Display Notification Data */}
//       {notificationData && (
//         <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f8d7da', borderRadius: 10 }}>
//           <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#721c24' }}>
//             {notificationData.title}
//           </Text>
//           <Text style={{ fontSize: 14, color: '#721c24' }}>{notificationData.body}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default HomeScreen;
