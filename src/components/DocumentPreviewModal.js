import React, { useState } from "react";
import { Modal, View, Image, TouchableOpacity, Text, StyleSheet, Alert, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import ExtractedTextModal from "./ExtractedTextModel";

const DocumentPreviewModal = ({ visible, onClose, document, onDelete }) => {
    const [extractedText, setExtractedText] = useState("");
    const [textModalVisible, setTextModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    if (!document) return null;

    const shareAsImage = async () => {
        try {
            await Share.open({ url: document, type: "image/jpeg" });
        } catch (error) {
            Alert.alert("Share Canceled", error.message);
        }
    };

    const shareAsPDF = async () => {
        try {
            const pdfOptions = {
                html: `<img src="${document}" style="width:100%;height:auto;"/>`,
                fileName: "scanned_document",
                directory: "Documents",
            };
            const file = await RNHTMLtoPDF.convert(pdfOptions);
            await Share.open({ url: `file://${file.filePath}`, type: "application/pdf" });
        } catch (error) {
            Alert.alert("PDF Share Error", error.message);
        }
    };

    const extractText = async () => {
        try {
            const result = await TextRecognition.recognize(document);
            setExtractedText(result.text || "No text found");
            setTextModalVisible(true);
        } catch (error) {
            Alert.alert("Text Extraction Error", error.message);
        }
    };


    const confirmDelete = () => {
        Alert.alert("Delete Document", "Are you sure you want to delete this document?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => { onDelete(document); onClose(); }, style: "destructive" }
        ]);
    };

    const options = [
        { id: "1", title: "Preview", icon: "image", action: () => setPreviewVisible(true) },
        { id: "2", title: "Share as Image", icon: "share-outline", action: shareAsImage },
        { id: "3", title: "Share as PDF", icon: "file-pdf-box", action: shareAsPDF },
        { id: "4", title: "Extract Text", icon: "text-box-search-outline", action: extractText },
        { id: "5", title: "Delete", action: confirmDelete, icon: "delete" },
        { id: "6", title: "Close", icon: "close", action: onClose },
    ];

    const renderItem = ({ item }) => (
        <>
            <TouchableOpacity style={styles.listItem} onPress={item.action}>
                <Icon name={item.icon} size={24} color="#333" style={styles.icon} />
                <Text style={styles.listText}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
        </>
    );

    return (
        <>
            <Modal visible={visible} transparent={true} animationType="slide">
                <View style={styles.overlay} onTouchEnd={onClose} />
                <View style={styles.bottomSheet}>
                    <FlatList
                        data={options}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            </Modal>
            <Modal visible={previewVisible} transparent={true} animationType="fade">
                <View style={styles.previewContainer}>
                    <Image source={{ uri: document }} style={styles.fullPreviewImage} />
                    <TouchableOpacity style={styles.closePreviewButton} onPress={() => setPreviewVisible(false)}>
                        <TouchableOpacity style={styles.closePreviewButton} onPress={() => setPreviewVisible(false)}>
                            <Icon name="close" size={30} color="#fff" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </Modal>
            <ExtractedTextModal
                visible={textModalVisible}
                text={extractedText}
                onClose={() => setTextModalVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    bottomSheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    listContainer: {
        width: "100%",
        paddingVertical: 10,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    listText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "left",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginHorizontal: 20,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    fullPreviewImage: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
    },
    closePreviewButton: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 20,
        padding: 10,
    },
    closeText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
    },
    icon: {
        marginRight: 10,
    },
});

export default DocumentPreviewModal;
