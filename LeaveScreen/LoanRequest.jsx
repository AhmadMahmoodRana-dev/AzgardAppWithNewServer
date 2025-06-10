import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import numeral from 'numeral';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const LoanRequest = () => {
  const getCurrentMonthLastDay = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  };

  const [loanAmount, setLoanAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState(getCurrentMonthLastDay());
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [totalPayable, setTotalPayable] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [leavHistory, setLeavHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(new Date());

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const getLastDayOfMonth = date => {
    const tempDate = new Date(date);
    tempDate.setMonth(tempDate.getMonth() + 1, 0);
    return tempDate;
  };

  useEffect(() => {
    if (loanAmount && duration) {
      const principal = parseFloat(loanAmount);
      const months = parseInt(duration);

      if (!isNaN(principal) && months > 0) {
        const monthlyPayment = principal / months;

        setTotalPayable(principal.toFixed(2));
        setMonthlyInstallment(monthlyPayment.toFixed(2));
      } else {
        setTotalPayable('');
        setMonthlyInstallment('');
      }
    } else {
      setTotalPayable('');
      setMonthlyInstallment('');
    }
  }, [loanAmount, duration]);

  const formatAmount = amount => {
    return numeral(amount).format('0,0'); // Format number with commas
  };

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

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://hcm-azgard9.azgard9.com:8444/ords/api/adv/get?EMP_ID=${global.xx_emp_id}`,
      );
      const data = await response.json();
      setLeavHistory(data.loan);
    } catch (error) {
      ///  Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'from') {
      setShowFromDatePicker(false);
      if (selectedDate) {
        setFromDate(selectedDate);
      }
    }
  };

  const generateSchedule = () => {
    const principal = parseFloat(loanAmount);
    const months = parseInt(duration);

    if (!principal || !months || !fromDate || isNaN(months)) {
      Alert.alert(
        'Error',
        'Please fill out all fields correctly with valid numbers!',
      );
      return;
    }

    const monthlyPayment = principal / months;
    let date = new Date(fromDate);
    const paymentSchedule = [];
    let balance = principal;

    for (let i = 0; i < months; i++) {
      date = getLastDayOfMonth(date);
      balance -= monthlyPayment;

      paymentSchedule.push({
        month: `Month ${i + 1}`,
        dueDate: date.toISOString().split('T')[0],
        installment: monthlyPayment.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : '0.00',
      });

      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
    }

    setSchedule(paymentSchedule);
  };

  const sendLoanRequest = async () => {
    if (!loanAmount || !duration || !startDate) {
      Alert.alert('Error', 'Please Enter Loan Amount & Duration');
      return;
    }

    const requestData = {
      loanAmount: parseFloat(loanAmount),
      duration: parseInt(duration),
      fromDate,
      totalPayable,
      monthlyInstallment,
      EMP_ID: global.xx_emp_id,
      schedule,
    };

    try {
      const response = await axios.post(
        'http://hcm-azgard9.azgard9.com:8444/ords/api/add/insert',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        console.log('Response Data:', response.data);
        Alert.alert('Success', 'Loan submitted successfully!');
        setLoanAmount('');
        setDuration('');
      } else {
        Alert.alert(
          'Error',
          `Failed to submit loan request: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error('Error:', error.message);
      if (error.response) {
        Alert.alert(
          'Error',
          `Failed to submit loan request: ${
            error.response.data || error.response.statusText
          }`,
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Loan Amount"
              keyboardType="numeric"
              value={loanAmount}
              onChangeText={setLoanAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Loan Duration (months)"
              keyboardType="numeric"
              value={duration.toString()}
              onChangeText={value => {
                const parsedValue = parseInt(value);
                if (!isNaN(parsedValue) && parsedValue > 0) {
                  setDuration(parsedValue);
                } else if (value === '') {
                  setDuration('');
                }
              }}
            />
            {/* <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        keyboardType="default"
        value={startDate}
        onChangeText={setStartDate}
      /> */}

            <TouchableOpacity
              onPress={() => setShowFromDatePicker(true)}
              style={styles.datePicker}>
              <Text>Loan Date: {moment(fromDate).format('DD-MMM-YYYY')}</Text>
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
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Total Payable"
              value={totalPayable}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Monthly Installment"
              value={monthlyInstallment}
              editable={false}
            />
            {/* <View style={styles.buttonRow}> */}
            {/* <View style={styles.button}>
    <Text style={styles.buttonText} onPress={generateSchedule}>
      Generate Schedule
    </Text>
  </View> */}
            <View style={styles.button}>
              <Text style={styles.buttonText} onPress={sendLoanRequest}>
                Submit Loan Request
              </Text>
            </View>
            {/* </View> */}
            {schedule.length > 0 && (
              <ScrollView style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle}>Payment Schedule</Text>
                {schedule.map((item, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <Text>{item.month}</Text>
                    <Text>Due Date: {item.dueDate}</Text>
                    <Text>Installment: {item.installment}</Text>
                    <Text>Balance: {item.balance}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.containerdropdown}>
            <Text style={styles.heading}>Request History</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : leavHistory && leavHistory.length > 0 ? (
              leavHistory.map(item => (
                <View style={styles.historyItem} key={item.LOAN_ID.toString()}>
                  <Text style={styles.text}>Requset #: {item.LOAN_NO}</Text>
                  <Text style={styles.text}>
                    Requset Date: {formatDate(item.LOAN_START_DATE)}{' '}
                  </Text>
                  <Text style={styles.text}>
                    No Of Installment: {item.PER_MONTH_INSTALMENT}
                  </Text>
                  <Text style={styles.text}>
                    Amount :{formatAmount(item.LOAN_AMOUNT)}
                  </Text>
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.emptyText}>No requests found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    //backgroundColor: '#f9f9f9',
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    elevation: 5,
    margin: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#aaa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    maxHeight: 300,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scheduleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    margin: 10,
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 10,
    textAlign: 'center',
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
});

export default LoanRequest;
