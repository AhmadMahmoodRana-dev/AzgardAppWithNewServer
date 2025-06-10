
import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet,TouchableOpacity,TextInput,Alert,ActivityIndicator,ScrollView ,Button} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
///import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';

  const UpdateQualificationAdd = () => {

  const [qualification, setQualification] = useState('');
  const [year, setYear] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [grade, setGrade] = useState('');
  
  const [institute, setInstitute] = useState('');
   const [file, setFile] = useState(null);
  const [leavHistory, setLeavHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

  

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
      setLeavHistory(data.qualification_update);
    } catch (error) {
  //    Alert.alert('Error', 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };



  const handleFileUpload = async () => {

    const formData = new FormData();

    formData.append('QUALIFICATION',qualification);
    formData.append('YEAR',year);
    formData.append('EMP_ID',global.xx_emp_id);
    formData.append('CGPA', cgpa);
    formData.append('GRADE', grade);
    formData.append('INSTITUTE', institute);
    
 // console.log(formData);
    try {
        const response = await axios.post('http://hcm-azgard9.azgard9.com:8444/ords/api/Qualification/insert', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Update Qualification  successfully!');
        Alert.alert('Update Qualification  successfully!');
    } catch (error) {
        Alert.alert('Error uploading file: ' );
    }

};

  return (
    <SafeAreaProvider>
    <SafeAreaView>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View>
     
     
      <View style={styles.containerdropdown}>
      <Text style={styles.heading}>Update</Text>

      {/* </View>  */}

      <TextInput style={styles.input} placeholder="Qualification" 
        keyboardType="default" 
        value={qualification}
        onChangeText={setQualification}
        />
        

        <TextInput style={styles.input} placeholder="Year" 
        keyboardType="numeric" 
        value={year}
        onChangeText={setYear}
        />
        <TextInput style={styles.input} placeholder="CGPA" 
        keyboardType="numeric" 
        value={cgpa}
        onChangeText={setCgpa}
        />

 
        <TextInput style={styles.input} placeholder="Grade" 
        keyboardType="default" 
        value={grade}
        onChangeText={setGrade}
        />

        <TextInput style={styles.input} placeholder="Institute" 
        keyboardType="default" 
        value={institute}
        onChangeText={setInstitute}
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
                      <Text style={styles.heading}>Request History</Text>
                 
                  {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    leavHistory && leavHistory.length > 0 ? (
                      leavHistory.map((item) => (
                        <View style={styles.historyItem} key={item.EMP_DEGREE_ID.toString()}>
                        
                              <Text style={styles.text}>
                                      Emp No :{item.EMP_NO} Name: {item.EMP_NAME}
                                    </Text>
                                    <Text style={styles.text}>Card No: {item.CARD_ID}</Text>
                                    <Text style={styles.text}>
                                    Qualification: {item.QUALIFICATION}
                                    </Text>
                                    <Text style={styles.text}>
                                    Year: {item.YEAR}
                                    </Text>
                                    <Text style={styles.text}>
                                    CGPA: {item.CGPA}
                                    </Text>
                                    <Text style={styles.text}>
                                    Grade: {item.GRADE}
                                    </Text>
                                    <Text style={styles.text}>
                                    Institute: {item.INSTITUTE}
                                    </Text>
                            </View>
                      
                      ))
                    ) : (
                      <Text style={styles.emptyText}>No  requests found</Text>
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
   // marginTop: 20,
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
    //color: '#fff',
    //fontWeight: 'bold',
    //fontSize: 16,
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

export default UpdateQualificationAdd;
