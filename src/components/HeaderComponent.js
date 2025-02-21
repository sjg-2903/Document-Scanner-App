import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HeaderComponent = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>The Document Scanner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "90%",
    backgroundColor: "#007AFF",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  }
});

export default HeaderComponent;
