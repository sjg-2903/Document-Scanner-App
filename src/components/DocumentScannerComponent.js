import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, Alert, StyleSheet, Modal, ScrollView } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import DocumentPreviewModal from "./DocumentPreviewModal";
import Icon from "react-native-vector-icons/Ionicons";

const DocumentScannerComponent = () => {
  const [scannedDocuments, setScannedDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedDocsModalVisible, setSavedDocsModalVisible] = useState(false);

  useEffect(() => {
    loadScannedDocuments();
  }, []);

  const loadScannedDocuments = async () => {
    const savedDocs = await AsyncStorage.getItem("scannedDocuments");
    if (savedDocs) setScannedDocuments(JSON.parse(savedDocs));
  };

  const saveDocument = async (imageUri) => {
    const newDocuments = [...scannedDocuments, imageUri];
    setScannedDocuments(newDocuments);
    await AsyncStorage.setItem("scannedDocuments", JSON.stringify(newDocuments));
  };

  const scanDocument = async () => {
    const hasPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    if (hasPermission !== RESULTS.GRANTED) {
      Alert.alert("Permission Denied", "Camera access is required to scan documents.");
      return;
    }

    const { scannedImages } = await DocumentScanner.scanDocument();
    if (scannedImages && scannedImages.length > 0) {
      const newDocument = scannedImages[0];
      await saveDocument(newDocument);
      setSavedDocsModalVisible(true);  
    }
  };


  const deleteDocument = async (imageUri) => {
    const updatedDocuments = scannedDocuments.filter(doc => doc !== imageUri);
    setScannedDocuments(updatedDocuments);
    await AsyncStorage.setItem("scannedDocuments", JSON.stringify(updatedDocuments));
  };

  return (
    <View style={styles.container}>

      <View style={styles.instructionBox}>
        <Text style={styles.welcomeText}>Welcome To Document Scanner App</Text>
        <Text style={styles.instructionText}>1. To scan a new document, click on the 'Scan Document' button.</Text>
        <Text style={styles.instructionText}>2. To view your saved documents, click on 'Saved Documents'.</Text>
        <Text style={styles.instructionText}>3. To manage a document, tap on it and select the desired option.</Text>
        <Text style={styles.conclusionText}>Enjoy seamless document scanning and management!</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={scanDocument}>
        <Icon name="camera-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}> Scan Document</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.savedButton} onPress={() => setSavedDocsModalVisible(true)}>
        <Icon name="folder-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}> Saved Documents</Text>
      </TouchableOpacity>

      <DocumentPreviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        document={selectedDocument}
        onDelete={deleteDocument}
      />

      <Modal visible={savedDocsModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Saved Documents</Text>

          <FlatList
            data={scannedDocuments}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer} 
            showsVerticalScrollIndicator={false} 
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.documentItem}
                onPress={() => { setSelectedDocument(item); setModalVisible(true); }}
                onLongPress={() => {
                  Alert.alert("Delete Document", "Are you sure you want to delete this document?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", onPress: () => deleteDocument(item), style: "destructive" }
                  ]);
                }}
              >
                <Image source={{ uri: item }} style={styles.thumbnail} />
                <Text style={styles.documentText}>Document {scannedDocuments.indexOf(item) + 1}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setSavedDocsModalVisible(false)}>
            <Icon name="close-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}> Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    paddingTop: 20
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    width: 360,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10
  },
  instructionBox: {
    backgroundColor: "#E9ECEF",
    padding: 15,
    borderRadius: 10,
    width: 360,
    marginBottom: 15,
    alignItems: "center"
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 5
  },
  instructionText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3
  },
  conclusionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28A745",
    marginTop: 5
  },
  savedButton: {
    flexDirection: "row",
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    width: 360,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9ECEF",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: 360
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10
  },
  documentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 20
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 15
  },
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: "center"
  },
  savedDocContainer: {
    alignItems: "center",
    marginBottom: 20
  },
  fullImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
    resizeMode: "contain"
  },
  docNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 5
  },
  noDocsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 20
  },
  closeButton: {
    flexDirection: "row",
    backgroundColor: "#FF5733",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 360
  }
});

export default DocumentScannerComponent;
