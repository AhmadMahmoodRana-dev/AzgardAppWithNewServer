import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Button,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import CheckBox from 'react-native-check-box';// Install this for the checkbox
import Icon from 'react-native-vector-icons/FontAwesome'; // Install this for icons
import moment from 'moment';
import BASEURL from '../Constants/BaseUrl';

const CNICUpdate = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState(null);
  const [leavHistory, setLeavHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLifetimeExpiry, setIsLifetimeExpiry] = useState(false);// Checkbox state

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'from') {
      setShowFromDatePicker(false);
      if (selectedDate) {
        setFromDate(selectedDate);
      }
    } else {
      setShowToDatePicker(false);
      if (selectedDate) {
        setToDate(selectedDate);
      }
    }
  };

  const formatDate = (dateString) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASEURL}/ords/api/emp_update/get?p_user_id=${global.xx_user_id}`
      );
      const data = await response.json();
      setLeavHistory(data.cinic_update);
    } catch (error) {
     // Alert.alert('Error', 'Failed to fetch  requests');
    } finally {
      setLoading(false);
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile(result[0]);
      setFile(result[0].name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('File picker canceled');
      } else {
        console.error('Unknown error:', err);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      Alert.alert('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('CNIC_ISSUE_DATE', moment(fromDate).format('DD-MMM-YY'));
    formData.append('CNIC_EXPIRY_DATE',  moment(toDate).format('DD-MMM-YY'));
    formData.append('EMP_ID', global.xx_emp_id);
     formData.append('FILE_NAME', selectedFile.name);
     formData.append('file_type', selectedFile.type);
     formData.append('FILEDATA', {
       uri: selectedFile.uri,
       type: selectedFile.type,
       name: selectedFile.name,
    });

console.log("CNINC UPDATE DATA",formData)

    try {
      const response = await axios.post(
        `${BASEURL}/ords/api/updateemp/post`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Update CNIC Record');
      Alert.alert('Update CNIC Record');
    } catch (error) {
      Alert.alert('Error uploading file'+error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <View style={styles.containerdropdown}>
              <Text style={styles.heading}>Update CNIC</Text>

              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.datePicker}>
                <Text>Issue Date: {moment(fromDate).format('DD-MMM-YYYY')}</Text>
                <Icon name="calendar" size={20} color="#666" style={styles.icon} />
              </TouchableOpacity>

              {!isLifetimeExpiry && (
                <TouchableOpacity
                  onPress={() => setShowToDatePicker(true)}
                  style={styles.datePicker}>
                  <Text>Expiry Date: {moment(toDate).format('DD-MMM-YYYY')}</Text>
                  <Icon name="calendar" size={20} color="#666" style={styles.icon} />
                </TouchableOpacity>
              )}

              <View style={styles.checkboxContainer}>
              <CheckBox
                  isChecked={isLifetimeExpiry}
                  onClick={() => setIsLifetimeExpiry(!isLifetimeExpiry)}
                  rightText="Lifetime Expiry"
                  rightTextStyle={styles.checkboxText}
                />
              </View>

              {showFromDatePicker && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'from')}
                />
              )}
              {showToDatePicker && !isLifetimeExpiry && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'to')}
                />
              )}

              <View style={styles.filePicker}>
                <TouchableOpacity
                  style={styles.chooseFileButton}
                  onPress={handleFilePick}>
                  <Text style={styles.chooseFileText}>Add Attachment</Text>
                </TouchableOpacity>
                <Text style={styles.fileName}>
                  {file || 'No file Attachment'}
                </Text>
              </View>

              <View style={styles.uploadB}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleFileUpload}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerdropdown}>
                  <Text style={styles.heading}>CNIC Update History</Text>
             
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                leavHistory && leavHistory.length > 0 ? (
                  leavHistory.map((item) => (
                    <View style={styles.historyItem} key={item.EMP_INFO_ID.toString()}>
                    
                          <Text style={styles.text}>
                            Emp No :{item.EMP_NO}
                          </Text>
                          <Text style={styles.text}>
                           Name: {item.EMP_NAME}
                          </Text>
                          <Text style={styles.text}>
                            Cninc Issue Date: {formatDate(item.CNIC_ISSUE_DATE)}
                          </Text>
                          <Text style={styles.text}>
                            Cnic Expiry Date: {formatDate(item.CNIC_EXPIRY_DATE)}
                          </Text>
                        </View>
                  
                  ))
                ) : (
                  <Text style={styles.emptyText}>No  CNIC Record found</Text>
                )
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
       margin: 10,
        padding: 5,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        elevation: 5,
      },
      heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262626',
        marginBottom: 10,
        textAlign: 'center',
        
      },
     
      
    //dropdown style
    
    containerdropdown: {
     
      margin: 10,
      padding: 5,
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      elevation: 5,
    },
    
    
     
     
    //date and input style
      input: { 
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10, 
        borderRadius: 8,
        backgroundColor: '#FFF',
        elevation: 5,
        },
        datePicker: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 13,
          marginBottom: 7,
          borderRadius: 8,
          backgroundColor: '#FFF',
          elevation: 5,
        },
        icon: {
           
          marginLeft: 10,
          //size:16,
          //color:'red'
        },
        // Add the same styles as above
      uploadButton: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#0288D1',
        borderRadius: 8,
        alignItems: 'center',
      },
    
     
    
      
      date: {
        fontSize: 14,
        color: '#555',
      },
      days: {
        fontSize: 14,
        color: '#777',
      },
      emptyText: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
        fontSize: 16,
      },
      filePicker: {
      //  marginTop: 20,
      //  alignItems: 'center',
      },
      
      chooseFileButton: {

        marginVertical: 10,
        padding: 15,
        backgroundColor: '#0288D1',
        borderRadius: 8,
        alignItems: 'center',

      
      },
      

      // backgroundColor: '#0288D1',
      // paddingVertical: 12,
      //  paddingHorizontal: 20,
      //  borderRadius: 8,
      //  alignItems: 'center',
      // justifyContent: 'center',
      //  marginBottom: 10,
      //  elevation: 5, // Add shadow for Android

      chooseFileText: {
     //color: '#0288D1',
        //fontWeight: 'bold',
       // fontSize: 16,
       
      },
      
      fileName: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
      },text: {
        fontSize: 16,
         marginBottom: 5,
          color: '#000' 
         },
         historyItem: {
           padding: 10,
           marginBottom: 10,
           backgroundColor: '#FFF',
           borderRadius: 8,
           elevation: 3,
           margin:10
         },
    
         checkboxContainer: {
          marginVertical: 10,
        //  flexDirection: 'row',
         // alignItems: 'center',
        },
        checkboxText: {
          fontSize: 16,
          marginLeft: 10,
        },
});

export default CNICUpdate;

// import axios from 'axios';
// import React,{useState,useEffect} from 'react';
// import { View, Text, StyleSheet,TouchableOpacity,TextInput,Alert,ActivityIndicator,ScrollView ,Button} from 'react-native';
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DocumentPicker from 'react-native-document-picker'; 

// import Icon from 'react-native-vector-icons/FontAwesome'; // Install this for icons
// import moment from 'moment';

//   const CNICUpdate = () => {
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [showFromDatePicker, setShowFromDatePicker] = useState(false);
//   const [showToDatePicker, setShowToDatePicker] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [file, setFile] = useState(null);
// const [leavHistory, setLeavHistory] = useState([]);
//   const [loading, setLoading] = useState(false); 
//   const handleDateChange = (event, selectedDate, type) => {
//     if (type === 'from') {
//       setShowFromDatePicker(false);
//       if (selectedDate) {
//         setFromDate(selectedDate);
       
   
//       }
//     } else {
//       setShowToDatePicker(false);
//       if (selectedDate) {
//         setToDate(selectedDate);
       
        
//       }
//     }
//   };
  
//     useEffect(() => {
//       fetchLeaveRequests();
//     }, []);
  
//     const fetchLeaveRequests = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://hcm.azgard9.com/ords/api/emp_update/get`
//         );
//         const data = await response.json();
//         setLeavHistory(data.cinic_update);
//       } catch (error) {
//       //  Alert.alert('Error', 'Failed to fetch leave requests');
//       } finally {
//         setLoading(false);
//       }
//     };

  

