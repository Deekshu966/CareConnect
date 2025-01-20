import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function Header({ name, employeeId, department, wardNo }) {
    const handleTaskManagerScreen = () => {
        console.log('Task Manager pressed');
        router.push('/(screens)/TaskManagerScreen');
      };
    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image
                    source={require('../../assets/images/Nurseicon.png')}
                    style={styles.profileImage}
                 />
            <View style={styles.detailsSection}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.detailText}>Employee ID : {employeeId}</Text>
                <Text style={styles.detailText}>Department : {department}</Text>
                <Text style={styles.detailText}>Ward No. : {wardNo}</Text>
             </View>
               <TouchableOpacity onPress={handleTaskManagerScreen}>
                    <MaterialCommunityIcons name="clipboard-text" size={30} color="#006400" />
                </TouchableOpacity>
            </View>
          </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#90EE90',
        padding: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        maxHeight: 400,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 0,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 30,
        marginRight: 0,
        marginHorizontal: 0,
    },
    detailsSection: {
        flex: 1,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        color: '#000',
    },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        
    },
    detailTextText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
});

