import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/nurseScreenComponents/Header';
import DateSelector from '../../components/nurseScreenComponents/DateSelector';
import TaskList from '../../components/nurseScreenComponents/TaskList';
import LogoutButton from '../../components/nurseScreenComponents/LogOutButton';

export default function NurseDashboardScreen() {
    const [tasks, setTasks] = useState([]);
    const [nurseDetails, setNurseDetails] = useState(null);

    useEffect(() => {
        const loadNurseDetails = async () => {
            try {
                const storedDetails = await AsyncStorage.getItem('nurseDetails');
                if (storedDetails) {
                    setNurseDetails(JSON.parse(storedDetails)); //convert the string back to an object
                    console.log('the nurse data is :',nurseDetails);
                }
            } catch (error) {
                console.error('Error loading nurse details:', error);
            }
        };

        const loadTasks = async () => {
            try {
                const completedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
                const initialTasks = []; // Fetch or define your tasks here

                const filteredTasks = initialTasks.filter(
                    (task) =>
                        !completedTasks.some(
                            (completedTask) =>
                                completedTask.room === task.room &&
                                completedTask.bed === task.bed &&
                                completedTask.request === task.request
                        )
                );

                setTasks(filteredTasks);
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };

        loadNurseDetails();
        loadTasks();
    }, []);

    const handleTaskCompletion = async (completedTask) => {
        try {
            setTasks((prevTasks) => prevTasks.filter((task) => task !== completedTask));

            const savedTasks = JSON.parse(await AsyncStorage.getItem('completedTasks')) || [];
            const isDuplicate = savedTasks.some(
                (task) =>
                    task.room === completedTask.room &&
                    task.bed === completedTask.bed &&
                    task.request === completedTask.request
            );

            if (!isDuplicate) {
                savedTasks.push(completedTask);
                await AsyncStorage.setItem('completedTasks', JSON.stringify(savedTasks));
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {nurseDetails ? (
                <Header
                    name={nurseDetails.name}
                    employeeId={nurseDetails.nurseId}
                    department={nurseDetails.department}
                    wardNo={nurseDetails.wardNo}
                />
            ) : (
                <Text>Loading nurse details...</Text>
            )}
            <DateSelector />
            <TaskList tasks={tasks} onTaskComplete={handleTaskCompletion} />
            <LogoutButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5,
    },
    header: {
        marginBottom: 10,
    },
});
