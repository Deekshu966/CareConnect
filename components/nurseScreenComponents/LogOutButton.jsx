import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutButton() {
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },

            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        // remove the token from local storage so that nurse have to login again with credentials
                        await AsyncStorage.removeItem('nursetoken');
                        router.push('/');
                        console.log('Logged out and navigating to Login screen');
                    } catch (error) {
                        console.error('Error logging out:', error);
                        Alert.alert('Error', 'Failed to logout. Please try again.');
                    }
                }
            },],
            //to make the alert non-dismissable by tapping outside the alert box
            { cancelable: false },
        );
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#006400" />
            <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 10,
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
        color: '#006400',
        fontWeight: '500',
    },
});

