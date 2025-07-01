import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import moment from 'moment';
import BASEURL from '../Constants/BaseUrl';

const ShortLeaveForm = () => {
  const [leaveType, setLeaveType] = useState('28');
  const [fromDateTime, setFromDateTime] = useState(new Date());
  const [toDateTime, setToDateTime] = useState(new Date());
  const [leaveSummary, setLeaveSummary] = useState(null);
  const [leavHistory, setLeavHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState({
    visible: false,
    type: '', // "from" or "to"
  });
  const [calculatedHours, setCalculatedHours] = useState('');
  const [dueTo, setDueTo] = useState('');

  const leaveOptions = [{label: 'Short Leave', value: '28'}];

  // Function to calculate hours
  const calculateHours = (start, end) => {
    const diffInMilliseconds = end.getTime() - start.getTime();
    const hours = (diffInMilliseconds / (1000 * 60 * 60)).toFixed(2); // Convert to hours
    setCalculatedHours(hours >= 0 ? hours : '0');
  };

  useEffect(() => {
    calculateHours(fromDateTime, toDateTime);
  }, [fromDateTime, toDateTime]);

  // DateTimePicker handlers
  const showDatePicker = type => {
    setPickerVisible({visible: true, type});
  };

  const hideDatePicker = () => {
    setPickerVisible({visible: false, type: ''});
  };

  const handleConfirm = selectedDate => {
    if (isPickerVisible.type === 'from') {
      setFromDateTime(selectedDate);
    } else if (isPickerVisible.type === 'to') {
      setToDateTime(selectedDate);
    }
    hideDatePicker();
  };
  console.log("IQRA",global.xx_emp_id)

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASEURL}/ords/api/view/shortLeave?EMP_ID=${global.xx_emp_id}`,
      );
      const data = await response.json();

      setLeavHistory(data.short_leave);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    // Fetch data from first API
    fetch(
      `${BASEURL}/ords/api/summary/az?EMP_ID=${global.xx_emp_id}`,
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        //console.log(data.leave_balance);
        setLeaveSummary(data.leave_balance);
        //setLoading1(false);
      });
  }, []);

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('File selection cancelled.');
      } else {
        Alert.alert('Unknown error: ' + err.message);
      }
    }
  };

  //   const handleSubmit = async () => {
  //   if (!calculatedHours || !dueTo) {
  //     Alert.alert('Error', 'Please fill in all required fields.');
  //     return;
  //   }

  //   if (parseFloat(calculatedHours) > 2) {
  //     Alert.alert('Error', 'Short leave cannot exceed 2 hours.');
  //     return;
  //   }

  //   // Ensure from and to date are on the same day
  //   const fromDateFormatted = moment(fromDateTime).format('YYYY-MM-DD');
  //   const toDateFormatted = moment(toDateTime).format('YYYY-MM-DD');

  //   if (fromDateFormatted !== toDateFormatted) {
  //     Alert.alert('Error', 'Short leave must start and end on the same day.');
  //     return;
  //   }

  //   // Check if a short leave already exists for the same day
  //   const isDuplicate = leavHistory.some(leave => {
  //     const leaveDay = moment(leave.FROM_DATE).format('YYYY-MM-DD');
  //     return leaveDay === fromDateFormatted;
  //   });

  //   if (isDuplicate) {
  //     Alert.alert(
  //       'Error',
  //       'A short leave already exists for this date. You can only apply once per day.',
  //     );
  //     return;
  //   }

  //   const apiUrl = 'https://hcm.azgard9.com/ords/api/shortLeaves/submit';

  //   const formatDateToOracle = date => {
  //     const options = {
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: true,
  //     };
  //     const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
  //       date,
  //     );
  //     const [month, day, year] = formattedDate.split(',')[0].split('/');
  //     const [time, period] = formattedDate.split(',')[1].trim().split(' ');
  //     return `${year}-${month}-${day}T${time} ${period}`;
  //   };

  //   const formattedFromDate = formatDateToOracle(fromDateTime);
  //   const formattedToDate = formatDateToOracle(toDateTime);

  //   const payload = {
  //     EMP_ID: global.xx_emp_id,
  //     FROM_DATE: formattedFromDate,
  //     TO_DATE: formattedToDate,
  //     HOURS: parseFloat(calculatedHours),
  //     CREATED_BY: global.xx_user_id,
  //     DUE_TO: dueTo,
  //   };

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       Alert.alert('Success', 'Leave submitted successfully!');
  //       fetchLeaveRequests();
  //       setDueTo('');
  //       setFromDateTime(new Date());
  //       setToDateTime(new Date());
  //       setCalculatedHours('');
  //     } else {
  //       const errorData = await response.json();
  //       Alert.alert('Error', errorData.message || 'Failed to submit leave.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'An error occurred while submitting leave.');
  //   }
  // };

  const handleSubmit = async () => {
    if (!calculatedHours || !dueTo) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (parseFloat(calculatedHours) > 2) {
      Alert.alert('Error', 'Short leave cannot exceed 2 hours.');
      return;
    }

    const fromDateFormatted = moment(fromDateTime).format('YYYY-MM-DD');
    const toDateFormatted = moment(toDateTime).format('YYYY-MM-DD');

    if (fromDateFormatted !== toDateFormatted) {
      Alert.alert('Error', 'Short leave must start and end on the same day.');
      return;
    }

    const isDuplicate = leavHistory.some(leave => {
      const leaveDay = moment(leave.FROM_DATE).format('YYYY-MM-DD');
      return leaveDay === fromDateFormatted;
    });

    if (isDuplicate) {
      Alert.alert('Error', 'A short leave already exists for this date.');
      return;
    }

    const formatDateToOracle = date => {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
        date,
      );
      const [month, day, year] = formattedDate.split(',')[0].split('/');
      const [time, period] = formattedDate.split(',')[1].trim().split(' ');
      return `${year}-${month}-${day}T${time} ${period}`;
    };

    const formattedFromDate = formatDateToOracle(fromDateTime);
    const formattedToDate = formatDateToOracle(toDateTime);

    const formData = new FormData();
    formData.append('EMP_ID', global.xx_emp_id);
    formData.append('FROM_DATE', formattedFromDate);
    formData.append('TO_DATE', formattedToDate);
    formData.append('HOURS', parseFloat(calculatedHours));
    formData.append('CREATED_BY', global.xx_user_id);
    formData.append('DUE_TO', dueTo);

    if (selectedFile) {
      formData.append('FILE_NAME', selectedFile.name || 'upload.jpg');
      formData.append('file_type', selectedFile.type || 'image/jpeg');
      formData.append('FILEDATA', {
        uri: selectedFile.uri,
        type: selectedFile.type || 'image/jpeg',
        name: selectedFile.name || 'upload.jpg',
      });
    }

    console.log("SHORT LEAVE FORM DATA",formData)
    try {
      const response = await axios.post(
      `${BASEURL}/ords/api/shortLeave/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Leave submitted successfully!');
        fetchLeaveRequests();
        setDueTo('');
        setFromDateTime(new Date());
        setToDateTime(new Date());
        setCalculatedHours('');
        setSelectedFile(null);
      } else {
        Alert.alert('Error', 'Failed to submit leave.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'An error occurred while submitting leave.');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {/* <View> */}

          <View style={styles.container}>
            <Text style={styles.heading}>Leave Summary</Text>

            {leaveSummary &&
              leaveSummary.map((item, index) => (
                <View style={styles.leaveCardContainer}>
                  <View style={styles.leaveCard}>
                    <AnimatedCircularProgress
                      size={90}
                      width={10}
                      fill={(item.BALANCE_SHORT_VALUE / 2) * 100} // Progress in percentage
                      tintColor="#C70000"
                      backgroundColor="#3498DB">
                      {fill => (
                        <Text style={styles.progressText}>
                          <Text style={{color: '#3498DB'}}>
                            {' '}
                            {/* Blue color for BALANCE_CASUAL_VALUE */}
                            {2}
                          </Text>
                          /
                          <Text style={{color: '#C70000'}}>
                            {' '}
                            {/* Red color for AVAILED_CASUAL_VALUE */}
                            {item.BALANCE_SHORT_VALUE}
                          </Text>
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                    <Text style={styles.leaveType}>Short Leave</Text>
                  </View>
                </View>
              ))}
          </View>

          <View style={styles.containerdropdown}>
            <Text style={styles.heading}>Add Leave</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={leaveOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Leave Type"
              value={leaveType}
              onChange={item => setLeaveType(item.value)}
            />

            {/* From Date & Time */}
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => showDatePicker('from')}>
              <Text>
                From: {moment(fromDateTime).format('DD-MMM-YYYY hh:mm A')}
              </Text>
            </TouchableOpacity>

            {/* To Date & Time */}
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => showDatePicker('to')}>
              <Text>
                To: {moment(toDateTime).format('DD-MMM-YYYY hh:mm A')}
              </Text>
            </TouchableOpacity>

            {/* Date-Time Picker */}
            <DateTimePickerModal
              isVisible={isPickerVisible.visible}
              mode="datetime"
              date={isPickerVisible.type === 'from' ? fromDateTime : toDateTime}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            {/* Calculated Hours */}
            <TextInput
              style={styles.input}
              placeholder="Calculated Hours"
              keyboardType="numeric"
              value={calculatedHours}
              editable={false}
            />

            {/* Due To */}
            <TextInput
              style={styles.input}
              placeholder="Due To"
              value={dueTo}
              onChangeText={setDueTo}
            />

            {/* Submit Button */}
            <View style={styles.uploadB}>

            <TouchableOpacity style={styles.button} onPress={handleFileSelect}>
              <Text style={styles.buttonText}>
                 Attach File
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.containerdropdown}>
            <Text style={styles.heading}>Leave History</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : leavHistory && leavHistory.length > 0 ? (
              leavHistory.map(item => (
                <View
                  style={styles.historyItem}
                  key={item.EMP_LEAVE_ID.toString()}>
                  <Text style={styles.leaveType}>
                    Short Leave {item.DESIGNATION}{' '}
                  </Text>
                  <Text style={styles.date}>
                    From Date: {moment(item.FROM_DATE).format('DD-MMM-YYYY')} TO
                    Date: {moment(item.TO_DATE).format('DD-MMM-YYYY')}
                  </Text>
                  {/* <Text style={styles.days}>Hours: {item.HOURS}</Text> */}
                  <Text style={styles.days}>
                    Hours: {item.HOURS} Status :
                    <Text
                      style={{
                        color:
                          item.LEAVE_STATUS === 'CREATED'
                            ? 'blue'
                            : item.LEAVE_STATUS === 'REJECTED'
                            ? 'red'
                            : item.LEAVE_STATUS === 'APPROVED'
                            ? 'green'
                            : 'black', // Default color
                        fontWeight: 'bold', // Make the status text bold
                      }}>
                      {' '}
                      {item.LEAVE_STATUS}
                    </Text>
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No leave requests found</Text>
            )}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 3,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,

    marginHorizontal: 5,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
  },
  headerCell: {
    backgroundColor: '#E0E0E0',
    fontWeight: 'bold',
    color: '#000',
  },
  blueCell: {
    backgroundColor: '#C7E7FF',
    color: '#003F5C',
  },
  redCell: {
    backgroundColor: '#FFC7C7',
    color: '#C70000',
  },
  greenCell: {
    backgroundColor: '#C7FFDA',
    color: '#006F3C',
  },
  ///

  //dropdown style

  containerdropdown: {
    margin: 10,
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    elevation: 5,
  },

  aaa: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    width: '100%',
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
    elevation: 5,
    marginBottom: 8,
    marginTop: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#888',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
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
    size: 16,
    color: 'red',
  },
  // Add the same styles as above
  uploadButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#0288D1',
    borderRadius: 8,
    alignItems: 'center',
  },

  uploadB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 3,
  },

  attachmentItem: {
    padding: 10,
    backgroundColor: '#0288D1',
    borderRadius: 8,
    marginBottom: 8,
  },
  ///add history tab
  historyItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 3,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  leaveCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  leaveCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveType: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },

  progressText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0288D1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShortLeaveForm;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import moment from "moment";

