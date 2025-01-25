import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Logo from '../../components/logo';
import Input from '../../components/signScreenComponents/input'
import Button from '../../components/Button';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // Verfiy if the Patient is already logged in by checking token on local storage which is set after successful login
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('patienttoken');
            if (token) {
                router.push('/(screens)/patientScreen');
            }
        };
        checkToken();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.45.108:5000/api/patients/login', { id, password });
            const data = response.data;
            if (response.status === 200) {
                const patienttoken = data.patienttoken;
                await AsyncStorage.setItem('patienttoken', patienttoken);
                console.log('Login successful:', response);

                await AsyncStorage.setItem('patientDetails', JSON.stringify(data.patient));
                router.push('/(screens)/patientScreen');
            } else {
                console.warn('Login failed:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Icon name="chevron-left" size={20} color="#007E7E" style={{ marginRight: 10 }} />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.content}>
                <Logo />
                <Text style={styles.title}>CareConnect</Text>
                <Text style={styles.subtitle}>Login in with your credentials</Text>
                <View style={styles.form}>
                    <Input
                        placeholder="Patient ID"
                        value={id}
                        onChangeText={setId}
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    {/* Hint text below the password input */}
                    <Text style={styles.hintText}>
                        Hint : Fill your DoB as password
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button title="Continue" onPress={handleLogin} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    backText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#007E7E',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
    },
    form: {
        width: '100%',
        marginTop: 16,
    },
    hintText: {
        fontSize: 13,
        color: '#888',
        marginTop: -6.9,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
    },
});

