import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import CheckBox from 'react-native-check-box';

// Utility function to format date to "dd-mm-rr"
const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  return `${day}-${month}-${year}`;
};

const FacilityAssets = () => {
  const [currentAssets, setCurrentAssets] = useState([]);
  const [newRequest, setNewRequest] = useState({
    type: '',
    brand: '',
    accessories: '',
  });
  const [isChecked, setIsChecked] = useState({});
  const [selectedAssetType, setSelectedAssetType] = useState('');

  const assetTypes = [
    {label: 'Laptop', value: '002'},
    {label: 'Mobile', value: '003'},
    {label: 'Vehicle', value: '001'},
    {label: 'Sim', value: '004'},
  ];

  const simBrands = [
    {label: 'Jazz', value: 'Jazz'},
    {label: 'Telenor', value: 'Telenor'},
    {label: 'Warid', value: 'Warid'},
    {label: 'Ufone', value: 'Ufone'},
    {label: 'Onic', value: 'Onic'},
    {label: 'Zong', value: 'Zong'},
  ];

  const accessoryOptions = {
    '003': [
      {label: 'Back Cover', value: 'back_cover'},
      {label: 'Protector', value: 'protector'},
    ],
    '002': [
      {label: 'Mouse', value: 'mouse'},
      {label: 'Laptop Bag', value: 'laptop_bag'},
    ],
    '001': [
      {label: 'Floor Mats', value: 'mats'},
      {label: 'Cover', value: 'cover'},
    ],
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(
        'http://hcm-azgard9.azgard9.com:8444/ords/api/Assets/get?EMP_ID=7207',
      );
      setCurrentAssets(response.data.FacilityAssets);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch current assets.');
    }
  };

  const handleNewRequest = async () => {
    if (!newRequest.type || !newRequest.brand) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const selectedAccessories = Object.keys(isChecked).filter(
      key => isChecked[key],
    );

    const requestData = {
      EMP_ID: global.xx_emp_id, // Assuming EMP_ID is static; change as needed
      FACILITY_TYPE: newRequest.type,
      MAKE_BY: newRequest.brand,
      accessories: selectedAccessories.join(', '),
      CREATED_BY: global.xx_user_id,
    };

    try {
      const response = await axios.post(
        'http://hcm-azgard9.azgard9.com:8444/ords/api/facility/add',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Request submitted successfully.');
        setNewRequest({type: '', brand: '', accessories: ''}); // Reset the form
        setIsChecked({});
        console.log(response.data)
      } else {
        Alert.alert('Error', 'Unexpected response from server.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again later.');
      console.error('POST Error:', error.response?.data || error.message);
    }
  };

  const toggleCheckBox = value => {
    setIsChecked(prev => ({...prev, [value]: !prev[value]}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.title}>Request New</Text>
        <Dropdown
          style={styles.dropdown}
          data={assetTypes}
          labelField="label"
          valueField="value"
          placeholder="Select Asset Type"
          value={selectedAssetType}
          onChange={item => {
            setSelectedAssetType(item.value);
            setNewRequest({...newRequest, type: item.value, brand: ''});
            setIsChecked({});
          }}
        />

        {selectedAssetType === '004' ? (
          <Dropdown
            style={styles.dropdown}
            data={simBrands}
            labelField="label"
            valueField="value"
            placeholder="Select Operator"
            value={newRequest.brand}
            onChange={item => setNewRequest({...newRequest, brand: item.value})}
          />
        ) : (
          <TextInput
            placeholder="Brand"
            style={styles.input}
            value={newRequest.brand}
            onChangeText={text => setNewRequest({...newRequest, brand: text})}
          />
        )}

        {accessoryOptions[selectedAssetType] &&
          accessoryOptions[selectedAssetType].map(option => (
            <CheckBox
              key={option.value}
              style={styles.checkbox}
              isChecked={!!isChecked[option.value]}
              onClick={() => toggleCheckBox(option.value)}
              rightText={option.label}
              rightTextStyle={styles.rightText}
            />
          ))}

        <Button title="Submit Request" onPress={handleNewRequest} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.title}>Employee Facilities</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.headerText]}>Asset</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Brand</Text>
            <Text style={[styles.tableCell, styles.headerText]}>
              Issue Date
            </Text>
            <Text style={[styles.tableCell, styles.headerText]}>Next Due</Text>
          </View>
          <FlatList
            data={currentAssets}
            keyExtractor={item => item.FACILITY_ASSET_ID.toString()}
            renderItem={({item}) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.ASSET}</Text>
                <Text style={styles.tableCell}>{item.MAKE_BY}</Text>
                <Text style={styles.tableCell}>
                  {formatDate(item.START_DATE)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatDate(item.RETURN_DATE)}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  container1: {
    margin: 10,
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    elevation: 5,
  },
  container2: {
    margin: 5,
    padding: 5,    
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  dropdown: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  checkbox: {
    marginBottom: 10,
  },
  rightText: {
    fontSize: 16,
  },
});

export default FacilityAssets;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import axios from 'axios';
// import CheckBox from 'react-native-check-box';