// const ShortLeaveForm = () => {
//   const [leaveType, setLeaveType] = useState('28');
//   const [fromDateTime, setFromDateTime] = useState(new Date());
//   const [toDateTime, setToDateTime] = useState(new Date());
//   const [isPickerVisible, setPickerVisible] = useState({
//     visible: false,
//     type: "", // "from" or "to"
//   });
//   const [calculatedHours, setCalculatedHours] = useState("");
//   const [dueTo, setDueTo] = useState("");

//   const leaveOptions = [{ label: "Short Leave", value: "28" }];

//   // Function to calculate hours
//   const calculateHours = (start, end) => {
//     const diffInMilliseconds = end.getTime() - start.getTime();
//     const hours = (diffInMilliseconds / (1000 * 60 * 60)).toFixed(2); // Convert to hours
//     setCalculatedHours(hours >= 0 ? hours : "0");
//   };

//   useEffect(() => {
//     calculateHours(fromDateTime, toDateTime);
//   }, [fromDateTime, toDateTime]);

//   // DateTimePicker handlers
//   const showDatePicker = (type) => {
//     setPickerVisible({ visible: true, type });
//   };

//   const hideDatePicker = () => {
//     setPickerVisible({ visible: false, type: "" });
//   };

//   const handleConfirm = (selectedDate) => {
//     if (isPickerVisible.type === "from") {
//       setFromDateTime(selectedDate);
//     } else if (isPickerVisible.type === "to") {
//       setToDateTime(selectedDate);
//     }
//     hideDatePicker();
//   };

