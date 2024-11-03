import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, Modal, TextInput } from 'react-native';
import { useAuth } from '../app/src/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

interface CartItem {
    id: number;
    pizzaName: string;
    pizzaPrice: number;
    quantity: number;
}

const CartScreen: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [removeQuantity, setRemoveQuantity] = useState(1);
    const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
    const { user } = useAuth();
    const email = user?.email;

    // Fetch cart items whenever the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            const fetchCartItems = async () => {
                if (!email) return;
                try {
                    const response = await fetch(`http://localhost:3000/cart/${email}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCartItems(data);
                    } else {
                        Alert.alert('Error', 'Failed to fetch cart items.');
                    }
                } catch (error) {
                    Alert.alert('Error', 'An error occurred while fetching cart items.');
                    console.error(error);
                }
            };
            fetchCartItems();
        }, [email])
    );

    // Handle item removal based on quantity
    const handleRemoveItem = async () => {
        if (!selectedItem) return;

        try {
            const response = await fetch(`http://localhost:3000/cart/remove/${selectedItem.id}/${email}?quantity=${removeQuantity}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Alert.alert('Success', `${removeQuantity} ${selectedItem.pizzaName}(s) removed from cart!`);
                setCartItems(prevItems => {
                    const updatedItems = prevItems.map(item => {
                        if (item.id === selectedItem.id) {
                            const updatedQuantity = item.quantity - removeQuantity;
                            return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
                        }
                        return item;
                    }).filter(Boolean) as CartItem[];
                    return updatedItems;
                });
            } else {
                Alert.alert('Error', 'Failed to remove item from cart.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while removing the item.');
            console.error(error);
        } finally {
            setModalVisible(false);
            setRemoveQuantity(1); // Reset quantity after removing
        }
    };

    // Open modal for item removal and set the default quantity
    const openRemoveModal = (item: CartItem) => {
        setSelectedItem(item);
        setRemoveQuantity(item.quantity); // Set default remove quantity to item's quantity
        setModalVisible(true);
    };

    // Calculate total cart price
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.pizzaPrice * item.quantity), 0).toFixed(2);
    };

    // Render cart item
    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemText}>{item.pizzaName}</Text>
            <Text style={styles.itemText}>${Number(item.pizzaPrice).toFixed(2)}</Text>
            <Text style={styles.itemText}>Qty: {item.quantity}</Text>
            <Button title="Remove" onPress={() => openRemoveModal(item)} />
        </View>
    );

    const handleQuantityChange = (change: number) => {
        setRemoveQuantity(prevQuantity => {
            const newQuantity = prevQuantity + change;
            // Ensure the new quantity is within valid range
            return Math.max(0, Math.min(newQuantity, selectedItem ? selectedItem.quantity : 0));
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>

            {cartItems.length === 0 ? (
                <Text style={styles.emptyText}>Your cart is empty</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.list}
                    />
                    <Text style={styles.total}>Total: ${calculateTotalPrice()}</Text>
                </>
            )}

            <Button title="Checkout" onPress={() => Alert.alert('Checkout', 'Proceeding to checkout...')} />

            {/* Modal for removing items */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Remove Items</Text>
                        
                        <View style={styles.quantityControls}>
                            <Button title="-" onPress={() => handleQuantityChange(-1)} />
                            <Text style={styles.quantityText}>{removeQuantity}</Text>
                            <Button title="+" onPress={() => handleQuantityChange(1)} />
                        </View>
                        <Button title="Confirm" onPress={handleRemoveItem} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        marginBottom: 16,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    quantityControls: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Center the items
        alignItems: 'center', // Align items vertically in the center
        width: '100%',
        marginBottom: 10,
    },
    
    quantityText: {
        paddingHorizontal: 10, // Add some horizontal padding for spacing
        fontSize: 18,
        textAlign: 'center', // Center the text
    },    
});

export default CartScreen;
