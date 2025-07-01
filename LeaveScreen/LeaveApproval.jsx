import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BASEURL from '../Constants/BaseUrl';

const ApprovalsScreen = ({navigation}) => {
  const [data, setData] = useState([
    {id: '1', title: 'Leaves', icon: 'file-document-outline', approval: 0},
    {id: '2', title: 'Loans', icon: 'file-multiple-outline', approval: 0},
    {id: '3', title: 'Budget', icon: 'finance', approval: 0},
    {id: '4', title: 'Vehicle', icon: 'car', approval: 0},
    {id: '5', title: 'SIM', icon: 'sim', approval: 0},
    {id: '6', title: 'Laptop', icon: 'laptop', approval: 0},
    {
      id: '7',
      title: 'Interview Assessment',
      icon: 'file-multiple-outline',
      approval: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovalCount();
  }, []);

  const fetchApprovalCount = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASEURL}/ords/api/Pending/Approval?SUP_ID=${global.xx_emp_id}`,
      );
      const json = await response.json();
      console.log('Fetched Data:', json);

      const pendingCount = json?.Pending_approval?.[0]?.PENDING_APPROVAL ?? 0;
      console.log('Pending Approval Count:', pendingCount);

      setData(prevData =>
        prevData.map(item =>
          item.id === '1' ? {...item, approval: pendingCount} : item,
        ),
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch approval count.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = id => {
    if (id === '1') {
      navigation.navigate('LeaveApprovalEntry');
    } else {
      Alert.alert('Info', 'Coming Soon');
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {loading && item.id === '1' ? (
        <ActivityIndicator size="small" color="#2c6ed5" />
      ) : (
        <Text style={styles.subtitle}>{item.approval} Pending Approval</Text>
      )}

      <Icon name="chevron-right" size={24} color="#000000" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 2},
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2c6ed5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'right',
    minWidth: 120,
  },
});

export default ApprovalsScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const ApprovalsScreen = ({ navigation }) => {
// const [approvalCount, setApprovalCount] = useState(0);

//   useEffect(() => {
//     fetchApprovalCount();
//   }, []);

//   const fetchApprovalCount = async () => {
//     try {
//       const response = await fetch(
//         `https://hcm.azgard9.com/ords/api/Pending/Approval?SUP_ID=${global.xx_emp_id}`
//       );
//       const data = await response.json();
//       setApprovalCount(data.Pending_approval[0].PENDING_APPROVAL || 0);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch approval count.');
//       console.error(error);
//     }
//   };

//   const data = [
//     { id: '1', title: 'Leaves', icon: 'file-document-outline'  ,approval:{approvalCount}  },
//     { id: '2', title: 'Loans', icon: 'file-multiple-outline',approval:0 },
//     { id: '3', title: 'Budget', icon: 'finance' ,approval:0},
//     { id: '4', title: 'Vehicle', icon: 'car' ,approval:0 },
//     { id: '5', title: 'SIM', icon: 'sim' ,approval:0},
//     { id: '6', title: 'Laptop', icon: 'laptop' ,approval:0},
//     { id: '7', title: 'Interview Assessment', icon: 'file-multiple-outline' ,approval:0 },
//   ];

//   const handleItemPress = (id) => {
//     if (id === '1') {
//       navigation.navigate('LeaveApprovalEntry');
//     } else {
//       Alert.alert('Info', 'Coming Soon');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.id)}>
//       <View style={styles.iconContainer}>
//         <Icon name={item.icon} size={24} color="#ffffff" />
//       </View>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//       </View>
//       <Text style={styles.subtitle}>{item.approval} Pending</Text>
//       <Icon name="chevron-right" size={24} color="#000000" />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   list: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between', // Ensures spacing between elements
//     marginBottom: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2c6ed5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000000',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#808080',
//     textAlign: 'right', // Align text to the right
//     minWidth: 120, // Ensures proper alignment
//   },
// });

// export default ApprovalsScreen;

// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity,Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const ApprovalsScreen = ({ navigation }) => {
//   const data = [
//     { id: '1', title: 'Leaves', icon: 'file-document-outline' },
//     { id: '2', title: 'Loans', icon: 'file-multiple-outline' },
//     { id: '3', title: 'Budget', icon: 'finance' },
//     { id: '4', title: 'Vehicle', icon: 'car' },
//     { id: '5', title: 'SIM', icon: 'sim' },
//     { id: '6', title: 'Laptop', icon: 'laptop' },
//     { id: '7', title: 'Interview Assessment', icon: 'file-multiple-outline' },
//   ];

//   const handleItemPress = (id) => {
//     if (id === '1') {
//       navigation.navigate('LeaveApprovalEntry');
//     } else if (id === '2') {
//       Alert.alert('Info', 'Coming Soon');
//     } else if (id === '3') {
//       Alert.alert('Info', 'Coming Soon');
//     }
//     else if (id === '4') {
//       Alert.alert('Info', 'Coming Soon'); // Display an alert for "Coming Soon"
//     }
//     else if (id === '5') {
//       Alert.alert('Info', 'Coming Soon'); // Display an alert for "Coming Soon"
//     }
//     else if (id === '6') {
//       Alert.alert('Info', 'Coming Soon'); // Display an alert for "Coming Soon"
//     }
//     else if (id === '7') {
//       Alert.alert('Info', 'Coming Soon'); // Display an alert for "Coming Soon"
//     }

//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.id)}>
//       <View style={styles.iconContainer}>
//         <Icon name={item.icon} size={24} color="#ffffff" />
//       </View>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.subtitle}>7 Days Remaining</Text>
//       </View>
//       <Icon name="chevron-right" size={24} color="#000000" />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   list: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2c6ed5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000000',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#808080',
//   },
// });

// export default ApprovalsScreen;

// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const ApprovalsScreen = () => {
//   const data = [
//     { id: '1', title: 'Leaves', icon: 'file-document-outline' },
//     { id: '2', title: 'Loans', icon: 'file-multiple-outline' },
//     { id: '3', title: 'Budget', icon: 'finance' },

//   ];

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.itemContainer}>
//       <View style={styles.iconContainer}>
//         <Icon name={item.icon} size={24} color="#ffffff" />
//       </View>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.subtitle}>7 Days Remaining</Text>
//       </View>
//       <Icon name="chevron-right" size={24} color="#000000" />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>

