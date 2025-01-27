import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function VoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingPermission, setRecordingPermission] = useState(false);
    const [recordingTime, setRecordingTime] = useState('00:00');
    const [recordings, setRecordings] = useState([]);

    const recording = useRef(null);
    const recordingTimeInterval = useRef(null);

    // Define recording options outside component to avoid recreation
    const recordingOptions = {
        android: {
            extension: '.mp4',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    };

    useEffect(() => {
        setupPermissions();
        loadRecordings();

        return () => {
            if (recording.current) {
                stopRecording();
            }
            if (recordingTimeInterval.current) {
                clearInterval(recordingTimeInterval.current);
            }
        };
    }, []);

    const setupPermissions = async () => {
        try {
            const recordingStatus = await Audio.requestPermissionsAsync();
            setRecordingPermission(recordingStatus.status === 'granted');

            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
            });
        } catch (error) {
            console.error('Error setting up permissions:', error);
            Alert.alert('Permission Error', 'Failed to set up microphone permission');
        }
    };

    const startRecording = async () => {
        try {
            if (!recordingPermission) {
                Alert.alert('Permission Required', 'Please grant microphone permission');
                return;
            }

            recording.current = new Audio.Recording();

            await recording.current.prepareToRecordAsync(recordingOptions);
            await recording.current.startAsync();
            setIsRecording(true);

            let timeElapsed = 0;
            recordingTimeInterval.current = setInterval(() => {
                timeElapsed += 1;
                const minutes = Math.floor(timeElapsed / 60);
                const seconds = timeElapsed % 60;
                setRecordingTime(
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }, 1000);

        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        try {
            if (!recording.current) return;

            await recording.current.stopAndUnloadAsync();
            clearInterval(recordingTimeInterval.current);

            const uri = recording.current.getURI(); // Get the URI of the recorded audio

            // Define a new path to save the audio file
            const newFilePath = `${FileSystem.documentDirectory}recordings/${Date.now()}.m4a`;
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}recordings`, { intermediates: true });
            await FileSystem.moveAsync({
                from: uri,
                to: newFilePath,
            });

            const newRecording = {
                id: Date.now().toString(),
                uri: newFilePath, // Update the URI to the new file path
                duration: recordingTime,
                timestamp: new Date().toISOString(),
            };

            const updatedRecordings = [...recordings, newRecording];
            setRecordings(updatedRecordings);
            await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));

            recording.current = null;
            setIsRecording(false);
            setRecordingTime('00:00');

        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Error', 'Failed to stop recording');
        }
    };

    const loadRecordings = async () => {
        try {
            const savedRecordings = await AsyncStorage.getItem('recordings');
            if (savedRecordings) {
                setRecordings(JSON.parse(savedRecordings));
            }
        } catch (error) {
            console.error('Error loading recordings:', error);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // This function is working but not responding on play button press
    const playRecording = async (uri) => {
        try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync({ uri });
            await soundObject.playAsync();
            console.log('Playing recording:', uri);
        } catch (error) {
            console.error('Failed to play recording:', error);
            Alert.alert('Error', 'Failed to play recording');
        }
    };

    // This function can be useful while sharing audio recordings.
    const shareRecording = async (uri) => {
        try {
            const result = await Sharing.shareAsync(uri);
            if (result.status === 'success') {
                Alert.alert('Success', 'Recording shared successfully');
            }
        } catch (error) {
            console.error('Error sharing recording:', error);
            Alert.alert('Error', 'Failed to share recording');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voice Recorder</Text>
            <Text style={styles.timer}>{recordingTime}</Text>
            <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={toggleRecording}
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name="mic"
                    size={50}
                    color={isRecording ? '#ff4444' : '#fff'}
                />
            </TouchableOpacity>
            <Text style={styles.helpText}>
                {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
            </Text>
            {recordings.map((recording) => (
                <View key={recording.id} style={styles.recordingItem}>
                    <Text>{recording.timestamp}</Text>
                    <TouchableOpacity onPress={() => playRecording(recording.uri)}>
                        <Text style={styles.playButton}>Play</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => shareRecording(recording.uri)}>
                        <Text style={styles.shareButton}>Share</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 20,
        color: '#333',
    },
    timer: {
        fontSize: 48,
        fontWeight: '300',
        marginBottom: 30,
        color: '#008B8B',
    },
    recordButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#008B8B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recordingButton: {
        backgroundColor: '#006666',
        transform: [{ scale: 1.1 }],
    },
    helpText: {
        marginTop: 15,
        color: '#666',
        fontSize: 16,
    },
    recordingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    playButton: {
        color: '#008B8B',
        marginRight: 10,
    },
});