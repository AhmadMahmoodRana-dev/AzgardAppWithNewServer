import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LeaveRequest from '../screens/LeaveRequest';
import LeaveType from  '../screens/LeaveType'; 
import AnnualLeaveScreen from '../screens/AnnualLeaveScreen';

import LeaveApprovalEntry from  '../LeaveScreen/LeaveApprovalEntry';
import CasualLeave  from   '../LeaveScreen/CasualLeave';
import SickLeave    from    '../LeaveScreen/SickLeave';
import MaternityLeave from   '../LeaveScreen/MaternityLeave';
import PaternityLeave from   '../LeaveScreen/PaternityLeave';
import LeaveWithoutPay from  '../LeaveScreen/LeaveWithoutPay';
import SpecialLeave    from   '../LeaveScreen/SpecialLeave';
import ShortleaveView   from    '../LeaveScreen/ShortleaveView';
import ShortLeaveForm  from   '../LeaveScreen/ShortLeaveForm';
import OutdoorDutyView from   '../LeaveScreen/OutdoorDutyView';
import OutdoorDutyEntry from   '../LeaveScreen/OutdoorDutyEntry';
import SalarySlip       from    '../LeaveScreen/SalarySlip';

const Stack = createNativeStackNavigator();

const LeaveNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="LeaveRequest">

      <Stack.Screen
        name="LeaveRequest"
        component={LeaveRequest}
        options={{ title: 'Leave Request' }}
      />


      <Stack.Screen
        name="LeaveType"
        component={LeaveType}
        options={{ title: 'Leave Type' }}
      />
      <Stack.Screen
        name="AnnualLeave"
        component={AnnualLeaveScreen}
        options={{ title: 'Annual Leave' }}
      />
     
     {/* <Stack.Screen name="LeaveApproval" 
component={LeaveApproval} 
options={{ title: 'Approvals'}}   /> */}

 {/* <Stack.Screen name="LeaveApprovalEntry" 
component={LeaveApprovalEntry} 
options={{ title: 'My Approvals'}}   /> */}

<Stack.Screen name="SalarySlip" 
component={SalarySlip} 
options={{ title: 'Pay Slips'}}   />



<Stack.Screen name="CasualLeave" 
component={CasualLeave} 
options={{ title: 'Casual Leave'}}   />

<Stack.Screen name="SickLeave" 
component={SickLeave} 
options={{ title: 'Sick Leave'}}   />

<Stack.Screen name="MaternityLeave" 
component={MaternityLeave} 
options={{ title: 'Maternity Leave'}}   />

<Stack.Screen name="PaternityLeave" 
component={PaternityLeave} 
options={{ title: 'Paternity Leave'}}   />

<Stack.Screen name="LeaveWithoutPay" 
component={LeaveWithoutPay} 
options={{ title: 'Leave Without Pay'}}   />

<Stack.Screen name="SpecialLeave" 
component={SpecialLeave} 
options={{ title: 'Special Leave'}}   />

<Stack.Screen name="ShortleaveView" 
   component={ShortleaveView} 
options={{ title: 'Short Leave'}}   />

<Stack.Screen name="ShortLeaveForm" 
   component={ShortLeaveForm} 
options={{ title: 'Short Leave Entry'}}   />

<Stack.Screen name="OutdoorDutyView" 
   component={OutdoorDutyView} 
options={{ title: 'Outdoor Duty'}}   />

<Stack.Screen name="OutdoorDutyEntry" 
   component={OutdoorDutyEntry} 
options={{ title: 'Outdoor Duty Entry'}}   />



</Stack.Navigator>
  );
};

export default LeaveNavigation;
