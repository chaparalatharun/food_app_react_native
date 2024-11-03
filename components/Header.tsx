import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/app/src/AuthContext'; // Adjust the path as needed

const Header = () => {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            {user && user.profilePicture ? ( // Check if user and profilePicture exist
                <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder} />
            )}
            <Text style={styles.username}>{user ? user.username : 'Guest'}</Text>
            {user && (
                <TouchableOpacity onPress={signOut}>
                    <Text style={styles.signOut}>Sign Out</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically in the center
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#ff6347',
    },
    username: {
        color: '#fff',
        fontSize: 18,
        flex: 1, // Allows Text to take up remaining space
        marginLeft: 10, // Space between avatar and username
    },
    signOut: {
        color: '#fff',
        fontSize: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20, // Makes the image circular
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff', // Placeholder color
    },
});

export default Header;
