
import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet,TouchableOpacity,TextInput,Alert,ActivityIndicator,ScrollView ,Button} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome'; // Install this for icons
import moment from 'moment';

  const UpdateFamilyAdd = () => {
  const [fromDate, setFromDate] = useState(new Date());

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);


  const [relative, setRelative] = useState('');
  const [cnic, setCnic] = useState('');
  const [file, setFile] = useState(null);
  const [leavHistory, setLeavHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
  const formatCnic = (text) => {
    // Remove all non-numeric characters
    const cleanText = text.replace(/\D/g, '');
    // Format as 12345-1234567-1
    let formattedText = cleanText;
    if (cleanText.length > 5) {
      formattedText = `${cleanText.slice(0, 5)}-${cleanText.slice(5)}`;
    }
    if (cleanText.length > 12) {
      formattedText = `${cleanText.slice(0, 5)}-${cleanText.slice(5, 12)}-${cleanText.slice(12, 13)}`;
    }
    return formattedText;
  };

  const handleTextChange = (text) => {
    const formatted = formatCnic(text);
    setCnic(formatted);
  };




  const [value, setValue] = useState('1');
  const data = [
    { label: 'Brother', value: '1' },
    { label: 'Sister', value: '2' },
    { label: 'Daughter', value: '3' },
    { label: 'Son', value: '4' },
    { label: 'Father', value: '5' },
    { label: 'Wife', value: '6' },
    { label: 'Mother', value: '7' },
    
  ];





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
          `http://hcm-azgard9.azgard9.com:8444/ords/api/emp_update/get`
        );
        const data = await response.json();
        setLeavHistory(data.family_update);
      } catch (error) {
       // Alert.alert('Error', 'Failed to fetch leave requests');
      } finally {
        setLoading(false);
      }
    };
  





  // Handle file upload
  const handleFileUpload = async () => {
     
       

        //console.log(selectedFile); 
    const formData = new FormData();

    formData.append('DOB',moment(fromDate).format('DD-MMM-YY'));
    formData.append('EMP_ID',global.xx_emp_id);
    formData.append('EMP_RELATION', value);
    formData.append('RELATIVE_NAME', relative);
    formData.append('CNIC', cnic);
    

  console.log(formData);
    try {
        const response = await axios.post('http://hcm-azgard9.azgard9.com:8444/ords/api/family/insert', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Update Family Record');
        Alert.alert('Update Family Record');
    } catch (error) {
        Alert.alert('Error uploading file: ');
    }

};

  return (
    <SafeAreaProvider>
    <SafeAreaView>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View>
     
     
      <View style={styles.containerdropdown}>
      <Text style={styles.heading}>Update</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Leave Type"
        value={value}
        onChange={(item) => {
        setValue(item.value);
        //  console.log('Selected item:', item);
        }}
      />

        <TextInput style={styles.input} placeholder="Relative Name" 
        keyboardType="default" 
        value={relative}
        onChangeText={setRelative}
        />

      {/* </View>  */}
      <TouchableOpacity
          onPress={() => setShowFromDatePicker(true)}
          style={styles.datePicker}>
          <Text>DOB: {moment(fromDate).format('DD-MMM-YYYY')}</Text>
          <Icon name="calendar" size={20} color="#666" style={styles.icon}/>
         
        </TouchableOpacity>

       


        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'from')}
          />
        )}
        {showToDatePicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'to')}
          />
        )}
 
 <TextInput
        style={styles.input}
        placeholder="Enter CNIC"
        keyboardType="numeric"
        value={cnic}
        onChangeText={handleTextChange}
        maxLength={15} // CNIC has a max length of 15 characters including hyphens
      />


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

        <View style={styles.uploadB} >


        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text>Save</Text>
        </TouchableOpacity>
        </View>
       
      </View>
    
<View style={styles.containerdropdown}>
                      <Text style={styles.heading}>Family History</Text>
                 
                  {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    leavHistory && leavHistory.length > 0 ? (
                      leavHistory.map((item) => (
                        <View style={styles.historyItem} key={item.EMP_FAMILY_ID.toString()}>
                        
                             <Text style={styles.text}>
                                   Emp No :{item.EMP_NO} Name: {item.EMP_NAME}
                                 </Text>
                                 <Text style={styles.text}>Card No: {item.CARD_ID}</Text>
                                 <Text style={styles.text}>
                                 Relation: {item.EMP_RELATION}
                                 </Text>
                                 <Text style={styles.text}>
                                 Relative: {item.RELATIVE_NAME}
                                 </Text>
                                 <Text style={styles.text}>
                                 DOB: {formatDate(item.DOB)}
                                 </Text>
                                 <Text style={styles.text}>
                                 CNIC: {item.CNIC}
                                 </Text>
                            </View>
                      
                      ))
                    ) : (
                      <Text style={styles.emptyText}>No  Family Record found</Text>
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

dropdown: {
    width: '100%',
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
    elevation: 5,
    marginBottom:8,
    marginTop:8,
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
  //  marginTop: 20,
   // alignItems: 'center',
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
   // color: '#fff',
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
  


});

export default UpdateFamilyAdd;
