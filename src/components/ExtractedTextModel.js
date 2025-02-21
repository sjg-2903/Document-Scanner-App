import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import Icon from "react-native-vector-icons/Ionicons";

const ExtractedTextModal = ({ visible, text, onClose }) => {
  const copyToClipboard = () => {
    Clipboard.setString(text);
    Alert.alert("Text Copied","Extracted text copied to clipboard!");
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Extracted Text</Text>
          <View style={styles.textContainer}>
            <Text style={styles.extractedText}>{text || "No text found"}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Icon name="copy-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  textContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    minHeight: 80,
    justifyContent: "center",
  },
  extractedText: {
    fontSize: 16,
    color: "#212529",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  copyButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  closeButton: {
    flexDirection: "row",
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ExtractedTextModal;
