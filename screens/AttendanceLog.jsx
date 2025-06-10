import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const getTimeTextColor = status => {
  switch (status) {
    case 'P':
      return {color: '#4CAF50'};
    case 'A':
      return {color: '#FF5722'};
    case 'H':
      return {color: '#9E9E9E'};
    case 'S':
      return {color: '#FFC107'};
    case 'R':
      return {color: '#607D8B'};
    default:
      return {color: '#83b9cf'};
  }
};

const getBorderColor = status => {
  switch (status) {
    case 'P':
      return {borderLeftColor: '#4CAF50'};
    case 'A':
      return {borderLeftColor: '#FF5722'};
    case 'H':
      return {borderLeftColor: '#9E9E9E'};
    case 'S':
      return {borderLeftColor: '#FFC107'};
    case 'R':
      return {borderLeftColor: '#607D8B'};
    default:
      return {borderLeftColor: '#83b9cf'};
  }
};

export default function AttendanceLog() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(false);
  const [empId, setEmpId] = useState(null); // Store emp_id

  useEffect(() => {
    getEmpIdAndFetchAttendance();
  }, []);

  const getEmpIdAndFetchAttendance = async () => {
    try {
      const userData = await AsyncStorage.getItem('username');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const emp_id = parsedData?.emp_id; // Extract emp_id
        if (emp_id) {
          setEmpId(emp_id); // Save in state (optional)
          fetchAttendanceData(emp_id); // Use emp_id directly
        }
      }
    } catch (error) {
      console.error('Error fetching emp_id:', error);
    }
  };

  const fetchAttendanceData = useCallback(async emp_id => {
    setLoading(true);
    try {
      const API_URL = `http://hcm-azgard9.azgard9.com:8444/ords/api/Attendance_history_json_LONG_LAT/get?EMP_ID=${emp_id}`;
      console.log('Fetching attendance for EMP_ID:', emp_id);
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.status === '200') {
        const monthKeys = Object.keys(data).filter(
          key => key !== 'status' && key !== 'message',
        );

        console.log('Month keys:', monthKeys);
        console.log('Raw API Data:', data);

        setMonths(monthKeys);
        setAttendanceData(data); // Use the data directly without cleaning
        if (monthKeys.length > 0) {
          setSelectedMonth(monthKeys[0]);
        }
      } else {
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMonthChange = month => {
    if (selectedMonth !== month) {
      setMonthLoading(true);
      setTimeout(() => {
        setSelectedMonth(month);
        setMonthLoading(false);
      }, 300);
    }
  };

  const filteredData = useMemo(
    () => attendanceData[selectedMonth] || [],
    [attendanceData, selectedMonth],
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Attendance...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Month Filter */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthFilter}>
          {months.map(month => (
            <TouchableOpacity
              key={month}
              onPress={() => handleMonthChange(month)}
              style={[
                styles.monthButton,
                selectedMonth === month && styles.selectedMonth,
              ]}>
              <Text
                style={[
                  styles.monthText,
                  selectedMonth === month && styles.selectedMonthText,
                ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Attendance List */}
      <View style={{marginHorizontal: 10}}>
        {monthLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="#007BFF" />
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.date}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 60,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    {item.location_desc}
                  </Text>
                </View>

                <View style={[styles.card, getBorderColor(item.status)]}>
                  <View style={[styles.left, getBorderColor(item.status)]}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text style={{color: 'gray'}}>{item.day}</Text>
                  </View>
                  <View style={styles.details}>
                    <Text
                      style={[styles.timeText, getTimeTextColor(item.status)]}>
                      {item.time}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.statusText,
                          getTimeTextColor(item.status),
                        ]}>
                        {item.status === 'P'
                          ? 'Present'
                          : item.status === 'A'
                          ? 'Absent'
                          : item.status === 'H'
                          ? 'Holiday'
                          : item.status === 'S'
                          ? 'Short Leave'
                          : item.status === 'R'
                          ? 'Week Off'
                          : 'Unknown'}
                      </Text>
                      {item.duration && (
                        <Text style={styles.durationText}>
                          {' '}
                          {item.duration}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterWrapper: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  monthFilter: {
    flexDirection: 'row',
  },
  monthButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  selectedMonth: {
    borderBottomColor: '#83b9cf',
    borderBottomWidth: 3,
  },
  monthText: {
    color: 'gray',
    fontSize: 14,
  },
  selectedMonthText: {
    color: '#83b9cf',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#E0E0E0',
    width: '80%',
    elevation: 5,
  },
  dateText: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#83b9cf',
    fontSize: width * 0.04,
  },
  statusText: {
    color: 'gray',
    fontSize: width * 0.04,
  },
  durationText: {
    color: 'gray',
    fontSize: width * 0.04,
  },
  summaryButton: {
    borderColor: 'lightGray',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 10,
    width: '29%',
  },
  left: {
    borderLeftWidth: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    borderColor: 'gray',
    borderLeftWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
