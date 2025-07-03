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
  Pressable,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import numeral from 'numeral';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome'; // Install this for icons
import moment from 'moment';
import BASEURL from '../Constants/BaseUrl';

const AdvanceSalary = () => {
  const [fromDate, setFromDate] = useState(new Date());

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [leavHistory, setLeavHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [remarks, setRemrks] = useState('');

  const [amount, setAmount] = useState('');

  const [value, setValue] = useState('6');
  const data = [{label: ' ABL MAIN MKT, GULBERG, LHR.', value: '6'}];

  const formatDate = dateString => {
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

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://erp.visionplusapps.com:8081/ords/api/adv/get?EMP_ID=${global.xx_emp_id}`,
      );
      const data = await response.json();
      setLeavHistory(data.salary);
    } catch (error) {
      ///  Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const formatAmount = amount => {
    return numeral(amount).format('0,0'); // Format number with commas
  };

  // Handle file upload
  //   const handleFileUpload = async () => {
  //   if (!amount || !remarks || !value || !global.xx_user_id || !global.xx_emp_id) {
  //     Alert.alert('Validation Error', 'Please fill all required fields.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('AMOUNT', amount);
  //   formData.append('ADVANCE_DATE', moment(fromDate).format('DD-MMM-YY'));
  //   formData.append('REMARKS', remarks);
  //   formData.append('CREATED_BY', global.xx_user_id);
  //   formData.append('BANK_ID', value);
  //   formData.append('EMP_ID', global.xx_emp_id);

  //   console.log('FormData being sent:');
  //   for (let pair of formData.entries()) {
  //     console.log(`${pair[0]}: ${pair[1]}`);
  //   }

  //   try {
  //     console.log("Calling API...");

  //     const response = await axios.post(
  //       'https://erp.visionplusapps.com:8081/ords/api/salary/insert',
  //       formData,
  //       {
  //         headers: {
  //           // DO NOT manually set content-type for FormData
  //           Accept: 'application/json',
  //         },
  //       }
  //     );

  //     console.log("API response:", response?.data);

  //     if (response?.data && response.data.STATUS === 'SUCCESS') {
  //       Alert.alert('Success', 'Record added successfully!');
  //     } else {
  //       Alert.alert('Failed', response?.data?.MESSAGE || 'Failed to add record');
  //     }

  //   } catch (error) {
  //     console.log("Upload error:", error?.response?.data || error.message);
  //     Alert.alert('Upload Error', error?.message || 'Something went wrong');
  //   }
  // };

  const handleFileUpload = async () => {
    if (
      !amount ||
      !remarks ||
      !value ||
      !global.xx_user_id ||
      !global.xx_emp_id
    ) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const advanceDate = moment(fromDate).format('DD-MMM-YY');

    // Log values directly instead of using FormData entries
    console.log('Submitting with:');
    console.log('AMOUNT:', amount);
    console.log('ADVANCE_DATE:', advanceDate);
    console.log('REMARKS:', remarks);
    console.log('CREATED_BY:', global.xx_user_id);
    console.log('BANK_ID:', value);
    console.log('EMP_ID:', global.xx_emp_id);

    const formData = new FormData();
    formData.append('AMOUNT', amount);
    formData.append('ADVANCE_DATE', advanceDate);
    formData.append('REMARKS', remarks);
    formData.append('CREATED_BY', global.xx_user_id);
    formData.append('BANK_ID', value);
    formData.append('EMP_ID', global.xx_emp_id);

    try {
      console.log('Calling API...');
      const response = await axios.post(
        `${BASEURL}/ords/api/salary/insert`,
        formData,
        {
          headers: {Accept: 'application/json'},
          timeout: 10000, // 10-second timeout
        },
      );

      console.log('API response:', response?.data);

      if (response?.data?.STATUS === 'SUCCESS') {
        Alert.alert('Success', 'Record added successfully!');
        // Refresh history after successful submission
        fetchLeaveRequests();
      } else {
        Alert.alert(
          'Failed',
          response?.data?.MESSAGE || 'Unknown error occurred',
        );
      }
    } catch (error) {
      console.log('Full error object:', error);

      if (error.response) {
        // Server responded with error status (4xx/5xx)
        console.log('Response data:', error.response.data);
        console.log('Status code:', error.response.status);
        Alert.alert(
          'Server Error',
          error.response.data?.MESSAGE || `Error ${error.response.status}`,
        );
      } else if (error.request) {
        // Request was made but no response received
        console.log('No response received:', error.request);
        Alert.alert('Network Error', 'No response from server');
      } else {
        // Other errors (e.g., timeout)
        console.log('Request error:', error.message);
        Alert.alert('Error', error.message || 'Request failed');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View>
            <View style={styles.containerdropdown}>
              <Text style={styles.heading}>Apply Advance Salary</Text>

              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.datePicker}>
                <Text>
                  Advance Date: {moment(fromDate).format('DD-MMM-YYYY')}
                </Text>
                <Icon
                  name="calendar"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
              </TouchableOpacity>

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

              {/* <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder=""
        value={value}
        onChange={(item) => {
        setValue(item.value);
        //  console.log('Selected item:', item);
        }}
      /> */}

              <TextInput
                style={styles.input}
                placeholder="Remarks"
                keyboardType="default"
                placeholderTextColor={'#888'}
                value={remarks}
                onChangeText={setRemrks}
              />

              {/* </View>  */}

              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                placeholderTextColor={'#888'}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                /// maxLength={15}
              />

              <View style={styles.uploadB}>
                <Pressable
                  style={styles.uploadButton}
                  onPress={() => {
                    handleFileUpload();
                    console.log('press');
                  }}>
                  <Text>Save</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.containerdropdown}>
              <Text style={styles.heading}>Request History</Text>

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : leavHistory && leavHistory.length > 0 ? (
                leavHistory.map(item => (
                  <View
                    style={styles.historyItem}
                    key={item.SAL_ADVANCE_ID.toString()}>
                    <Text style={styles.text}>
                      Requset #: {item.SAL_ADVANCE_NO}
                    </Text>
                    <Text style={styles.text}>
                      Requset Date: {formatDate(item.ADVANCE_DATE)}{' '}
                    </Text>
                    <Text style={styles.text}>Remarks: {item.REMARKS}</Text>
                    <Text style={styles.text}>
                      Amount :{formatAmount(item.AMOUNT)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No requests found</Text>
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

  containerdropdown: {
    margin: 10,
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    elevation: 5,
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
    marginTop: 20,
    alignItems: 'center',
  },

  chooseFileButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 5, // Add shadow for Android
  },

  chooseFileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  fileName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  historyItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 3,
  },
});

export default AdvanceSalary;
