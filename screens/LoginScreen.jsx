// import React, { useState, useEffect, createRef } from "react";
// import {
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   View,
//   Alert,
//   Keyboard,
//   TextInput,
//   ScrollView,
//   ImageBackground,
//   KeyboardAvoidingView,
//   ActivityIndicator,
//   Switch,
//   Dimensions,
// } from "react-native";
// import LinearGradient from 'react-native-linear-gradient';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ReactNativeBiometrics from 'react-native-biometrics';
// import messaging from '@react-native-firebase/messaging';
// import axios from 'axios';

// const rnBiometrics = new ReactNativeBiometrics();
// const screenWidth = Dimensions.get('window').width;

// function LoginScreen({ navigation }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const passwordInputRef = createRef();

//   useEffect(() => {
//     checkBiometricAuth();
//   }, []);

//   const checkBiometricAuth = async () => {
//     const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
//     setIsFingerprintEnabled(biometricEnabled === 'true');
//   };

//   const toggleBiometricAuth = async (value) => {
//     try {
//       if (value) {
//         const { available, biometryType } = await rnBiometrics.isSensorAvailable();
//         if (available && biometryType) {
//           await AsyncStorage.setItem('biometricEnabled', 'true');
//           setIsFingerprintEnabled(true);
//         } else {
//           Alert.alert('Unsupported Device', 'Biometric authentication is not supported.');
//         }
//       } else {
//         await AsyncStorage.setItem('biometricEnabled', 'false');
//         setIsFingerprintEnabled(false);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Unable to toggle biometric authentication.');
//     }
//   };

//   const handleBiometricLogin = async () => {
//     try {
//       const { success } = await rnBiometrics.simplePrompt({
//         promptMessage: 'Authenticate with Biometrics',
//       });
//       if (success) {
//         handleSuccessfulBiometricLogin();
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Biometric authentication failed.');
//     }
//   };

//   const handleSuccessfulBiometricLogin = async () => {
//     try {
//       const savedUser = await AsyncStorage.getItem('username');
//       if (savedUser) {
//         const currentUser = JSON.parse(savedUser);
//         global.xx_user_id = currentUser.user_id;
//         global.xx_emp_id = currentUser.emp_id;
//         global.xx_supervisor_id = currentUser.supervisor_id;
//   // console.log(currentUser.user_notification);
//         // if (currentUser.user_notification === '0') {
//           saveTokenToServer(currentUser.emp_id);
//         // }
//         navigation.navigate('Home');
//       } else {
//         Alert.alert('Error', 'No saved user found for biometric login.');
//       }
//     } catch (error) {
//       console.log('Error retrieving user:', error);
//     }
//   };

//   const saveTokenToServer = async (empId) => {
//     try {
//       const fcmToken = await messaging().getToken();
//     //  console.log(fcmToken);
//       if (fcmToken) {
//         await axios.put('https://hcm.azgard9.com/ords/api/notification/update', {
//           EMP_ID: empId,
//           USER_NOTIFICATION: fcmToken,
//         });
//       }
//     } catch (error) {
//       console.error('Error saving FCM token:', error);
//     }
//   };

//   const handleLogin = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post('https://hcm.azgard9.com/ords/api/AZ/LOGIN', { username, password });
//       if (response.data?.status === '200') {
//         await AsyncStorage.setItem('username', JSON.stringify(response.data));
//         handleSuccessfulBiometricLogin();
//       } else {
//         Alert.alert('Login Failed', 'Invalid username or password.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Unable to connect to the server.');
//     }
//     setIsLoading(false);
//   };

//   return (
//     <ImageBackground source={require("../assets/MobileVersion.jpg")} style={styles.backgroundImage}>
//       <View style={styles.container}>
//         <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContainer}>
//           <View style={[styles.loginBox, { width: screenWidth * 0.9 }]}>
//             <KeyboardAvoidingView enabled>
//               <View style={styles.inputContainer}>
//                 <FontAwesome name='user' size={24} style={styles.inputIcon} />
//                 <TextInput style={styles.textInput} placeholder="Enter User Name" value={username} onChangeText={setUsername} />
//               </View>
//               <View style={styles.inputContainer}>
//                 <Fontisto name='locked' size={24} style={styles.inputIcon} />
//                 <TextInput secureTextEntry={!showPassword} style={styles.textInput} placeholder="Enter Password" value={password} onChangeText={setPassword} />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                   <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} style={styles.eyeIcon} />
//                 </TouchableOpacity>
//               </View>
//               <TouchableOpacity onPress={handleLogin} style={styles.touchBtn} disabled={isLoading}>
//                 <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.linearGradient}>
//                   {isLoading ? <ActivityIndicator size="large" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//                 </LinearGradient>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleBiometricLogin} style={styles.fingerprintIconContainer}>
//                 <MaterialIcons name="fingerprint" size={40} color="#623AA2" />
//               </TouchableOpacity>
//               <View style={styles.biometricsContainer}>
//                 <Text style={styles.biometricText}>Enable Fingerprint Authentication</Text>
//                 <Switch value={isFingerprintEnabled} onValueChange={toggleBiometricAuth} />
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// }

