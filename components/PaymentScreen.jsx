import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PaymentScreen = () => {
  const [selectedPayment, setSelectedPayment] = useState("Paytm");

  const paymentMethods = [
    { label: "Google Pay", value: "Google Pay", icon: "google" },
    { label: "Paytm", value: "Paytm", icon: "wallet" },
    { label: "PhonePe", value: "PhonePe", icon: "credit-card" },
    { label: "UPI", value: "UPI", icon: "bank" },
    { label: "Wallet Balance", value: "Wallet Balance", icon: "cash" },
    { label: "Cash", value: "Cash", icon: "currency-inr" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Select Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.value}
          style={styles.option}
          onPress={() => setSelectedPayment(method.value)}
        >
          <Icon name={method.icon} size={24} color="black" style={styles.icon} />
          <Text style={styles.optionText}>{method.label}</Text>
          <RadioButton
            value={method.value}
            status={selectedPayment === method.value ? "checked" : "unchecked"}
            onPress={() => setSelectedPayment(method.value)}
          />
        </TouchableOpacity>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>50 Rs</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => alert(`Payment confirmed with ${selectedPayment}`)}
        style={styles.payButton}
      >
        Confirm and Pay
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D3D3D3",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  payButton: {
    marginTop: 10,
    backgroundColor: "#5A5A5A",
    padding: 10,
  },
});

export default PaymentScreen;