//   const handleSubmit = async () => {
//     if (!calculatedHours || !dueTo) {
//       Alert.alert("Error", "Please fill in all required fields.");
//       return;
//     }

//     const apiUrl = 'https://hcm.azgard9.com/ords/api/shortLeave/submit';

//     // Helper function to format Date object as 'YYYY-MM-DD"T"HH:MI AM'
//     const formatDateToOracle = (date) => {
//       const options = {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true, // Ensures AM/PM format
//       };
//       const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
//       const [month, day, year] = formattedDate.split(",")[0].split("/");
//       const [time, period] = formattedDate.split(",")[1].trim().split(" ");
//       return `${year}-${month}-${day}T${time} ${period}`;
//     };

//     // Format dates
//     const formattedFromDate = formatDateToOracle(fromDateTime);
//     const formattedToDate = formatDateToOracle(toDateTime);

//     const payload = {
//       EMP_ID: global.xx_emp_id, // Replace with dynamic EMP_ID if needed
//       FROM_DATE: formattedFromDate,
//       TO_DATE: formattedToDate,
//       HOURS: parseFloat(calculatedHours), // Ensure it's sent as a number
//       CREATED_BY: global.xx_user_id, // Replace with the actual user ID if needed
//       DUE_TO: dueTo,
//     };

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         Alert.alert("Success", "Leave submitted successfully!");
//       } else {
//         const errorData = await response.json();
//         Alert.alert("Error", errorData.message || "Failed to submit leave.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "An error occurred while submitting leave.");
//     }
//   };

