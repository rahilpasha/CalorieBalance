import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Pressable, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';


export default function App() {

  // Create the gloabl variables
  const [allFood, setAllFood] = useState([]);
  const [dailyIntake, setDailyIntake] = useState(
    {
      'calories' : 0,
      'protein' : 0,
      'carbs' : 0,
      'fat' : 0
    }
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState({
    'name' : '',
    'calories' : 0,
    'protein' : 0,
    'carbs' : 0,
    'fat' : 0
  });
  
  const [foodEntry, setFoodEntry] = useState('');

  const [allExercises, setAllExercises] = useState([]);
  const [dailyExercise, setDailyExercise] = useState(0);

  const [exerciseEntry, setExerciseEntry] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [age, setAge] = useState(0);
  


  return (
    
    <View style={styles.container}>

      <ScrollView>

        <Modal transparent={true} visible={modalVisible}>

          <View style={styles.modal}>
            <Text>Name: {selectedFood.name}</Text>
            <Text>Calories: {Math.round(selectedFood.calories)} Protein: {Math.round(selectedFood.protein)}</Text>
            <Text>Carbs: {Math.round(selectedFood.carbs)} Fat: {Math.round(selectedFood.fat)}</Text>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text>Close</Text>
            </Pressable>

          </View>

        </Modal>
        
        <FlatList
          style={styles.foodList}
          data={allFood}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name} has {Math.round(item.calories)} calories</Text>

              <Pressable onPress={() => {
                setSelectedFood({
                  'name' : item.name,
                  'calories' : item.calories,
                  'protein' : item.protein,
                  'carbs' : item.carbs,
                  'fat' : item.fat
                })
                setModalVisible(true);
              }}>
                <Text>more information</Text>
              </Pressable>

            </View>
          )}
        />
        
        <Text>Daily Calories: {Math.round(dailyIntake.calories)} Protein: {Math.round(dailyIntake.protein)}</Text>
        <Text>Carbs: {Math.round(dailyIntake.carbs)} Fat: {Math.round(dailyIntake.fat)}</Text>

        <TextInput style={styles.input} placeholder='food' onChangeText={(foodInput) => setFoodEntry(foodInput)}/>
        
        <Button title='Submit' onPress={() => getFoodNutrition(foodEntry)}/>

        
        <FlatList
          style={styles.exerciseList}
          data={allExercises}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.exercise} burnt {Math.round(item.calories)} calories</Text>
            </View>
          )}
        />

        <Text>Total Calories Burnt: {Math.round(dailyExercise)}</Text>


        <View style={styles.exerciseInput}>

          <TextInput style={styles.input} placeholder='exercise' onChangeText={(exerciseInput) => setExerciseEntry(exerciseInput)}/>
          <TextInput style={styles.input} placeholder='male or female' onChangeText={(text) => setGender(text)}/>
          <TextInput placeholder='weight (lbs)' onChangeText={(text) => setWeight(parseInt(text, 10))} />
          <TextInput placeholder='height (in)' onChangeText={(text) => setHeight(parseInt(text, 10))} />
          <TextInput placeholder='age' onChangeText={(text) => setAge(parseInt(text, 10))} />

          <Button title='Submit' onPress={() => getCaloriesBurnt(exerciseEntry, gender, weight, height, age)}/>

        </View>

        <StatusBar style="auto" />

      </ScrollView>
    </View>
  );

  function getFoodNutrition(food) {
    food_url = "https://trackapi.nutritionix.com/v2/natural/nutrients";

    return fetch(food_url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-app-id': '3d415188',
        'x-app-key': '202343b02beb731a678bdef385ee803d',
        'x-remote-user-id': '0'
      },
      body: JSON.stringify({
        'query': food
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.foods[0].food_name);

      setAllFood([... allFood, {
        'name' : response.foods[0].food_name,
        'calories' : response.foods[0].nf_calories,
        'protein' : response.foods[0].nf_protein,
        'carbs' : response.foods[0].nf_total_carbohydrate,
        'fat' : response.foods[0].nf_total_fat
      }]);

      setDailyIntake({
        'calories' : dailyIntake.calories + response.foods[0].nf_calories,
        'protein' : dailyIntake.protein + response.foods[0].nf_protein,
        'carbs' : dailyIntake.carbs + response.foods[0].nf_total_carbohydrate,
        'fat' : dailyIntake.fat + response.foods[0].nf_total_fat
      })

    })
    .catch((error) => {
      console.error(error);
    });

  };

  function getCaloriesBurnt(exercise, gender, weight, height, age) {
    food_url = "https://trackapi.nutritionix.com/v2/natural/exercise";

    return fetch(food_url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-app-id': '3d415188',
        'x-app-key': '202343b02beb731a678bdef385ee803d',
      },
      body: JSON.stringify({
        'query': exercise,
        'gender': gender,
        'weight_kg': weight * 0.453592,
        'height_cm': height * 2.54,
        'age': age
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.exercises[0].name + ' ' + response.exercises[0].nf_calories);

      setAllExercises([... allExercises, {
        'exercise' : response.exercises[0].name,
        'calories' : response.exercises[0].nf_calories
      }]);

      setDailyExercise(dailyExercise + response.exercises[0].nf_calories)

    })
    .catch((error) => {
      console.error(error);
    });
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'gray',
    width: '70%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flex: 1
  },
  list: {
    flex: 1
  }
});
