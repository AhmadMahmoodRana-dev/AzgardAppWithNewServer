import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Get device dimensions
const { width, height } = Dimensions.get('window');

const Personalinfo = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/azgard_screen.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Row of Cards */}
        <View style={styles.row}>
          {/* Card 1 */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/PERSONALINFO.png')} style={styles.icon} />
            <Text style={styles.cardText}>View Profile</Text>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequestType')}>
            <Image source={require('../assets/Employee_Update.webp')} style={styles.icon} />
            <Text style={styles.cardText}>Request To{'\n'}Update</Text>
          </TouchableOpacity>

         
        </View>
        <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PaySlipMonth')}>
            <Image source={require('../assets/payslip.png')} style={styles.icon} />
            <Text style={styles.cardText}>Pay Slips</Text>
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
    padding: width * 0.03, // Padding based on screen width
  },
  row: {
    marginTop: height * 0.1, // Dynamic margin-top based on screen height
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  // card: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.7)',
  //   // backgroundColor: '#FFFFFF',
  //   borderRadius: 12,
  //   width: width * 0.4, // Card width as 40% of screen width
  //   height: height * 0.2, // Card height as 20% of screen height
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
  //   width: '60%', // Icon width as percentage of card width
  //   height: '60%', // Icon height as percentage of card height
  //   resizeMode: 'contain',
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
  
    fontSize: width * 0.035, // Dynamic font size based on screen width
    textAlign: 'center',
    marginTop: height * 0.01, // Dynamic margin-top for text
    color: '#000000',
    
    
    fontWeight:900
  },
});

export default Personalinfo;

// import React  from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image,Alert, ImageBackground } from 'react-native';


// const Personalinfo = ({ navigation }) => {
 

//   return (
//     <ImageBackground
//       source={require('../assets/cover.png')}
//       style={styles.backgroundImage}
//     >
//       <View style={styles.container}>



//         {/* Row of Cards */}
//         <View style={styles.row}>
//           {/* Card 1 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
//             <Image source={require('../assets/PERSONALINFO.png')} style={styles.icon} />
//             <Text style={styles.cardText}>View Profile</Text>
//           </TouchableOpacity>

//           {/* Card 2 */}
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequestType')}>
//             <Image source={require('../assets/Employee_Update.webp')} style={styles.icon} />
//             <Text style={styles.cardText}>Request To{'\n'}Update</Text>
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
//     padding: 10,
//   },
//   topImageContainer: {
//     alignItems: 'center', // Center the container horizontally
//     marginBottom: 20,
//   },
//   fingerprintContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 10,
//     width: '100%', // Full width of the screen
//     flexDirection: 'row', // Items in a horizontal row
//     alignItems: 'center', // Center items vertically
//     justifyContent: 'space-between', // Add space between switch and text
//   },
//   fingerprintText: {
//     fontSize: 14,
//     color: '#4A4A4A',
//     textAlign: 'center',
//     marginLeft: 10, // Add space between the switch and the text
//   },
//   row: {
//     marginTop: 90,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
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


// export default Personalinfo;
