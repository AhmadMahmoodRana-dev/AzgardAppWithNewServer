import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import BASEURL from '../Constants/BaseUrl';

const HolidaysScreen = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${BASEURL}/ords/api/holidays/get`);
        setHolidays(response.data.gazeted_holidays); // Assuming the response is an array of holidays
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Unable to fetch holidays data');
      }
    };

    fetchHolidays();
  }, []);

  const renderHolidayItem = ({ item }) => {
    const formattedDate = moment(item.START_DATE).format('MMMM Do, YYYY'); // e.g., "January 1st, 2024"
    return (
      <View style={styles.holidayCard}>
        <Text style={styles.holidayText}>
          {item.EVENT_NAME}  Days: {item.NO_OF_DAYS}
        </Text>
        <Text style={styles.holidayDate}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/azgard_screen.jpg')} // Replace with your background image
      style={styles.backgroundImage}
      resizeMode="cover" // Ensures the image covers the screen
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <FlatList
            data={holidays}
            keyExtractor={(item) => item.GH_ID.toString()} // Assuming each holiday has a unique `id`
            renderItem={renderHolidayItem}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  holidayCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  holidayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  holidayDate: {
    fontSize: 14,
    color: '#666',
  },
  backgroundImage: {
    flex: 1,
  },
});

export default HolidaysScreen;