//   return (

//     <View style={styles.container}>

//       <Text style={styles.heading}>Add Short Leave</Text>

//       {/* Leave Type Dropdown */}
//       <Dropdown
//         style={styles.dropdown}
//         placeholderStyle={styles.placeholderStyle}
//         selectedTextStyle={styles.selectedTextStyle}
//         data={leaveOptions}
//         labelField="label"
//         valueField="value"
//         placeholder="Select Leave Type"
//         value={leaveType}
//         onChange={(item) => setLeaveType(item.value)}
//       />

//       {/* From Date & Time */}
//       <TouchableOpacity
//         style={styles.datePicker}
//         onPress={() => showDatePicker("from")}
//       >
//         <Text>From: {moment(fromDateTime).format("DD-MMM-YYYY hh:mm A")}</Text>
//       </TouchableOpacity>

//       {/* To Date & Time */}
//       <TouchableOpacity
//         style={styles.datePicker}
//         onPress={() => showDatePicker("to")}
//       >
//         <Text>To: {moment(toDateTime).format("DD-MMM-YYYY hh:mm A")}</Text>
//       </TouchableOpacity>

//       {/* Date-Time Picker */}
//       <DateTimePickerModal
//         isVisible={isPickerVisible.visible}
//         mode="datetime"
//         date={
//           isPickerVisible.type === "from" ? fromDateTime : toDateTime
//         }
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//       />

//       {/* Calculated Hours */}
//       <TextInput
//         style={styles.input}
//         placeholder="Calculated Hours"
//         keyboardType="numeric"
//         value={calculatedHours}
//         editable={false}
//       />

//       {/* Due To */}
//       <TextInput
//         style={styles.input}
//         placeholder="Due To"
//         value={dueTo}
//         onChangeText={setDueTo}
//       />

//       {/* Submit Button */}
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>
//       </View>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//    marginTop:100,
//     margin: 10,
//     padding: 5,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 10,
//     elevation: 5,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#333",
//     elevation: 5,
//   },
//   dropdown: {
//     width: '100%',
//     height: 50,
//     borderColor: '#CCC',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     backgroundColor: '#FFF',

//     elevation: 5,
//     marginBottom:8,
//     marginTop:8,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: '#888',
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: '#333',
//   },
//   datePicker: {
//     marginBottom: 15,
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#CCC",
//     borderRadius: 8,
//     backgroundColor: "#FFF",
//     elevation: 5,
//   },
//   input: {
//     marginBottom: 15,
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#CCC",
//     borderRadius: 8,
//     backgroundColor: "#FFF",
//     elevation: 5,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "#0288D1",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     elevation: 5,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default ShortLeaveForm;