// export default LoginScreen;

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   container: {
//     flex: 1,
//     marginTop: 150,
//     alignItems: 'center',
//   },
//   loginBox: {
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     padding: 30,
//     borderRadius: 20,
//   },
//   inputContainer: {
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     borderRadius: 20,
//     marginVertical: 10,
//     elevation: 10,
//     alignItems: 'center',
//     height: 50,
//     width: '100%',
//   },
//   inputIcon: {
//     marginLeft: 15,
//     marginRight: 5,
//   },
//   textInput: {
//     flex: 1,
//   },
//   linearGradient: {
//     flex: 1,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: '#ffffff',
//   },
//   touchBtn: {
//     marginTop: 10,
//     height: 50,
//     borderRadius: 20,
//     width: '100%',
//   },
//   biometricsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   biometricText: {
//     fontSize: 16,
//     color: '#623AA2',
//   },
//   fingerprintIconContainer: {
//     alignItems: 'center',
//     marginTop: 5,
//   },
// });

import React, {useState, useEffect, createRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  TextInput,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

const rnBiometrics = new ReactNativeBiometrics();
const screenWidth = Dimensions.get('window').width;

function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const passwordInputRef = createRef();

  useEffect(() => {
    checkBiometricAuth();
  }, []);

  const checkBiometricAuth = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
    setIsFingerprintEnabled(biometricEnabled === 'true');
  };

  const toggleBiometricAuth = async value => {
    try {
      if (value) {
        rnBiometrics.isSensorAvailable().then(({available, biometryType}) => {
          if (
            available &&
            (biometryType === 'FaceID' ||
              biometryType === 'TouchID' ||
              biometryType === 'Biometrics')
          ) {
            AsyncStorage.setItem('biometricEnabled', 'true');
            setIsFingerprintEnabled(true);
          } else {
            Alert.alert(
              'Unsupported Device',
              'Biometric authentication is not supported on this device.',
            );
          }
        });
      } else {
        await AsyncStorage.setItem('biometricEnabled', 'false');
        setIsFingerprintEnabled(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to toggle biometric authentication.');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with Biometrics',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        handleSuccessfulBiometricLogin();
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication not available or failed.');
      console.log('Biometric login error:', error);
    }
  };

  const handleSuccessfulBiometricLogin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('username');
      console.log(savedUser);
      if (savedUser) {
        const currentUser = JSON.parse(savedUser);
        global.xx_user_id = currentUser.user_id;
        global.xx_emp_id = currentUser.emp_id;
        global.xx_supervisor_id = currentUser.supervisor_id;
        // if (currentUser.user_notification === '0') {
        saveTokenToServer(currentUser.emp_id);
        //         // }
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'No saved user found for biometric login.');
      }
    } catch (error) {
      console.log('Error retrieving user:', error);
    }
  };

  const saveTokenToServer = async empId => {
    try {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken);
      if (fcmToken) {
        await axios.put(
          'http://hcm-azgard9.azgard9.com:8444/ords/api/notification/update',
          {
            EMP_ID: empId,
            USER_NOTIFICATION: fcmToken,
          },
        );
      }
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  };
  const handleLogin = async () => {
    setIsLoading(true);

    try {
      console.log('Sending login request...');
      console.log('Username:', username);
      console.log('Password:', password);

      const response = await axios.post(
        'http://hcm-azgard9.azgard9.com:8444/ords/api/AZ/LOGIN',
        {username, password},
      );

      console.log('Login API response:', response);

      if (response.data && response.data.status === '200') {
        await AsyncStorage.setItem('username', JSON.stringify(response.data));
        console.log('Login successful. User data:', response.data);
        handleSuccessfulBiometricLogin();
      } else {
        console.warn('Login failed. Response:', response.data);
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }

    setIsLoading(false);
  };

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch("https://hcm.azgard9.com/ords/api/AZ/LOGIN", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ username: "admin", password: "vp786" }),
  //     });

  //     const data = await response.json();
  //     console.log(data);

  //     if (data && data.status === "200") {
  //       console.log("Login successful:", data);
  //     } else {
  //       console.log("Login Failed: Invalid username or password.");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error.message); // Log only the message
  //   }
  // };

  return (
    <ImageBackground
      source={require('../assets/MobileVersion.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View style={[styles.loginBox, {width: screenWidth * 0.9}]}>
            <KeyboardAvoidingView enabled>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  color={'#9A9A9A'}
                  size={24}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter User Name"
                  returnKeyType="next"
                  value={username}
                  onChangeText={setUsername}
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Fontisto
                  name="locked"
                  color={'#9A9A9A'}
                  size={24}
                  style={styles.inputIcon}
                />
                <TextInput
                  secureTextEntry={!showPassword} // Toggle based on showPassword state
                  style={styles.textInput}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  returnKeyType="next"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={24}
                    color="#9A9A9A"
                    style={{marginRight: 15}}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleLogin}
                style={styles.touchBtn}
                disabled={isLoading}>
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.linearGradient}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Fingerprint Icon */}
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={styles.fingerprintIconContainer}>
                <MaterialIcons name="fingerprint" size={40} color="#623AA2" />
              </TouchableOpacity>

              <View style={styles.biometricsContainer}>
                <Text style={styles.biometricText}>
                  Enable Fingerprint Authentication
                </Text>
                <Switch
                  value={isFingerprintEnabled}
                  onValueChange={toggleBiometricAuth}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isFingerprintEnabled ? '#623AA2' : '#f4f3f4'}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    marginTop: 150,
    alignItems: 'center',
  },
  loginBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 30,
    borderRadius: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 20,
    marginVertical: 10,
    elevation: 10,
    alignItems: 'center',
    height: 50,
    width: '100%',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  textInput: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
  },
  touchBtn: {
    marginTop: 10,
    height: 50,
    borderRadius: 20,
    width: '100%',
  },
  biometricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  biometricText: {
    fontSize: 16,
    color: '#623AA2',
  },
  fingerprintIconContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
});