// // Utility function to format date to "dd-mm-rr"
// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//   const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
//   return `${day}-${month}-${year}`;
// };

// const FacilityAssets = () => {
//   const [currentAssets, setCurrentAssets] = useState([]);
//   const [newRequest, setNewRequest] = useState({ type: '', brand: '', accessories: '' });

//   const [isChecked, setIsChecked] = useState({});
//   const [selectedAssetType, setSelectedAssetType] = useState('');

//   const assetTypes = [
//     { label: 'Laptop', value: '002' },
//     { label: 'Mobile', value: '003' },
//     { label: 'Vehicle', value: '001' },
//     { label: 'Sim', value: '004' },
//   ];

//   const accessoryOptions = {
//     '003': [
//       { label: 'Back Cover', value: 'back_cover' },
//       { label: 'Protector', value: 'protector' },
//     ],
//     '002': [
//       { label: 'Mouse', value: 'mouse' },
//       { label: 'Laptop Bag', value: 'laptop_bag' },
//     ],
//     '001': [
//       { label: 'floor mats', value: 'mats' },
//       { label: 'Cover', value: 'cover' },
//     ],

//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const fetchAssets = async () => {
//     try {
//       const response = await axios.get('https://hcm.azgard9.com/ords/api/Assets/get?EMP_ID=7207');
//       setCurrentAssets(response.data.FacilityAssets);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch current assets.');
//     }
//   };

//   const handleNewRequest = async () => {
//      if (!newRequest.type || !newRequest.brand) {
//        Alert.alert('Error', 'Please fill in all fields.');
//        return;
//      }

//     const selectedAccessories = Object.keys(isChecked).filter((key) => isChecked[key]);

//     console.log(selectedAccessories.join(', '));

//     const requestData = {
//       EMP_ID: global.xx_emp_id, // Assuming EMP_ID is static; change as needed
//       FACILITY_TYPE: newRequest.type,
//       MAKE_BY: newRequest.brand,
//       accessories: selectedAccessories.join(', '),
//       CREATED_BY: global.xx_user_id,
//     };

//     try {
//       const response = await axios.post(
//         'https://hcm.azgard9.com/ords/api/facility/add', // Replace with your ORDS API endpoint
//         requestData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Request submitted successfully.');
//         setNewRequest({ type: '', brand: '', accessories: '' }); // Reset the form
//         setIsChecked({});
//       } else {
//         Alert.alert('Error', 'Unexpected response from server.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to submit request. Please try again later.');
//       console.error('POST Error:', error.response?.data || error.message);
//     }
//   };

//   const toggleCheckBox = (value) => {
//     setIsChecked((prev) => ({ ...prev, [value]: !prev[value] }));
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.container1}>

//       {/* Current Asset Details in Table Format */}
//       <Text style={styles.title}>Employee Facilities</Text>
//       <View style={styles.table}>
//         <View style={[styles.tableRow, styles.tableHeader]}>
//           <Text style={[styles.tableCell, styles.headerText]}>Asset</Text>
//           <Text style={[styles.tableCell, styles.headerText]}>Brand</Text>
//           <Text style={[styles.tableCell, styles.headerText]}>Issue Date</Text>
//           <Text style={[styles.tableCell, styles.headerText]}>Next Due</Text>
//         </View>
//         <FlatList
//           data={currentAssets}
//           keyExtractor={(item) => item.FACILITY_ASSET_ID.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>{item.ASSET}</Text>
//               <Text style={styles.tableCell}>{item.MAKE_BY}</Text>
//               <Text style={styles.tableCell}>{formatDate(item.START_DATE)}</Text>
//               <Text style={styles.tableCell}>{formatDate(item.RETURN_DATE)}</Text>
//             </View>
//           )}
//         />
//       </View>

//       {/* Request New Asset */}
//       <Text style={styles.title}>Request New</Text>
//       <Dropdown
//         style={styles.dropdown}
//         data={assetTypes}
//         labelField="label"
//         valueField="value"
//         placeholder="Select Asset Type"
//         value={selectedAssetType}
//         onChange={(item) => {
//           setSelectedAssetType(item.value);
//           setNewRequest({ ...newRequest, type: item.value });
//           setIsChecked({});
//         }}
//       />
//       <TextInput
//         placeholder="Brand"
//         style={styles.input}
//         value={newRequest.brand}
//         onChangeText={(text) => setNewRequest({ ...newRequest, brand: text })}
//       />

//       {/* Dynamically Render Checkboxes Based on Asset Type */}
//       {accessoryOptions[selectedAssetType] &&
//         accessoryOptions[selectedAssetType].map((option) => (
//           <CheckBox
//             key={option.value}
//             style={styles.checkbox}
//             isChecked={!!isChecked[option.value]}
//             onClick={() => toggleCheckBox(option.value)}
//             rightText={option.label}
//             rightTextStyle={styles.rightText}
//           />
//         ))}

//       <Button title="Submit Request" onPress={handleNewRequest} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 5,
//   ///  elevation:5
//   },

//   container1: {

