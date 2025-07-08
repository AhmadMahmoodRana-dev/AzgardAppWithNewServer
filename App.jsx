import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import LeaveNavigation from './LeaveScreen/LeaveNavigation';
import CurentLocation from './screens/CurentLocation';
import Notification from './screens/Notification';

import PersonalInfo from './LeaveScreen/PersonalInfo';
import RequestType from './LeaveScreen/RequestType';
import CinicUpdateView from './LeaveScreen/CinicUpdateView';
import CinicUpdate from './LeaveScreen/CinicUpdate';
import UpdatePersonal from './LeaveScreen/UpdatePersonal';
import UpdatePersonalAdd from './LeaveScreen/UpdatePersonalAdd';
import UpdateQualification from './LeaveScreen/UpdateQualification';
import UpdateQualificationAdd from './LeaveScreen/UpdateQualificationAdd';
import UpdateFamily from './LeaveScreen/UpdateFamily';
import UpdateFamilyAdd from './LeaveScreen/UpdateFamilyAdd';
import RequisitionsType from './LeaveScreen/RequisitionsType';
import AdvanceSalaryView from './LeaveScreen/AdvanceSalaryView';
import AdvanceSalary from './LeaveScreen/AdvanceSalary';
import LoanRequestView from './LeaveScreen/LoanRequestView';
import LoanRequest from './LeaveScreen/LoanRequest';
import FacilityAssets from './LeaveScreen/FacilityAssets';
import HolidaysScreen from './LeaveScreen/HolidaysScreen';
import Profile from './LeaveScreen/Profile';
import LeaveApproval from './LeaveScreen/LeaveApproval';
import LeaveApprovalEntry from './LeaveScreen/LeaveApprovalEntry';
import PaySlipMonth from './LeaveScreen/PaySlipMonth';
import PaySlip from './LeaveScreen/PaySlip';
import AttendanceLog from './screens/AttendanceLog';

import React from 'react';
import {StyleSheet} from 'react-native';
import ShowLoanApprovalEntry from './ApprovalScreens/ShowLoanApprovalEntry';
import ShowAdvanceApprovalEntry from './ApprovalScreens/ShowAdvanceApprovalEntry';
import ShowOvertimeApprovalEntry from './ApprovalScreens/ShowOvertimeApprovalEntry';
import ShowVehicleApprovalEntry from './ApprovalScreens/ShowVehicleApprovalEntry';
import ShowLaptopApprovalEntry from './ApprovalScreens/ShowLaptopApprovalEntry';
import ShowSimApprovalEntry from './ApprovalScreens/ShowSimApprovalEntry';
import ShowSalaryChangesApprovalEntry from './ApprovalScreens/ShowSalaryChangesApprovalEntry';
import ShowTransferApprovalEntry from './ApprovalScreens/ShowTransferApprovalEntry';
import ShowProbationApprovalEntry from './ApprovalScreens/ShowProbationApprovalEntry';
import ShowInterviewAssesmentApprovalEntry from './ApprovalScreens/ShowInterviewAssesmentApprovalEntry';
import ShowAppraisalApprovalEntry from './ApprovalScreens/ShowAppraisalApprovalEntry';
import ShowTravellingApprovalEntry from './ApprovalScreens/ShowTravellingApprovalEntry';
import ShowBudgetApprovalEntry from './ApprovalScreens/ShowBudgetApprovalEntry';
import ShowTrailSlipApprovalEntry from './ApprovalScreens/ShowTrailSlipApprovalEntry';

