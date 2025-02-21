import React from "react";
import { View, StyleSheet } from "react-native";
import HeaderComponent from "./components/HeaderComponent";
import DocumentScannerComponent from "./components/DocumentScannerComponent";

const Main = () => {
  return (
    <View style={styles.container}>
      <HeaderComponent />
      <DocumentScannerComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    paddingTop: 20
  }
});

export default Main;