//     const formatDate = (dateString) => {
//       const months = [
//         'Jan',
//         'Feb',
//         'Mar',
//         'Apr',
//         'May',
//         'Jun',
//         'Jul',
//         'Aug',
//         'Sep',
//         'Oct',
//         'Nov',
//         'Dec',
//       ];
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = months[date.getMonth()];
//       const year = String(date.getFullYear()).slice(-2);
//       return `${day}-${month}-${year}`;
//     };


//   const handleFilePick = async () => {
//         try {
//           const result = await DocumentPicker.pick({
//             type: [DocumentPicker.types.allFiles],
//           });
//           setSelectedFile(result[0]);
//           setFile(result[0].name);
//         } catch (err) {
//           if (DocumentPicker.isCancel(err)) {
//             console.log('File picker canceled');
//           } else {
//             console.error('Unknown error:', err);
//           }
//         }
//       };

//   // Handle file upload
//   const handleFileUpload = async () => {
//           if (!selectedFile) {
//              Alert.alert('No file selected!');
//              return;
//         }
       

//         console.log(selectedFile); 
//     const formData = new FormData();

//     formData.append('CNIC_ISSUE_DATE',moment(fromDate).format('DD-MMM-YY'));
//     formData.append('CNIC_EXPIRY_DATE',moment(toDate).format('DD-MMM-YY'));
//     formData.append('EMP_ID',global.xx_emp_id);
//     formData.append('FILE_NAME', selectedFile.name);
//     formData.append('file_type', selectedFile.type);
//     formData.append('FILEDATA', {
//        uri: selectedFile.uri,
//        type: selectedFile.type,
//         name: selectedFile.name,
//    });
//   console.log(formData);
//     try {
//         const response = await axios.post('https://hcm.azgard9.com/ords/api/updateemp/post', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log('Update CNIC Record');
//         Alert.alert('Update CNIC Record');
//     } catch (error) {
//         Alert.alert('Error uploading file: '  +moment(fromDate).format('DD-MMM-YY'));
//     }

  
    

    
  





