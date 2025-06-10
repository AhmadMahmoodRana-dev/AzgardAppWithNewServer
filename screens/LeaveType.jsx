import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Get device dimensions
const { width, height } = Dimensions.get('window');

const LeaveType = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../assets/azgard_screen.jpg')} // Replace with your background image
        style={styles.backgroundImage}
        resizeMode="cover" // Ensures the image covers the screen
      >
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.row}>
                {/* Card 1 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('AnnualLeave')}
                >
                  <Image
                    source={require('../assets/annualLeave.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Annual Leave</Text>
                </TouchableOpacity>

                {/* Card 2 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('CasualLeave')}
                >
                  <Image
                    source={require('../assets/personalLeave.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Casual Leave</Text>
                </TouchableOpacity>

                {/* Card 3 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('SickLeave')}
                >
                  <Image
                    source={require('../assets/sickLeave.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Sick Leave</Text>
                </TouchableOpacity>

                {/* Card 4 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('ShortLeaveForm')}
                >
                  <Image
                    source={require('../assets/shortLeave.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Short Leave</Text>
                </TouchableOpacity>

                {/* Card 5 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('OutdoorDutyEntry')}
                >
                  <Image
                    source={require('../assets/outdoor.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Outdoor Duty</Text>
                </TouchableOpacity>

                {/* Card 6 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('MaternityLeave')}
                >
                  <Image
                    source={require('../assets/maternity.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Maternity Leave</Text>
                </TouchableOpacity>

                {/* Card 7 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('PaternityLeave')}
                >
                  <Image
                    source={require('../assets/paternity.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Paternity Leave</Text>
                </TouchableOpacity>

                {/* Card 8 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('LeaveWithoutPay')}
                >
                  <Image
                    source={require('../assets/unpaid.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Leave Without{'\n'}Pay</Text>
                </TouchableOpacity>

                {/* Card 9 */}
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('SpecialLeave')}
                >
                  <Image
                    source={require('../assets/special.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.cardText}>Special Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Ensures the background covers the entire screen
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  // card: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.5)',
  //   // backgroundColor: '#FFFFFF',
  //   borderRadius: 12,
  //   width: width * 0.4, // Card width is 40% of the screen width
  //   height: height * 0.2, // Card height is 20% of the screen height
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   margin: 10,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 5,
  //   elevation: 5,
  // },
  // icon: {
  //   width: width * 0.25, // Icon width is 25% of the screen width
  //   height: height * 0.1, // Icon height is 10% of the screen height
  // },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: wp('3%'),
     width: wp('35%'),
    height: hp('15%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: wp('2%'),
    elevation: 5,
  },
  icon: {
    width: wp('20%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
  cardText: {
    
    fontSize: 13,
    textAlign: 'center',
    color: '#000000',
    
    
    fontWeight:900

  },
});

export default LeaveType;

// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// const LeaveType = ({ navigation }) => {
//   return (
//     <SafeAreaProvider>
//       <ImageBackground
//         source={require('../assets/cover.png')} // Replace with your background image
//         style={styles.backgroundImage}
//         resizeMode="cover" // Ensures the image covers the screen
//       >
//         <SafeAreaView>
//           <ScrollView>
//             <View style={styles.container}>
//               <View style={styles.row}>
//                 {/* Card 1 */}
//                 <TouchableOpacity
//                   style={styles.card}
//                   onPress={() => navigation.navigate('AnnualLeave')}
//                 >
//                   <Image
//                     source={require('../assets/annualLeave.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Annual Leave</Text>
//                 </TouchableOpacity>

//                 {/* Card 2 */}
//                 <TouchableOpacity style={styles.card} 
//                  onPress={() => navigation.navigate('CasualLeave')} 
//                  >
//                   <Image
//                     source={require('../assets/personalLeave.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Casual Leave</Text>
//                 </TouchableOpacity>

//                 {/* Card 3 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('SickLeave')}
//                 >
//                   <Image
//                     source={require('../assets/sickLeave.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Sick Leave</Text>
//                 </TouchableOpacity>

//                 {/* Card 4 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('ShortleaveView')}
//                 >
//                   <Image
//                     source={require('../assets/shortLeave.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Short Leave</Text>
//                 </TouchableOpacity>

//                 {/* Card 5 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('OutdoorDutyView')}
                
//                 >
//                   <Image
//                     source={require('../assets/outdoor.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Outdoor Duty</Text>
//                 </TouchableOpacity>

//                 {/* Card 6 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('MaternityLeave')} 
//                 >
//                   <Image
//                     source={require('../assets/maternity.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Maternity Leave</Text>
//                 </TouchableOpacity>

//                 {/* Card 7 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('PaternityLeave')}  
//                 >
//                   <Image
//                     source={require('../assets/paternity.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Paternity Leave</Text>
//                 </TouchableOpacity>

//                 {/* Card 8 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('LeaveWithoutPay')} 
                
//                 >
//                   <Image
//                     source={require('../assets/unpaid.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Leave Without{'\n'}Pay</Text>
//                 </TouchableOpacity>

//                 {/* Card 9 */}
//                 <TouchableOpacity 
//                 style={styles.card}
//                 onPress={() => navigation.navigate('SpecialLeave')} 
//                 >
//                   <Image
//                     source={require('../assets/special.png')}
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cardText}>Special Leave</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </ImageBackground>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1, // Ensures the background covers the entire screen
//   },
//   container: {
//     flex: 1,
//    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add transparency over the background image
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     flexWrap: 'wrap',
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     width: 150,
//     height: 150,
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   icon: {
//     width: 105,
//     height: 100,
//   },
//   cardText: {
//     color: '#4A4A4A',
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });

// export default LeaveType;


