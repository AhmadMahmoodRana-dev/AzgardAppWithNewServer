import React, {useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    // const handleNavigation = async () => {
    //   try {
    //     const user = await AsyncStorage.getItem('id');
    //     if (user) {
    //       navigation.navigate('Home');
    //     } else {
    //       navigation.navigate('Auth');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // handleNavigation();
    setTimeout(() => {
      navigation.navigate('Auth');
    }, 3000);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image source={require('../assets/cover.png')} style={styles.image} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