const Stack = createStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home', headerLeft: () => null}}
        />

        <Stack.Screen
          name="Attenance"
          component={CurentLocation}
          options={{title: 'Attendance'}}
        />

        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfo}
          options={{title: 'Request To Update'}}
        />

        <Stack.Screen
          name="RequestType"
          component={RequestType}
          options={{title: 'Request Details'}}
        />

        <Stack.Screen
          name="LeaveNavigation"
          component={LeaveNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CinicUpdateView"
          component={CinicUpdateView}
          options={{title: 'Cnic Update Details'}}
        />

        <Stack.Screen
          name="CinicUpdate"
          component={CinicUpdate}
          options={{title: 'CNIC'}}
        />

        <Stack.Screen
          name="UpdatePersonal"
          component={UpdatePersonal}
          options={{title: 'Update Personal '}}
        />

        <Stack.Screen
          name="UpdatePersonalAdd"
          component={UpdatePersonalAdd}
          options={{title: 'Personal Information '}}
        />

        <Stack.Screen
          name="UpdateQualification"
          component={UpdateQualification}
          options={{title: 'Update Qualification'}}
        />

        <Stack.Screen
          name="UpdateQualificationAdd"
          component={UpdateQualificationAdd}
          options={{title: 'Qualification Info'}}
        />

        <Stack.Screen
          name="UpdateFamily"
          component={UpdateFamily}
          options={{title: 'Update Family'}}
        />

        <Stack.Screen
          name="UpdateFamilyAdd"
          component={UpdateFamilyAdd}
          options={{title: 'Family Information'}}
        />

        <Stack.Screen
          name="RequisitionsType"
          component={RequisitionsType}
          options={{title: 'Requisitions'}}
        />

        <Stack.Screen
          name="AdvanceSalaryView"
          component={AdvanceSalaryView}
          options={{title: 'Advance Salary View'}}
        />
        <Stack.Screen
          name="AdvanceSalary"
          component={AdvanceSalary}
          options={{title: 'Advance Salary'}}
        />

        <Stack.Screen
          name="LoanRequestView"
          component={LoanRequestView}
          options={{title: 'Loan Request'}}
        />

        <Stack.Screen
          name="LoanRequest"
          component={LoanRequest}
          options={{title: 'Loan Apply'}}
        />

        <Stack.Screen
          name="FacilityAssets"
          component={FacilityAssets}
          options={{title: 'Facility Assets'}}
        />

        <Stack.Screen
          name="HolidaysScreen"
          component={HolidaysScreen}
          options={{title: 'Gazetted Holidays'}}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{title: 'Profile'}}
        />

        <Stack.Screen
          name="LeaveApproval"
          component={LeaveApproval}
          options={{title: 'Approvals'}}
        />

        <Stack.Screen
          name="PaySlipMonth"
          component={PaySlipMonth}
          options={{title: 'View Payslips'}}
        />

        <Stack.Screen
          name="PaySlip"
          component={PaySlip}
          options={{title: 'Payslips'}}
        />

        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{title: 'Notification'}}
        />

        <Stack.Screen
          name="AttendanceLog"
          component={AttendanceLog}
          options={{title: 'Attendance Log'}}
        />

        <Stack.Screen
          name="LeaveApprovalEntry"
          component={LeaveApprovalEntry}
          options={{title: 'My Approvals'}}
        />
        <Stack.Screen
          name="ShowLoanApprovalEntry"
          component={ShowLoanApprovalEntry}
          options={{title: 'My Loan Approvals'}}
        />
        <Stack.Screen
          name="ShowAdvanceApprovalEntry"
          component={ShowAdvanceApprovalEntry}
          options={{title: 'My Advance Approvals'}}
        />
        <Stack.Screen
          name="ShowOvertimeApprovalEntry"
          component={ShowOvertimeApprovalEntry}
          options={{title: 'My Overtime Approvals'}}
        />
        <Stack.Screen
          name="ShowVehicleApprovalEntry"
          component={ShowVehicleApprovalEntry}
          options={{title: 'My Vehicle Approvals'}}
        />
        <Stack.Screen
          name="ShowLaptopApprovalEntry"
          component={ShowLaptopApprovalEntry}
          options={{title: 'My Laptop Approvals'}}
        />
        <Stack.Screen
          name="ShowSimApprovalEntry"
          component={ShowSimApprovalEntry}
          options={{title: 'My Sim Approvals'}}
        />
        <Stack.Screen
          name="ShowSalaryChangesApprovalEntry"
          component={ShowSalaryChangesApprovalEntry}
          options={{title: 'My Promotion/Salary Approvals'}}
        />
        <Stack.Screen
          name="ShowTransferApprovalEntry"
          component={ShowTransferApprovalEntry}
          options={{title: 'My Transfer Approvals'}}
        />
        <Stack.Screen
          name="ShowProbationApprovalEntry"
          component={ShowProbationApprovalEntry}
          options={{title: 'My Probation Approvals'}}
        />
        <Stack.Screen
          name="ShowInterviewAssesmentApprovalEntry"
          component={ShowInterviewAssesmentApprovalEntry}
          options={{title: 'My Interview Approvals'}}
        />
        <Stack.Screen
          name="ShowAppraisalApprovalEntry"
          component={ShowAppraisalApprovalEntry}
          options={{title: 'My Appraisal Approvals'}}
        />
        <Stack.Screen
          name="ShowTravellingApprovalEntry"
          component={ShowTravellingApprovalEntry}
          options={{title: 'My Travelling Approvals'}}
        />
        <Stack.Screen
          name="ShowBudgetApprovalEntry"
          component={ShowBudgetApprovalEntry}
          options={{title: 'My Budget Approvals'}}
        />
        <Stack.Screen
          name="ShowTrailSlipApprovalEntry"
          component={ShowTrailSlipApprovalEntry}
          options={{title: 'My Trail Slip Approvals'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
