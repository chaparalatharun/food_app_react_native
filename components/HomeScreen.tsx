import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/index';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const [pizzas, setPizzas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({}); // State to hold quantities by pizza ID
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const fetchPizzas = async () => {
        try {
            const response = await fetch('http://localhost:3000/pizzas');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setPizzas(data);
            const initialQuantities = data.reduce((acc: any, pizza: any) => {
                acc[pizza.id] = 1; // Initialize each pizza's quantity to 1
                return acc;
            }, {});
            setQuantities(initialQuantities); // Set initial quantities for each pizza
        } catch (error) {
            console.error('Error fetching pizza data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPizzas();
    }, []);

    const handleQuantityChange = (id: string, change: number) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: Math.max(prevQuantities[id] + change, 1), // Ensure quantity doesn't go below 1
        }));
    };

    const renderPizzaItem = ({ item }: { item: { name: string; price: string; image: string; id: string } }) => (
        <View style={styles.pizzaCard}>
            <Image source={{ uri: item.image }} style={styles.pizzaImage} />
            <Text style={styles.pizzaName}>{item.name}</Text>
            <Text style={styles.pizzaPrice}>{item.price}</Text>

            <View style={styles.counterContainer}>
                <Button title="-" onPress={() => handleQuantityChange(item.id, -1)} />
                <Text style={styles.quantityText}>{quantities[item.id] || 1}</Text>
                <Button title="+" onPress={() => handleQuantityChange(item.id, 1)} />
            </View>

            <TouchableOpacity
                style={styles.orderButton}
                onPress={() => navigation.navigate('OrderNow', { pizzaName: item.name, pizzaPrice: item.price, quantity: quantities[item.id] || 1 })}
            >
                <Text style={styles.orderButtonText}>Add to Order</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6347" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pizza Menu</Text>
            <FlatList
                data={pizzas}
                renderItem={renderPizzaItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 100,
    },
    pizzaCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        alignItems: 'center',
    },
    pizzaImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    pizzaName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    pizzaPrice: {
        fontSize: 16,
        color: '#888',
        marginBottom: 8,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    orderButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    orderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
