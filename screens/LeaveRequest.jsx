import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Get device dimensions
const { width, height } = Dimensions.get('window');

const LeaveRequest = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/azgard_screen.jpg')} // Replace with your background image
      style={[styles.backgroundImage, { width, height }]} // Apply dimensions dynamically
      resizeMode="cover" // Ensures the image covers the screen
    >
      <View style={styles.container}>
        {/* Row of Cards */}
        <View style={styles.row}>
          {/* Card 1 */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('LeaveType')}
          >
            <Image
              source={require("../assets/leave_application.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Leave Request</Text>
          </TouchableOpacity>

          {/* Card 2 */}
          {/* <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('LeaveApproval')}
          >
            <Image
              source={require("../assets/APPROVAL.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Leave{'\n'}Approval</Text>
          </TouchableOpacity> */}

<TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HolidaysScreen')}
          >
            <Image
              source={require("../assets/gazeted.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Gazette</Text>
          </TouchableOpacity>


        </View>
        {/* <View style={styles.row1}>
          
          
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HolidaysScreen')}
          >
            <Image
              source={require("../assets/gazeted.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Gazette</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    marginTop: height * 0.2, // Adjust dynamically based on screen height
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    marginTop: height * 0.15, // Adjust dynamically based on screen height
  },
  /*card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // backgroundColor: '#FFFFFF', // Slight transparency for background
    borderRadius: 12,
    width: width * 0.4, // Adjust card width dynamically
    height: height * 0.2, // Adjust card height dynamically
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    width: width * 0.2, // Dynamically scale icon size
    height: height * 0.10, // Dynamically scale icon size
  },*/
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
    color: '#000000',
    fontSize: width * 0.030, // Dynamically scale text size
    textAlign: 'center',
    fontWeight  : 900,
  },
});

export default LeaveRequest;

// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';

// // Get device dimensions
// ///const { width, height } = Dimensions.get('window');

// const LeaveRequest = ({ navigation }) => {
//   return (
//     <ImageBackground
//       source={require('../assets/cover.png')} // Replace with your background image
//        style={styles.backgroundImage} //{ width, height } Apply dimensions dynamically
//       resizeMode="cover" // Ensures the image covers the screen
//     >
//       <View style={styles.container}>
       

//         {/* Row of Cards */}
//         <View style={styles.row}>
//           {/* Card 1 */}
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate('LeaveType')}
//           >
//             <Image
//               source={require("../assets/leave_application.png")}
//               style={styles.icon}
//             />
//             <Text style={styles.cardText}>Leave Request</Text>
//           </TouchableOpacity>

//           {/* Card 2 */}
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() => navigation.navigate('LeaveApproval')}
//           >
//             <Image
//               source={require("../assets/APPROVAL.png")}
//               style={styles.icon}
//             />
//             <Text style={styles.cardText}>Leave{'\n'}Approval</Text>
//           </TouchableOpacity>
//           </View>
//           <View style={styles.row1}>
//           {/* Card 3 */}
//           <TouchableOpacity style={styles.card} 
          
//           onPress={() => navigation.navigate('HolidaysScreen')}
//           >
//             <Image
//               source={require("../assets/gazeted.png")}
//               style={styles.icon}
//             />
//             <Text style={styles.cardText}>Gazetted{'\n'}Leave</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
 
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     flexWrap: 'wrap',
//     marginTop:150,

//   },
//   row1: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     flexWrap: 'wrap',
//     marginTop:100,

//   },
//   card: {
//     backgroundColor: '#FFFFFF', // Slight transparency for background
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
//   topImageContainer: {},
//   topImage: {
//     width: "100%",
//     height: 130,
//   },
//   helloContainer: {},
//   helloText: {
//     textAlign: "center",
//     fontSize: 70,
//     fontWeight: "500",
//     color: "#262626",
//   },
//   signInText: {
//     textAlign: "center",
//     fontSize: 18,
//     color: "#262626",
//     marginBottom: 20,
//   },
// });

// export default LeaveRequest;

