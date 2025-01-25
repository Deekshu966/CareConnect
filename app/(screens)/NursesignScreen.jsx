import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Logo from '../../components/logo';
import Input from '../../components/signScreenComponents/input';
import Button from '../../components/Button';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // Verfiy if the Nurse is already logged in by checking token on local storage which is set after successful login
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('nursetoken');
            if (token) {
                router.push('/(screens)/nurseScreen');
            }
        };
        checkToken();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.45.108:5000/api/nurses/login', {
                id,
                password
            });
            const data = response.data;
            if (response.status === 200) {
                //extract the JWT token from the response
                const nursetoken = data.nursetoken;

                // Store the token in AsyncStorage
                await AsyncStorage.setItem('nursetoken', nursetoken);
                console.log('Login successful:');

                // Store nurse details in AsyncStorage
                if (data.nurse) {
                    await AsyncStorage.setItem('nurseDetails', JSON.stringify(data.nurse));
                }
                router.push('/(screens)/nurseScreen');
            } else {
                console.warn('Login failed:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Something went wrong. Please try again.');
        }
    };
    const handleForgotPassword = () => {
        router.push('/(screens)/forgotPasswordScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Icon name="chevron-left" size={20} color="#007E7E" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.content}>
                <Logo />
                <Text style={styles.title}>CareConnect</Text>
                <Text style={styles.subtitle}>Login with your credentials</Text>
                <View style={styles.form}>
                    <Input
                        placeholder="Employee ID"
                        value={id}
                        onChangeText={setId}
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={styles.forgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <Button title="Continue" onPress={handleLogin} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
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
        marginTop: 16,
    },
    forgotPassword: {
        marginTop: 15,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#666',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
    },
});
