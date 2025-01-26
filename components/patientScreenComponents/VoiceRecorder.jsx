import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        // Check if permission was previously granted
        const checkPermissionStatus = async () => {
            const granted = await AsyncStorage.getItem('audioPermissionGranted');
            if (granted === 'true') {
                setPermissionGranted(true);
            }
        };
        checkPermissionStatus();
    }, []);

    const requestPermission = async () => {
        try {
            if (!permissionGranted) {
                const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
                if (status === 'granted') {
                    await AsyncStorage.setItem('audioPermissionGranted', 'true');
                    setPermissionGranted(true);
                    return true;
                } else {
                    Alert.alert(
                        'Permission Required',
                        'This app requires microphone access to record voice. Please enable it in your settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Open Settings',
                                onPress: () => Permissions.openSettings(),
                            },
                        ]
                    );
                    return false;
                }
            }
            return true; // Permission already granted
        } catch (error) {
            console.error('Error requesting microphone permissions:', error);
            return false;
        }
    };

    const toggleRecording = async () => {
        const hasPermission = await requestPermission();
        if (hasPermission) {
            setIsRecording(!isRecording);
            // Add actual recording logic here
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How may I assist you today?</Text>
            <TouchableOpacity
                style={styles.recordButton}
                onPress={toggleRecording}
            >
                <MaterialIcons
                    name="mic"
                    size={50}
                    color={isRecording ? '#ff4444' : '#fff'}
                />
            </TouchableOpacity>
            <Text style={styles.helpText}>Tap to start recording</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 30,
        color: '#333',
    },
    recordButton: {
        width: 120,
        height: 120,
        borderRadius: 80,
        backgroundColor: '#008B8B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    helpText: {
        marginTop: 15,
        color: '#666',
        fontSize: 16,
    },
});
