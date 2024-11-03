// src/components/PizzaItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface PizzaItemProps {
  name: string;
  price: number; // Assuming you have changed this to number
}

const PizzaItem: React.FC<PizzaItemProps> = ({ name, price }) => (
  <View style={styles.pizzaCard}>
    <Text style={styles.pizzaName}>{name}</Text>
    <Text style={styles.pizzaPrice}>Price: ${price.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
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
  },
});

export default PizzaItem;
