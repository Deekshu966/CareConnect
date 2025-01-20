import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RequestHistoryScreen = () => {
    const router = useRouter();
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Fetch from the database
                const response = await fetch('http://localhost:5000/api/requests');
                const requests = await response.json();
                setFilteredRequests(requests);

                // Save fetched requests to AsyncStorage
                await AsyncStorage.setItem('requestHistory', JSON.stringify(requests));
            } catch (error) {
                console.error("Error fetching requests:", error);
                Alert.alert("Error", "Failed to load request history.");
            }
        };
        fetchRequests();
    }, []);

    const deleteRequest = async (idToDelete) => {
        try {
            // Delete from the database
            const response = await fetch(`http://localhost:5000/api/requests/${idToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the request from the database');
            }

            // Update local state and AsyncStorage
            const updatedRequests = filteredRequests.filter(item => item._id !== idToDelete);
            setFilteredRequests(updatedRequests);
            await AsyncStorage.setItem('requestHistory', JSON.stringify(updatedRequests));
        } catch (error) {
            console.error("Error deleting the request:", error);
            Alert.alert("Error", "Failed to delete the request. Please try again.");
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.requestBox}>
            <View style={styles.requestContent}>
                <Text style={styles.requestText}>{item.request}</Text>
                <View style={styles.timeContainer}>
                    <Icon name="clock-o" size={14} color="#000" style={{ marginRight: 5 }} />
                    <Text style={styles.timeText}>{`${item.time}   ${item.date}`}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => deleteRequest(item._id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Icon name="chevron-left" size={20} color="#007E7E" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.heading}>Request History</Text>

            <FlatList
                data={filteredRequests}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    backText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#007E7E',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#000',
    },
    requestBox: {
        backgroundColor: '#DDF3F3',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 40,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    requestContent: {
        flex: 1,
        marginRight: 10,
    },
    requestText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    timeText: {
        fontSize: 14,
        color: '#333',
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default RequestHistoryScreen;
