import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../app/index';
import { useAuth } from '../app/src/AuthContext'; 

// Define the route type for this screen
type OrderNowScreenRouteProp = RouteProp<RootStackParamList, 'OrderNow'>;

const OrderNowScreen: React.FC = () => {
  // Use `useRoute` to access route params
  const route = useRoute<OrderNowScreenRouteProp>();
  const { pizzaName, pizzaPrice, quantity: initialQuantity } = route.params;
  const [quantity, setQuantity] = useState(initialQuantity); // Track quantity changes
  const { user } = useAuth();
  const priceValue = parseFloat(pizzaPrice.replace('$', '').trim()); // Get price as number
  const totalPrice = priceValue * quantity; // Calculate total price based on quantity

  const handleAddToCart = async () => {
    const orderDetails = {
      pizzaName,
      pizzaPrice: priceValue, // Send priceValue without dollar sign
      quantity,
      email: user?.email
    };

    try {
      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        Alert.alert('Success', `${quantity} ${pizzaName}(s) have been added to your cart!`);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to add order to cart.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the order.');
      console.error(error);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prevQuantity) => Math.max(prevQuantity + change, 1)); // Ensure quantity doesn’t go below 1
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Now</Text>
      <Text style={styles.pizzaName}>Pizza: {pizzaName}</Text>
      <Text style={styles.pizzaPrice}>Price per unit: ${priceValue.toFixed(2)}</Text>

      <View style={styles.counterContainer}>
        <Button title="-" onPress={() => handleQuantityChange(-1)} />
        <Text style={styles.quantityText}>{quantity}</Text>
        <Button title="+" onPress={() => handleQuantityChange(1)} />
      </View>

      <Text style={styles.pizzaPrice}>Total Price: ${totalPrice.toFixed(2)}</Text>

      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pizzaName: {
    fontSize: 20,
    marginTop: 10,
  },
  pizzaPrice: {
    fontSize: 20,
    marginTop: 5,
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
});

export default OrderNowScreen;
