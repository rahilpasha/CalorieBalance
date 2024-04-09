import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExerciseCard = ({ name, calories }) => {
  return (
    <View style={exerciseStyles.container}>
      <View style={exerciseStyles.card}>
        <Text style={exerciseStyles.name}>{name}</Text>
        <Text style={exerciseStyles.calories}>{calories} calories</Text>
      </View>
    </View>
  );
};

const exerciseStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgb(235, 169, 169)', // Pink color
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  calories: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ExerciseCard;
