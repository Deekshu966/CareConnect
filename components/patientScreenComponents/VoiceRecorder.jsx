import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function VoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // Add actual recording logic here
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
};

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

