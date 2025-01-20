import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function MessageInput({ onSend }) {
    const [message, setMessage] = React.useState('');

    const handleSend = () => {
        if (message.trim()) {
            const newRequest = {
                request: message,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
            };
            onSend(newRequest); // Call the onSend function passed as a prop
            setMessage(''); // Clear the input
        }
    };
    
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                multiline
                onSubmitEditing={handleSend} // Allow sending on pressing "Enter"
            />
            {/* Integrated SendButton Code */}
            <TouchableOpacity style={styles.sendButtonSmall} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
        maxHeight: 150,
        marginHorizontal: 20,
        marginBottom: 20,
        width: 350, 
        height: 80
    },
    sendButtonSmall: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#008B8B',
        padding: 15, 
        borderRadius: 8, 
        marginHorizontal: 10,
        marginBottom: 5,
        width: 150, 
        height: 50
    },
    sendButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    },
   });