//     margin: 10,
//     padding: 5,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 10,
//     elevation: 5,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 5,
//     borderRadius: 5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableHeader: {
//     backgroundColor: '#f0f0f0',
//   },
//   tableCell: {
//     flex: 1,
//     padding: 5,
//     textAlign: 'center',
//   },
//   headerText: {
//     fontWeight: 'bold',
//   },
//   dropdown: {
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   checkbox: {
//     marginBottom: 10,
//   },
//   rightText: {
//     fontSize: 16,
//   },
// });

// export default FacilityAssets;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import axios from 'axios';
// import CheckBox from 'react-native-check-box';

// // Utility function to format date to "dd-mm-rr"
// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//   const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
//   return `${day}-${month}-${year}`;
// };

// const FacilityAssets = () => {
//   const [currentAssets, setCurrentAssets] = useState([]);
//   const [newRequest, setNewRequest] = useState({ type: '', brand: '', accessories: '' });

//   const [isChecked, setIsChecked] = useState(false);

//   const toggleCheckBox = () => {
//     setIsChecked(!isChecked);
//   };

//   const assetTypes = [
//     { label: 'Laptop', value: '002' },
//     { label: 'Mobile', value: '003' },
//     { label: 'Vehicle', value: '001' },
//     { label: 'Sim', value: '004' },
//   ];

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const fetchAssets = async () => {
//     try {
//       const response = await axios.get('https://hcm.azgard9.com/ords/api/Assets/get?EMP_ID=7207');
//       setCurrentAssets(response.data.FacilityAssets);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch current assets.');
//     }
//   };

//   const handleNewRequest = async () => {
//     if (!newRequest.type || !newRequest.brand) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     const requestData = {
//       EMP_ID: global.xx_emp_id, // Assuming EMP_ID is static; change as needed
//       FACILITY_TYPE: newRequest.type,
//       MAKE_BY: newRequest.brand,
//       accessories: newRequest.accessories,
//       CREATED_BY :global.xx_user_id
//     };

//     try {
//       const response = await axios.post(
//         'https://hcm.azgard9.com/ords/api/facility/add', // Replace with your ORDS API endpoint
//         requestData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Request submitted successfully.');
//         setNewRequest({ type: '', brand: '', accessories: '' }); // Reset the form
//       } else {
//         Alert.alert('Error', 'Unexpected response from server.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to submit request. Please try again later.');
//       console.error('POST Error:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Current Asset Details in Table Format */}
//       <Text style={styles.title}>Current Facilities</Text>
//       <View style={styles.table}>
//         <View style={[styles.tableRow, styles.tableHeader]}>
//           <Text style={[styles.tableCell, styles.headerText]}>Asset</Text>
//           <Text style={[styles.tableCell, styles.headerText]}>Brand</Text>
//           <Text style={[styles.tableCell, styles.headerText]}>Issue Date</Text>
//           <Text style={[styles.tableCell, styles.headerText]}>Next Due</Text>
//         </View>
//         <FlatList
//           data={currentAssets}
//           keyExtractor={(item) => item.FACILITY_ASSET_ID.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.tableRow}>
//               <Text style={styles.tableCell}>{item.ASSET}</Text>
//               <Text style={styles.tableCell}>{item.MAKE_BY}</Text>
//               <Text style={styles.tableCell}>{formatDate(item.START_DATE)}</Text>
//               <Text style={styles.tableCell}>{formatDate(item.RETURN_DATE)}</Text>
//             </View>
//           )}
//         />
//       </View>

//       {/* Request New Asset */}
//       <Text style={styles.title}>Request New</Text>
//       <Dropdown
//         style={styles.dropdown}
//         data={assetTypes}
//         labelField="label"
//         valueField="value"
//         placeholder="Select Asset Type"
//         value={newRequest.type}
//         onChange={(item) => setNewRequest({ ...newRequest, type: item.value })}
//       />
//       <TextInput
//         placeholder="Brand"
//         style={styles.input}
//         value={newRequest.brand}
//         onChangeText={(text) => setNewRequest({ ...newRequest, brand: text })}
//       />
//       <TextInput
//         placeholder="Accessories"
//         style={styles.input}
//         value={newRequest.accessories}
//         onChangeText={(text) => setNewRequest({ ...newRequest, accessories: text })}
//       />
// <CheckBox
//         style={styles.checkbox}
//         isChecked={isChecked}
//         onClick={toggleCheckBox}
//        // checkBoxColor="blue" // Set the color of the checkbox
//         rightText="Agree"
//         rightTextStyle={styles.rightText}
//       />
//       <Text style={styles.resultText}>
//         {isChecked ? 'You agreed!' : 'You have not agreed.'}
//       </Text>

//       <Button title="Submit Request" onPress={handleNewRequest} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 5,
//     borderRadius: 5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   tableHeader: {
//     backgroundColor: '#f0f0f0',
//   },
//   tableCell: {
//     flex: 1,
//     padding: 5,
//     textAlign: 'center',
//   },
//   headerText: {
//     fontWeight: 'bold',
//   },
//   dropdown: {
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
// });

// export default FacilityAssets;
