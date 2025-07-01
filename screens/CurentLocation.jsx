import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASEURL from '../Constants/BaseUrl';

const CurentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [xLocation, setxLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInProximity, setIsInProximity] = useState(false);
  const [empId, setEmpId] = useState(null); // Store emp_id
  const navigation = useNavigation();
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Permission',
            message:
              'This app needs access to your location for geolocation features.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getEmpIdAndFetchAttendance = async () => {
    try {
      const userData = await AsyncStorage.getItem('username');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const emp_id = parsedData?.emp_id; // Extract emp_id
        console.log(userData);
        if (emp_id) {
          setEmpId(emp_id); // Save in state (optional)
          fetchLocations(emp_id); // Use emp_id directly
        }
      }
    } catch (error) {
      console.error('Error fetching emp_id:', error);
    }
  };

  const fetchLocations = async emp_id => {
    try {
      const response = await axios.get(
        `${BASEURL}/ords/api/geolocation/locations?EMP_ID=${emp_id}`, // Use emp_id here,
      );
      if (response.data.status === '200' && response.data.locations) {
        setLocations(response.data.locations);
      } else {
        Alert.alert('Error', 'Failed to fetch locations from the server.');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Unable to fetch locations.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const userLocation = {latitude, longitude};
        setCurrentLocation(userLocation);

        let closestDistance = Infinity;
        let isInProximity = false;

        locations.forEach(location => {
          const targetLocation = {
            latitude: location.LATITUDE,
            longitude: location.LONGITUDE,
          };

          const calculatedDistance = haversine(userLocation, targetLocation, {
            unit: 'meter',
          });

          if (calculatedDistance < closestDistance) {
            closestDistance = calculatedDistance;
          }

          if (calculatedDistance <= location.THRESHOLD) {
            setIsInProximity((isInProximity = true));
            isInProximity = true;
            setxLocation(location.LOCATION_NAME);
          }
        });

        setDistance(closestDistance);
        setIsInProximity(isInProximity);
      },
      error => {
        Alert.alert('Error', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  useEffect(() => {
    const checkPermissionAndFetch = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getEmpIdAndFetchAttendance();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature.',
        );
      }
    };

    checkPermissionAndFetch();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      getCurrentLocation();
    }
  }, [locations]);

  const markAttendance = async () => {
    if (!isInProximity) {
      Alert.alert(
        'Verification Failed',
        'You are not in the allowed location to mark attendance.',
      );
      return;
    }
    try {
      const response = await axios.post(
        `${BASEURL}/ords/api/attendance/mark`,
        {
          emp_id: global.xx_emp_id,
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
          LOCATION_DESC: xLocation,
        },
      );

      Alert.alert('Success', response.data.response);
    } catch (error) {
      console.error('Error marking attendance:', error);
      Alert.alert('Error', 'Failed to mark attendance. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/azgard_screen.jpg')} // Update this with the correct path to your image
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>
          {isInProximity === null
            ? 'Waiting for Verification'
            : isInProximity
            ? 'Verifying Location'
            : 'Location Not Identified'}
        </Text>

        {currentLocation ? (
          <Text style={styles.coordinates}>
            Latitude: {currentLocation.latitude.toFixed(6)} {'\n'}
            Longitude: {currentLocation.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text style={styles.coordinates}>Fetching... {'\n'}Fetching... </Text>
        )}
        {distance !== null && (
          <Text style={styles.coordinates}>
            Distance to the nearest location: {Math.round(distance)} meters
          </Text>
        )}

        {/* <Text style={styles.message}>
          {isInProximity
            ? `You are within the allowed range of ${xLocation}`
            : 'Please reach your unit to mark attendance.'}
        </Text> */}
        <Text style={styles.message}>
          {isInProximity ? (
            <>
              You are within the allowed range of{' '}
              <Text style={styles.locationText}>{xLocation}</Text>
            </>
          ) : (
            'Please reach your unit to mark attendance.'
          )}
        </Text>

        <TouchableOpacity
          disabled={!isInProximity}
          style={[
            styles.stopButton,
            !isInProximity && {backgroundColor: '#ccc'},
          ]}
          onPress={markAttendance}>
          <Text style={styles.stopButtonText}>Mark Attendance</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Powered by Vision Plus{'\n'}Copyright © 2024 All Rights Reserved
        </Text>
        <TouchableOpacity
          style={[styles.logButton]}
          onPress={() => navigation.navigate('AttendanceLog')}>
          <Text style={styles.logButtonText}>Attendance Log</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  coordinates: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  message: {
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
  },

  locationText: {
    fontWeight: 'bold',
    color: 'yellow',
  },

  stopButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
  },
  logButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  logButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CurentLocation;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   PermissionsAndroid,
//   Platform
// } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import haversine from 'haversine';
// import axios from 'axios';

// const CurentLocation = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [xLocation, setxLocation] = useState(null);
//   const [locations, setLocations] = useState([]);
//   const [distance, setDistance] = useState(null);
//   const [loading, setLoading] = useState(true);
//   ///const [isloading, setisLoading] = useState(true);
//   const [isInProximity, setIsInProximity] = useState(false);
//   // Request location permissions (Android-specific)
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Access Permission',
//             message: 'This app needs access to your location for geolocation features.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS permissions are handled differently
//   };

//   // Fetch allowed locations from the API
//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(
//         `https://hcm.azgard9.com/ords/api/geolocation/locations?EMP_ID=${global.xx_emp_id}`
//       );
//       if (response.data.status === '200' && response.data.locations) {
//         setLocations(response.data.locations);
//       } else {
//         Alert.alert('Error', 'Failed to fetch locations from the server.');
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//       Alert.alert('Error', 'Unable to fetch locations.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get current location

//   const getCurrentLocation = () => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const userLocation = { latitude, longitude };
//         setCurrentLocation(userLocation);

//         // Check distance from each location
//         let closestDistance = Infinity;
//         let isInProximity = false;

//         locations.forEach((location) => {
//           const targetLocation = {
//             latitude: location.LATITUDE,
//             longitude: location.LONGITUDE,
//           };

//           const calculatedDistance = haversine(userLocation, targetLocation, {
//             unit: 'meter',
//           });

//           // Update closest distance
//           if (calculatedDistance < closestDistance) {
//             closestDistance = calculatedDistance;
//           }

//           // Check proximity
//           if (calculatedDistance <= location.THRESHOLD) {
//             setIsInProximity(isInProximity = true)
//             isInProximity = true;
//             setxLocation(location.LOCATION_NAME);
//             //Alert.alert(
//             //  'Success',
//             //  `You are within ${location.THRESHOLD} meters of LOCATION_NAME ${location.LOCATION_NAME}.`
//             // );
//           }
//         });

//         setDistance(closestDistance); // Set the closest distance
//         setIsInProximity(isInProximity);
//         if (!isInProximity) {
//          // Alert.alert(
//           //  'Outside Range',
//           //  'You are not within the allowed proximity of any location.'
//          /// );
//         }
//       },
//       (error) => {
//         Alert.alert('Error', error.message);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//       }
//     );

//   };

//   // Handle permission and fetch operations on component mount
//   useEffect(() => {

//     const checkPermissionAndFetch = async () => {
//       const hasPermission = await requestLocationPermission();
//       if (hasPermission) {
//         fetchLocations();
//       } else {
//         Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
//       }
//     };

//     checkPermissionAndFetch();

//   }, []);
//   useEffect(() => {
//     if (locations.length > 0) {
//       getCurrentLocation();
//     }
//   }, [locations]);

//   const markAttendance = async () => {
//             if (!isInProximity) {
//                 Alert.alert("Verification Failed", "You are not in the allowed location to mark attendance.");
//                 return;
//             }
//        ///     setisLoading(true);
//             try {
//                 const response = await axios.post('https://hcm.azgard9.com/ords/api/attendance/mark', {
//                     emp_id: global.xx_emp_id,
//                     longitude:currentLocation.longitude,
//                     latitude: currentLocation.latitude,
//                 });

//                 Alert.alert("success",response.data.response);
//             } catch (error) {
//                 console.error("Error marking attendance:", error);
//                 Alert.alert("Error", "Failed to mark attendance. Please try again.");
//             }
//           ///  setisLoading(false);
//         };

// return (
//             <View style={styles.container}>
//               <Text style={styles.title}>
//                     {isInProximity === null
//                         ? "Waiting for Verification"
//                         : isInProximity
//                         ? "Verifying Location"
//                         : "Location Not Identified"}
//                 </Text>

// {currentLocation ? (
//   <Text style={styles.coordinates}>
//     latitude: {currentLocation.latitude.toFixed(6)} {'\n'}
//    Longitude: {currentLocation.longitude.toFixed(6)}

//   </Text>
// ) : (
//   <Text style={styles.coordinates}>Fetching... {'\n'}Fetching... </Text>
// )}
//     {distance !== null && (
//              <Text style={styles.coordinates}>
//              Distance to the nearest location: {Math.round(distance)} meters
//             </Text>
//           )}

//                 <Text style={styles.message}>
//                 {isInProximity
//           ? `You are within the allowed range of ${xLocation}`
//           : 'Please reach your unit to mark attendance.'}

//                 </Text>

//                {/* {isloading ? ( */}
//                {/* <ActivityIndicator size="large" color="#00FF00" style={styles.loader} /> */}
//            {/* ) : ( */}
//                     <TouchableOpacity
//                          disabled={!isInProximity} // Disable button if loading or not verified
//                      style={[styles.stopButton, !isInProximity
//                          && { backgroundColor: "#ccc" }]}
//                        // style={styles.stopButton}
//                        onPress={markAttendance}
//                     >
//                         <Text style={styles.stopButtonText}>Mark Attendance</Text>
//                     </TouchableOpacity>
//                 {/* )} */}

//                 <Text style={styles.footerText}>
//                     Powered by Vision Plus{'\n'}Copyright © 2024 All Rights Reserved
//                 </Text>
//             </View>
//         );
//     };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 20,
//     },
//     title: {
//         fontSize: 30,
//         fontWeight: 'bold',
//         color: '#FFF',
//         marginBottom: 20,
//     },
//     coordinates: {
//         fontSize: 18,
//         color: '#FFF',
//         marginBottom: 5,
//     },
//     message: {
//         fontSize: 22,
//         color: '#FFF',
//         textAlign: 'center',
//         marginVertical: 20,
//     },
//     stopButton: {
//         backgroundColor: '#00FF00',
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         borderRadius: 8,
//     },
//     stopButtonText: {
//         color: '#FFF',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     footerText: {
//         fontSize: 12,
//         color: '#FFF',
//         textAlign: 'center',
//         position: 'absolute',
//         bottom: 20,
//     },    loader: {
//         marginTop: 20,
//     },

// });

// export default CurentLocation;
