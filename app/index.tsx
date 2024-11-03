// index.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/components/HomeScreen';
import OrderNowScreen from '@/components/OrderNowScreen';
import SignInScreen from '@/components/SignInScreen';
import CartScreen from '@/components/CartScreen';
import Header from '@/components/Header';
import { AuthProvider, useAuth } from './src/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
    SignIn: undefined;
    Main: undefined;
    Home: undefined;
    OrderNow: { pizzaName: string; pizzaPrice: string; quantity: number };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="OrderNow" component={OrderNowScreen} />
    </HomeStack.Navigator>
);

const MainNavigator = () => (
    <View style={{ flex: 1 }}>
        <Header />
        <Tab.Navigator>
            <Tab.Screen name="Food" component={HomeStackNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    </View>
);

const RootNavigator = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ff6347" />
            </View>
        );
    }

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <RootStack.Screen name="Main" component={MainNavigator} />
            ) : (
                <RootStack.Screen name="SignIn" component={SignInScreen} />
            )}
        </RootStack.Navigator>
    );
};

const App = () => (
    <AuthProvider>
        <NavigationContainer independent={true}> 
            <RootNavigator />
        </NavigationContainer>
    </AuthProvider>
);

export default App;
