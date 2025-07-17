import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";

const PayslipScreen = ({ route }) => {
  const [payslipData, setPayslipData] = useState(null);
  const { period_id } = route.params;

  // Fetch data from API
  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const {data} = await axios.get(`https://erp.visionplusapps.com:8081/ords/api/pay/get?period_id=${period_id}&EMP_id=${global.xx_emp_id}`);
        setPayslipData(data);
      } catch (error) {
        console.error("Error fetching payslip data:", error);
        setPayslipData(null); // Ensure payslipData is null if there's an error
      }
    };
    
    fetchPayslip();
  }, [period_id]);
  
  console.log(payslipData,"payslipDatapayslipData");

  // Format numbers with commas
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // If data is still loading
  if (!payslipData) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If no data is found
  if (payslipData.status != "200" ) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Payslip not generated</Text>
      </View>
    );
  }

  

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Payslip for the Month of {payslipData?.data?.period_details[0]?.SALARYPERIOD}</Text>

      {/* Employee Details */}
      <View style={styles.employeeDetails}>
        <View>
          <View style={styles.tags}>
            <Text style={styles.employeeId}>{payslipData?.data?.employee[0]?.ID}</Text>
            <Text style={[styles.tag, styles.location]}>{payslipData?.data?.employee[0]?.LOCATION}</Text>
            <Text style={[styles.tag, styles.department]}>{payslipData?.data?.employee[0]?.DEPARTMENT}</Text>
          </View>
          <Text style={styles.employeeName}>{payslipData?.data?.employee[0]?.NAME}</Text>
          <Text style={styles.employeeDesignation}>{payslipData?.data?.employee[0]?.DESIGNATION}</Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatAmount(payslipData?.data?.totals[0]?.TOTALEARNINGS)}</Text>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatAmount(payslipData?.data?.totals[0]?.TOTALDEDUCTIONS)}</Text>
          <Text style={styles.summaryLabel}>Total Deductions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatAmount(payslipData?.data?.totals[0]?.NETPAY)}</Text>
          <Text style={styles.summaryLabel}>Netpay</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{payslipData?.data?.period_details[0]?.SALARYPERIOD}</Text>
          <Text style={styles.summaryLabel}>Salary Month</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{payslipData?.data?.employee[0]?.MODE_OF_PAYMENT == "null" ? "N/A" : ""}</Text>
          <Text style={styles.summaryLabel}>Mode Of Payment</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{payslipData?.data?.period_details[0]?.CURRENCY}</Text>
          <Text style={styles.summaryLabel}>Currency</Text>
        </View>
      </View>

      {/* Earnings and Deductions */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsColumn}>
          <Text style={styles.detailsHeader}>Earnings</Text>
          {payslipData?.data?.earnings.map((item, index) => (
            <View style={styles.detailsRow} key={index}>
              <Text style={styles.detailsLabel}>{item.LABEL}</Text>
              <Text style={styles.detailsValue}>{formatAmount(item.AMOUNT)}</Text>
            </View>
          ))}
          <View style={styles.detailsRow}>
            <Text style={styles.detailsValue}>Total Earnings</Text>
            <Text style={styles.detailsValue}>{formatAmount(payslipData?.data?.totals[0]?.TOTALEARNINGS)}</Text>
          </View>
        </View>

        <View style={styles.detailsColumn}>
          <Text style={styles.detailsHeader}>Deductions</Text>
          {payslipData?.data?.deductions.map((item, index) => (
            <View style={styles.detailsRow} key={index}>
              <Text style={styles.detailsLabel}>{item.LABEL}</Text>
              <Text style={styles.detailsValue}>{formatAmount(item.AMOUNT)}</Text>
            </View>
          ))}
          <View style={styles.detailsRow}>
            <Text style={styles.detailsValue}>Total Deductions</Text>
            <Text style={styles.detailsValue}>{formatAmount(payslipData?.data?.totals[0]?.TOTALDEDUCTIONS)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  employeeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  employeeId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginRight: 70,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  employeeDesignation: {
    fontSize: 14,
    color: "#666",
  },
  tags: {
    flexDirection: "row",
  },
  tag: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  location: {
    backgroundColor: "#17a2b8",
  },
  department: {
    backgroundColor: "#ffc107",
  },
  summary: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "30%",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsColumn: {
    width: "48%",
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 14,
    color: "#555",
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#dc3545", // Red color for emphasis
  },
});