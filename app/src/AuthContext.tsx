// /app/src/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID } from '@env';


WebBrowser.maybeCompleteAuthSession();

type User = {
  username: string;
  email: string;
  profilePicture: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<boolean>;
  completeSignIn: (username: string, email: string, profilePicture: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    loadStoredUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const decoded: any = jwtDecode(id_token);
      const username = decoded.name;
      const email = decoded.email;
      const profilePicture = decoded.picture
      completeSignIn(username, email, profilePicture);
    }
  }, [response]);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await promptAsync();
      return result.type === 'success';
    } finally {
      setIsLoading(false);
    }
  };

  const completeSignIn = async (username: string, email: string, profilePicture: string) => {
    const newUser = { username, email, profilePicture };
    setUser(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));

    // Send user data to the backend
    try {
        const response = await fetch('http://localhost:3000/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser), // Send the username and email
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register user');
        }

        console.log('User registered successfully:', data);
    } catch (error) {
        console.error('Error registering user:', error);
    }
};


  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, completeSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
