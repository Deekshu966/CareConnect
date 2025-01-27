import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/patientScreenComponents/Header';
import DateSelector from '../../components/patientScreenComponents/DateSelector';
import VoiceRecorder from '../../components/patientScreenComponents/VoiceRecorder';
import MessageInput from '../../components/patientScreenComponents/MessageInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../../components/patientScreenComponents/LogOutButton'


export default function PatientHomeScreen() {
    //const [patientName, setPatientName] = useState('');
    //const [patientId, setPatientId] = useState('');
    const [patientDetails, setPatientDetails] = useState('');
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchPatientDetails = async () => {

            // Instead of retrieving patientId from AsyncStorage, I have retriveved it from the patientDetails object
            // This is because the patientId is already stored in the patientDetails object when the patient logs in
            try {
                const storedDetails = await AsyncStorage.getItem('patientDetails');
                if (storedDetails) {
                    setPatientDetails(JSON.parse(storedDetails)); //convert the string back to an object
                    console.log('the nurse data is :', patientDetails);
                }
            } catch (error) {
                console.error('Error loading nurse details:', error);
            }
        };

        const loadRequestHistory = async () => {
            try {
                const storedRequests = await AsyncStorage.getItem('requestHistory');
                if (storedRequests) {
                    setRequests(JSON.parse(storedRequests));
                }
            } catch (error) {
                console.error("Error loading request history:", error);
            }
        };
        fetchPatientDetails();
        loadRequestHistory();
    }, []);

    const handleHistoryPress = () => {
        router.push('/(screens)/RequestHistoryScreen'); // Navigates to Request History Screen
    };

    const handleSendMessage = async (newRequest) => {
        try {
            const response = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequest),
            });
            if (!response.ok) {
                throw new Error('Failed to save the request to the database');
            }

            const updatedRequests = [newRequest, ...requests];
            setRequests(updatedRequests);

            await AsyncStorage.setItem('requestHistory', JSON.stringify(updatedRequests)); // Save to AsyncStorage
            console.log("Request saved : ", newRequest);
        }
        catch (error) {
            console.error("Error sending request to backend:", error);
            Alert.alert("Error", "Failed to send the request. Please try again.");
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Header
                patientName={patientDetails?.name || "Loading..."}
                patientId={patientDetails?.patientId || "Loading..."}
                onPress={handleHistoryPress}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <DateSelector />
                <VoiceRecorder />
                <MessageInput onSend={handleSendMessage} />
            </ScrollView>
            <LogoutButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
});