//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     backgroundColor: '#2c6ed5',
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//   },
//   time: {
//     color: '#ffffff',
//     fontSize: 12,
//     textAlign: 'right',
//   },
//   title: {
//     //color: '#ffffff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   list: {
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2c6ed5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   titleText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000000',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#808080',
//   },
// });

// export default ApprovalsScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, ImageBackground } from 'react-native';

// const LeaveApproval = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const formatDate = (dateString) => {
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = months[date.getMonth()];
//     const year = String(date.getFullYear()).slice(-2);
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     fetchLeaveRequests();
//   }, []);

//   const fetchLeaveRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`https://hcm.azgard9.com/ords/api/az/get?SUP_ID=${global.xx_supervisor_id}`);
//       const data = await response.json();
//       setLeaveRequests(data.leave_approval);
//     } catch (error) {
//     ///  Alert.alert('Error', 'Failed to fetch leave requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveRequest = async (id) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`https://hcm.azgard9.com/ords/api/api/update?LEAVE_ID=${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: 'approved' }),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Leave request approved successfully');
//         fetchLeaveRequests();
//       } else {
//         Alert.alert('Error', 'Failed to approve leave request');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to approve leave request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.text}>Employee: {item.EMP_NAME}</Text>
//       <Text style={styles.text}>Reason: {item.REMARKS}</Text>
//       <Text style={styles.text}>
//         From: {formatDate(item.FROM_DATE)} To: {formatDate(item.TO_DATE)} Days:{item.NO_OF_DAYS}
//       </Text>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => approveRequest(item.EMP_LEAVE_ID)}
//       >
//         <Text style={styles.buttonText}>Approve</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     loading ? (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     ) : (
//       <ImageBackground
//         source={require('../assets/cover.png')}
//         style={styles.backgroundImage}
//       >
//         <View style={styles.overlay}>
//           <FlatList
//             data={leaveRequests}
//             keyExtractor={(item) => item.EMP_LEAVE_ID.toString()}
//             renderItem={renderItem}
//             ListEmptyComponent={<Text style={styles.emptyText}>No leave requests found</Text>}
//           />
//         </View>
//       </ImageBackground>
//     )
//   );

// };

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1 },
//   overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20 },
//   card: { padding: 15, marginBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8, elevation: 2 },
//   text: { fontSize: 16, marginBottom: 5, color: '#000' },
//   button: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, alignItems: 'center' },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   emptyText: { textAlign: 'center', fontSize: 16, color: '#fff' },
// });

// export default LeaveApproval;
