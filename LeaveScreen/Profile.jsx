import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from REST API
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://hcm-azgard9.azgard9.com:8444/ords/api/empDetail/detail?EMP_ID=${global.xx_emp_id}` // Replace with your API URL
        );
        const data = await response.json();
        setProfileData(data.emp_detail);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      // Clear local storage
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      // Navigate to Login screen
      navigation.navigate('Auth')
  
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profileData || profileData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/cover.png')}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Personal Information</Text>

        {profileData.map((item, index) => (
          <View key={index} style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{item.EMP_NAME || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>CNIC:</Text>
              <Text style={styles.value}>{item.NIC || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Mobile:</Text>
              <Text style={styles.value}>{item.MOBILE_PHONE || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{item.E_MAIL_ADDRESS || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Current Address:</Text>
              <Text style={styles.value}>{item.TEMP_ADDRESS || 'N/A'}</Text>
            </View>
          </View>
        ))}

        {/* Logout Button */}
        {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>*/}
      </ScrollView> 
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  backgroundImage: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF4500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';

// const Profile = () => {
//   const [profileData, setProfileData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch data from REST API
//     const fetchProfileData = async () => {
//       try {
//         const response = await fetch(
//           `https://hcm.azgard9.com/ords/api/empDetail/detail?EMP_ID=${global.xx_emp_id}` // Replace with your API URL
//         );
//         const data = await response.json();
//         setProfileData(data.emp_detail);
//       //  console.log(data.emp_detail);
//       } catch (error) {
//         console.error('Error fetching profile data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, []);

  

//   if (!profileData || profileData.length === 0) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>No profile data available.</Text>
//       </View>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require('../assets/cover.png')}
//       style={styles.backgroundImage}
//     >
//       <ScrollView style={styles.container}>
//         <Text style={styles.heading}>Personal Information</Text>

//         {profileData.map((item, index) => (
//           <View key={index} style={styles.infoContainer}>
//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Name:</Text>
//               <Text style={styles.value}>{item.EMP_NAME || 'N/A'}</Text>
//             </View>

//             <View style={styles.infoRow}>
//               <Text style={styles.label}>CNIC:</Text>
//               <Text style={styles.value}>{item.NIC || 'N/A'}</Text>
//             </View>

//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Mobile:</Text>
//               <Text style={styles.value}>{item.MOBILE_PHONE || 'N/A'}</Text>
//             </View>

//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Email:</Text>
//               <Text style={styles.value}>{item.E_MAIL_ADDRESS || 'N/A'}</Text>
//             </View>

//             <View style={styles.infoRow}>
//               <Text style={styles.label}>Current Address:</Text>
//               <Text style={styles.value}>{item.TEMP_ADDRESS || 'N/A'}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginVertical: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   infoContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#666',
//     flex: 1,
//   },
//   value: {
//     fontSize: 16,
//     color: '#333',
//     flex: 2,
//     textAlign: 'right',
//   },
//   backgroundImage: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default Profile;
