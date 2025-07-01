// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import vector icons

// const PayslipScreen = () => {
//   const [payslipData, setPayslipData] = useState([]);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchPayslips = async () => {
//       try {
//         const response = await fetch("https://hcm.azgard9.com/ords/api/PayslipMonth/get");
//         const data = await response.json();
//         setPayslipData(data.payslip); // Ensure API returns last 12 months
//       } catch (error) {
//         console.error("Error fetching payslip data:", error);
//       }
//     };

//     fetchPayslips();
//   }, []);

//   // Render a single list item
//   const renderPayslip = ({ item }) => (
//     <TouchableOpacity style={styles.itemContainer}>
//       <Icon name="file-document-outline" size={32} color="#4CAF50" style={styles.icon} />
//       <Text style={styles.text}>{item.FORMATTED_DATE}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.title}>View Payslips</Text> */}
//       <FlatList
//         data={payslipData}
//         renderItem={renderPayslip}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );
// };

// export default PayslipScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 16,
//     color: "#333",
//   },
//   itemContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   icon: {
//     marginRight: 16,
//   },
//   text: {
//     fontSize: 16,
//     color: "#333",
//   },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BASEURL from "../Constants/BaseUrl";

const PayslipScreen = ({ navigation }) => {
  const [payslipData, setPayslipData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchPayslips = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASEURL}/ords/api/PayslipMonth/get`
        );
        const data = await response.json();
        setPayslipData(data.payslip); // Ensure the API returns last 12 months
      } catch (error) {
        console.error("Error fetching payslip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  // Render a single list item
  const renderPayslip = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("PaySlip", {
          period_id: item.PERIOD_ID
        })
      }
    >
      <Icon
        name="file-document-outline"
        size={32}
        color="#2c6ed5"
        style={styles.icon}
      />
      <Text style={styles.text}>{item.FORMATTED_DATE}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={payslipData}
          renderItem={renderPayslip}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
   // backgroundColor: '#2c6ed5',
   // borderRadius: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
