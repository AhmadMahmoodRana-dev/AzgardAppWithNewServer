import axios from 'axios';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Install this for icons
import moment from 'moment';
const MaternityLeave = () => {
  const [leaveSummary, setLeaveSummary] = useState(null);
  const [value, setValue] = useState('21');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [dueTo, setDueTo] = useState('');
  const [noOfDays, setNoOfDays] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [leavHistory, setLeavHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'from') {
      setShowFromDatePicker(false);
      if (selectedDate) {
        setFromDate(selectedDate);
        // Calculate the number of days after updating the fromDate
        calculateDays(selectedDate, toDate);
      }
    } else {
      setShowToDatePicker(false);
      if (selectedDate) {
        setToDate(selectedDate);
        // Calculate the number of days after updating the toDate
        calculateDays(fromDate, selectedDate);
      }
    }
  };

  // Function to calculate the difference in days between two dates
  const calculateDays = (startDate, endDate) => {
    if (startDate && endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (start < today) {
        Alert.alert('Error', "Start date must be after today's date.");
        setNoOfDays('0');
        return;
      }
      if (end < start) {
        Alert.alert('Error', 'End date must be after start date.');
        setNoOfDays('0');
        return;
      }
      const differenceInDays =
        Math.floor((end - start) / (1000 * 3600 * 24)) + 1; // Include end date
      setNoOfDays(differenceInDays.toString());
    } else {
      setNoOfDays('0');
    }
  };

  // useEffect(() => {
  //   calculateDays(fromDate, toDate);
  // }, [fromDate, toDate]);

  const data = [{label: 'Maternity Leave', value: '21'}];

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://hcm-azgard9.azgard9.com:8444/ords/api/history/az?EMP_ID=${global.xx_emp_id}`,
      );
      const data = await response.json();

      setLeavHistory(data.leave_history);
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
      `http://hcm-azgard9.azgard9.com:8444/ords/api/summary/az?EMP_ID=${global.xx_emp_id}`,
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
        Alert.alert('File selection was cancelled.');
      } else {
        Alert.alert('Unknown error: ' + err.message);
      }
    }
  };

  // Handle file upload
  // const handleFileUpload = async () => {
  //        /* if (!selectedFile) {
  //           Alert.alert('No file selected!');
  //           return;
  //       }*/

  //   const formData = new FormData();
  //   formData.append('LEAVE_ID',value);
  //   formData.append('from_date',moment(fromDate).format('DD-MMM-YY'));
  //   formData.append('to_date',moment(toDate).format('DD-MMM-YY'));
  //   formData.append('no_of_days', noOfDays); // Add no_of_days
  //   formData.append('remarks', dueTo);
  //   formData.append('emp_id',global.xx_emp_id);
  //   formData.append('CREATED_BY',global.xx_user_id);
  //   if (selectedFile) {
  //   formData.append('FILE_NAME', selectedFile.name);
  //   formData.append('file_type', selectedFile.type);
  //   formData.append('FILEDATA', {
  //       uri: selectedFile.uri,
  //       type: selectedFile.type,
  //       name: selectedFile.name,
  //   });
  // }
  //   try {
  //       const response = await axios.post('http://hcm-azgard9.azgard9.com:8444/ords/api/leave/insertLeave', formData, {
  //           headers: {
  //               'Content-Type': 'multipart/form-data',
  //           },
  //       });
  //       console.log('File uploaded successfully!',moment(fromDate).format('DD-MMM-YY'));
  //       Alert.alert('Leave Added successfully!');
  //   } catch (error) {
  //       Alert.alert('Error uploading file: '  +moment(fromDate).format('DD-MMM-YY'));
  //   }
  //};

  const handleFileUpload = async () => {
    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time from current date
    const start = new Date(fromDate);
    const end = new Date(toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
      Alert.alert("❌ Start date must be after today's date.");
      setNoOfDays('0');
      return;
    }

    if (end < start) {
      Alert.alert('❌ End date must be after start date.');
      setNoOfDays('0');
      return;
    }

    if (!noOfDays || parseInt(noOfDays) <= 0) {
      Alert.alert('❌ Invalid number of days.');
      return;
    }

    const formData = new FormData();

    formData.append('LEAVE_ID', value);
    formData.append('from_date', moment(fromDate).format('DD-MMM-YY'));
    formData.append('to_date', moment(toDate).format('DD-MMM-YY'));
    formData.append('no_of_days', noOfDays);
    formData.append('remarks', dueTo);
    formData.append('emp_id', global.xx_emp_id);
    formData.append('CREATED_BY', global.xx_user_id);

    if (selectedFile) {
      formData.append('FILE_NAME', selectedFile.name || 'upload.jpg');
      formData.append('file_type', selectedFile.type || 'image/jpeg');
      formData.append('FILEDATA', {
        uri: selectedFile.uri,
        type: selectedFile.type || 'image/jpeg',
        name: selectedFile.name || 'upload.jpg',
      });
    }

    try {
      const response = await axios.post(
        'http://hcm-azgard9.azgard9.com:8444/ords/api/leave/insertLeave',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('📤 Request sent.');
      console.log('✅ Response:', response.data);

      const xStatus = response.data?.X_STATUS;

      if (response.status === 200 && xStatus === '200') {
        Alert.alert('✅ Leave Added successfully!');
        return;
      } else if (xStatus === '404') {
        Alert.alert('❌ Leave request already exists.');
      } else {
        Alert.alert('❌ Unexpected server response.');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View>
            {/* <View style={styles.container}>
      <Text style={styles.heading}>Leave Summary</Text>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.headerCell]}>Tilte</Text>
        <Text style={[styles.cell, styles.headerCell]}>Casual</Text>
        <Text style={[styles.cell, styles.headerCell]}>Medical</Text>
        <Text style={[styles.cell, styles.headerCell]}>Annual</Text>
        <Text style={[styles.cell, styles.headerCell]}>Total</Text>
      </View>
      {leaveSummary &&   leaveSummary.map((item,index) => ( 
        <React.Fragment key={item.id || index}>
      <>
       
      <View style={styles.row} key={1||item.id || index}>
      <Text style={[styles.cell, styles.blueCell]}>Entitled:</Text>
         <Text style={[styles.cell, styles.blueCell]}>{item.ENTITLEMENT_CASUAL_VALUE}</Text> 
        <Text style={[styles.cell, styles.blueCell]}>{item.ENTITLEMENT_MEDICAL_VALUE}</Text>
        <Text style={[styles.cell, styles.blueCell]}>{item.ENTITLEMENT_ANNUAL_VALUE}</Text>
        <Text style={[styles.cell, styles.blueCell]}>{item.TOTAL_ENTITLEMENT_VALUE}</Text>
      </View>
      
     
      <View style={styles.row} key={2||item.id || index}>
      <Text style={[styles.cell, styles.redCell]}>Availed:</Text>
        <Text style={[styles.cell, styles.redCell]}>{item.AVAILED_CASUAL_VALUE}</Text>
        <Text style={[styles.cell, styles.redCell]}>{item.AVAILED_MEDICAL_VALUE}</Text>
        <Text style={[styles.cell, styles.redCell]}>{item.AVAILED_ANNUAL_VALUE}</Text>
        <Text style={[styles.cell, styles.redCell]}>{item.TOTAL_AVAILED_VALUE}</Text>
      </View>
      
      
      <View style={styles.row}key={3||item.id || index}>
      <Text style={[styles.cell, styles.greenCell]}>Balance:</Text>
        <Text style={[styles.cell, styles.greenCell]}>{item.BALANCE_CASUAL_VALUE}</Text>
        <Text style={[styles.cell, styles.greenCell]}>{item.BALANCE_MEDICAL_VALUE}</Text>
        <Text style={[styles.cell, styles.greenCell]}>{item.BALANCE_ANNUAL_VALUE}</Text>
        <Text style={[styles.cell, styles.greenCell]}>{item.TOTAL_BALANCE_VALUE}</Text>
      </View>
     
      </>
       </React.Fragment>
      ))} 
      </View> */}
            <View style={styles.containerdropdown}>
              <Text style={styles.heading}>Add Leave</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Leave Type"
                value={value}
                onChange={item => {
                  setValue(item.value);
                  //  console.log('Selected item:', item);
                }}
              />
              {/* </View>  */}
              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.datePicker}>
                <Text>From Date: {moment(fromDate).format('DD-MMM-YYYY')}</Text>
                <Icon
                  name="date-range"
                  size={20}
                  color="#333"
                  style={styles.icon}
                />
              </TouchableOpacity>

              {/* To Date Picker */}
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={styles.datePicker}>
                <Text>To Date: {moment(toDate).format('DD-MMM-YYYY')}</Text>
                <Icon
                  name="date-range"
                  size={20}
                  color="#333"
                  style={styles.icon}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="No of Days"
                keyboardType="numeric"
                value={noOfDays}
                onChangeText={setNoOfDays}
              />
              <TextInput
                style={styles.input}
                placeholder="Due To"
                keyboardType="default"
                value={dueTo}
                onChangeText={setDueTo}
              />

              {showFromDatePicker && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) =>
                    handleDateChange(event, date, 'from')
                  }
                />
              )}
              {showToDatePicker && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) =>
                    handleDateChange(event, date, 'to')
                  }
                />
              )}
              <View style={styles.uploadB}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleFileSelect}>
                  <Text>Add Attachment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleFileUpload}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.containerdropdown}>
              <Text style={styles.heading}>Leave History</Text>

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : leavHistory && leavHistory.length > 0 ? (
                leavHistory
                  .filter(item => item.LEAVE_TYPE === 'Maternity Leave')
                  .map(item => (
                    <View
                      style={styles.historyItem}
                      key={item.EMP_LEAVE_ID.toString()}>
                      <Text style={styles.leaveType}>
                        {item.LEAVE_TYPE} {item.DESIGNATION}{' '}
                      </Text>
                      <Text style={styles.date}>
                        From Date:{' '}
                        {moment(item.FROM_DATE).format('DD-MMM-YYYY')} TO Date:{' '}
                        {moment(item.TO_DATE).format('DD-MMM-YYYY')}
                      </Text>
                      {/* <Text style={styles.days}>No. of Days: {item.NO_OF_DAYS}</Text> */}

                      <Text style={styles.days}>
                        No. of Days: {item.NO_OF_DAYS} Status :
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
});

export default MaternityLeave;
