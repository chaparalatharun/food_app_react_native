// src/components/SignInScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/app/src/AuthContext';

const SignInScreen = () => {
    const { signIn, completeSignIn } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const handleSignIn = async () => {
        const success = await signIn();
        if (success) {
            completeSignIn(username, email, profilePicture);          
        } else {
            Alert.alert('Sign In Failed', 'Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Sign In with Google" onPress={handleSignIn} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default SignInScreen;