// };

//   return (
//     <SafeAreaProvider>
//     <SafeAreaView>
//     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//     <View>
     
     
//       <View style={styles.containerdropdown}>
//       <Text style={styles.heading}>Add Leave</Text>

//       {/* </View>  */}
//       <TouchableOpacity
//           onPress={() => setShowFromDatePicker(true)}
//           style={styles.datePicker}>
//           <Text>From Date: {moment(fromDate).format('DD-MMM-YYYY')}</Text>
//           <Icon name="calendar" size={20} color="#666" style={styles.icon}/>
         
//         </TouchableOpacity>

//         {/* To Date Picker */}
//         <TouchableOpacity
//           onPress={() => setShowToDatePicker(true)}
//           style={styles.datePicker}>
//           <Text>To Date: {moment(toDate).format('DD-MMM-YYYY')}</Text>
//           <Icon name="calendar" size={20} color="#666" style={styles.icon}/>
//         </TouchableOpacity>


//         {showFromDatePicker && (
//           <DateTimePicker
//             value={fromDate}
//             mode="date"
//             display="default"
//             onChange={(event, date) => handleDateChange(event, date, 'from')}
//           />
//         )}
//         {showToDatePicker && (
//           <DateTimePicker
//             value={toDate}
//             mode="date"
//             display="default"
//             onChange={(event, date) => handleDateChange(event, date, 'to')}
//           />
//         )}
//         <View style={styles.filePicker}>
//   <TouchableOpacity style={styles.chooseFileButton} onPress={handleFilePick}>
//     <Text style={styles.chooseFileText}>Choose File</Text>
//   </TouchableOpacity>
//   <Text style={styles.fileName}>
//     {file || 'No file chosen'}
//   </Text>
// </View>


//         <View style={styles.uploadB} >


//         <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
//           <Text>Save</Text>
//         </TouchableOpacity>
// </View>
       
//       </View>
    
// <View style={styles.containerdropdown}>
//       <Text style={styles.heading}>Request History</Text>
 
//   {loading ? (
//     <ActivityIndicator size="large" color="#0000ff" />
//   ) : (
//     leavHistory && leavHistory.length > 0 ? (
//       leavHistory.map((item) => (
//         <View style={styles.historyItem} key={item.EMP_INFO_ID.toString()}>
//          <Text style={styles.text}>
//                Emp No :{item.EMP_NO} Name: {item.EMP_NAME}
//              </Text>
//              <Text style={styles.text}>Card No: {item.CARD_ID}</Text>
//              <Text style={styles.text}>
//                Cninc Issue Date: {formatDate(item.CNIC_ISSUE_DATE)}
//              </Text>
//              <Text style={styles.text}>
//                Cnic Expiry Date: {formatDate(item.CNIC_EXPIRY_DATE)}
//              </Text>
//         </View>
//       ))
//     ) : (
//       <Text style={styles.emptyText}>No  requests found</Text>
//     )
//   )}
// </View>

    
      
//      </View>
//      </ScrollView>
    
//     </SafeAreaView>
//     </SafeAreaProvider>
   
//   );
// };




// const styles = StyleSheet.create({
//   container: {
//    margin: 10,
//     padding: 5,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 10,
//     elevation: 5,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#262626',
//     marginBottom: 10,
//     textAlign: 'center',
    
//   },
 
  
// //dropdown style

// containerdropdown: {
 
//   margin: 10,
//   padding: 5,
//   backgroundColor: '#F5F5F5',
//   borderRadius: 10,
//   elevation: 5,
// },


 
 
// //date and input style
//   input: { 
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10, 
//     borderRadius: 8,
//     backgroundColor: '#FFF',
//     elevation: 5,
//     },
//     datePicker: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       borderWidth: 1,
//       borderColor: '#ccc',
//       padding: 13,
//       marginBottom: 7,
//       borderRadius: 8,
//       backgroundColor: '#FFF',
//       elevation: 5,
//     },
//     icon: {
       
//       marginLeft: 10,
//       //size:16,
//       //color:'red'
//     },
//     // Add the same styles as above
//   uploadButton: {
//     marginVertical: 10,
//     padding: 15,
//     backgroundColor: '#0288D1',
//     borderRadius: 8,
//     alignItems: 'center',
//   },

 

  
//   date: {
//     fontSize: 14,
//     color: '#555',
//   },
//   days: {
//     fontSize: 14,
//     color: '#777',
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#777',
//     marginTop: 20,
//     fontSize: 16,
//   },
//   filePicker: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
  
//   chooseFileButton: {
//     backgroundColor: '#0288D1',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     elevation: 5, // Add shadow for Android
//   },
  
//   chooseFileText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
  
//   fileName: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//     marginTop: 5,
//   },text: {
//     fontSize: 16,
//      marginBottom: 5,
//       color: '#000' 
//      },
//      historyItem: {
//        padding: 10,
//        marginBottom: 10,
//        backgroundColor: '#FFF',
//        borderRadius: 8,
//        elevation: 3,
//        margin:10
//      },
  


// });

// export default CNICUpdate;



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Button,
//   Alert,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DocumentPicker from 'react-native-document-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const CNICUpdate = () => {
//   const [issueDate, setIssueDate] = useState(null);
//   const [expiryDate, setExpiryDate] = useState(null);
//   const [file, setFile] = useState(null);
//   const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
//   const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

//   const handleFilePick = async () => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });
//       setFile(result[0].name);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('File picker canceled');
//       } else {
//         console.error('Unknown error:', err);
//       }
//     }
//   };

//   const saveCNICData = async () => {
//     if (!issueDate || !expiryDate || !file) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     const requestData = {
//       ISSUE_DATE: issueDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//       EXPIRY_DATE: expiryDate.toISOString().split('T')[0],
//       FILE_NAME: file,
//     };

//     try {
//       const response = await fetch('http://<your-server>:<port>/ords/<schema>/cnic/save', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'CNIC data saved successfully!');
//       } else {
//         const errorData = await response.json();
//         Alert.alert('Error', errorData.message || 'Failed to save CNIC data.');
//       }
//     } catch (error) {
//       console.error('Error saving CNIC data:', error);
//       Alert.alert('Error', 'An error occurred while saving CNIC data.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>CNIC Info</Text>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>CNIC Issue Date</Text>
//         <TouchableOpacity
//           onPress={() => setShowIssueDatePicker(true)}
//           style={styles.datePicker}
//         >
//           <Icon name="calendar" size={20} color="#666" style={styles.icon} />
//           <Text style={styles.input}>
//             {issueDate ? issueDate.toDateString() : 'Select Issue Date'}
//           </Text>
//         </TouchableOpacity>
//         {showIssueDatePicker && (
//           <DateTimePicker
//             value={issueDate || new Date()}
//             mode="date"
//             display="default"
//             onChange={(event, selectedDate) => {
//               setShowIssueDatePicker(false);
//               if (selectedDate) setIssueDate(selectedDate);
//             }}
//           />
//         )}
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>CNIC Expiry Date</Text>
//         <TouchableOpacity
//           onPress={() => setShowExpiryDatePicker(true)}
//           style={styles.datePicker}
//         >
//           <Icon name="calendar" size={20} color="#666" style={styles.icon} />
//           <Text style={styles.input}>
//             {expiryDate ? expiryDate.toDateString() : 'Select Expiry Date'}
//           </Text>
//         </TouchableOpacity>
//         {showExpiryDatePicker && (
//           <DateTimePicker
//             value={expiryDate || new Date()}
//             mode="date"
//             display="default"
//             onChange={(event, selectedDate) => {
//               setShowExpiryDatePicker(false);
//               if (selectedDate) setExpiryDate(selectedDate);
//             }}
//           />
//         )}
//       </View>

//       <View style={styles.filePicker}>
//         <Button title="Choose File" onPress={handleFilePick} />
//         <Text style={styles.fileName}>{file || 'No file chosen'}</Text>
//       </View>

//       <Button title="Save CNIC Data" onPress={saveCNICData} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//     flex: 1,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     marginBottom: 5,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   datePicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//   },
//   input: {
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 10,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   filePicker: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   fileName: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default CNICUpdate;
