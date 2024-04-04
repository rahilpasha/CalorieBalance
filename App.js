import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Pressable, Modal, ScrollView, Image } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';


// sqlite database

import {
  enablePromise,
  openDatabase,
} from "react-native-sqlite-storage"

// Enable promise for SQLite
enablePromise(true)

const connectToDatabase = async () => {
  return openDatabase(
    { name: "CalorieBalance.db", location: "default" },
    () => {},
    (error) => {
      console.error(error)
      throw Error("Could not connect to database")
    }
  )
}

const createTables = async (db) => {
  const foodQuery = `
    CREATE TABLE IF NOT EXISTS food (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        calories TEXT
    )
  `
  const exerciseQuery = `
   CREATE TABLE IF NOT EXISTS exercise (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      calories TEXT
   )
  `
  try {
    await db.executeSql(foodQuery)
    await db.executeSql(exerciseQuery)
  } catch (error) {
    console.error(error)
    throw Error(`Failed to create tables`)
  }
}




export default function App() {

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase()
      await createTables(db)
    } catch (error) {
      console.error(error)
    }
  }, [])
  
  useEffect(() => {
    loadData()
  }, [loadData])

  // Create the gloabl variables
  const [allFood, setAllFood] = useState([]); // List of all food entered
  const [dailyIntake, setDailyIntake] = useState( // Total number of nutrients consumed
    {
      'calories' : 0,
      'protein' : 0,
      'carbs' : 0,
      'fat' : 0,
      'sugar' : 0
    }
  );

  const [modalVisible, setModalVisible] = useState(false); // Whether the popup is visible
  const [selectedFood, setSelectedFood] = useState({ // Selected food for the popup
    'name' : '',
    'calories' : 0,
    'protein' : 0,
    'carbs' : 0,
    'fat' : 0,
    'sugar' : 0
  });
  
  const [foodEntry, setFoodEntry] = useState(''); // Input variable for the nutrient calculations

  const [allExercises, setAllExercises] = useState([]); // List of all exercises entered
  const [dailyExercise, setDailyExercise] = useState(0); // Total number of calories burnt

  // Input variables for the exercise calculations
  const [exerciseEntry, setExerciseEntry] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [age, setAge] = useState(0);
  

  return (
    
    <View style={styles.container}>

      <ScrollView style={styles.scroll}>

        <Image style={styles.logo} source={require('./assets/logo.png')} />
        
        <View style={styles.dashboard}>
          <Text style={styles.caloriesCount}>Daily Calories: {Math.round(dailyIntake.calories)} </Text>

          <View style={styles.dashboardStats}>
            <Text style={styles.stats}>{Math.round(dailyIntake.carbs)}    {Math.round(dailyIntake.fat)}    {Math.round(dailyIntake.protein)}    {Math.round(dailyIntake.sugar)}</Text>
            <Text style={styles.subtitle}> Carbs    Fat    Protein   Sugar</Text>
          </View>
        </View>

        <View style={styles.modal}>
          <Modal transparent={true} visible={modalVisible}>

            <View style={styles.modal}>
              <Text style={styles.stats}>{selectedFood.name}</Text>
              <Text style={styles.stats}>Calories: {Math.round(selectedFood.calories)}</Text>
              <Text style={styles.stats}>Protein: {Math.round(selectedFood.protein)} Carbs: {Math.round(selectedFood.carbs)}</Text>
              <Text style={styles.stats}>Fat: {Math.round(selectedFood.fat)}        Sugar: {Math.round(selectedFood.sugar)}</Text>

              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{alignSelf:'center'}}>Close</Text>
              </Pressable>

            </View>

          </Modal>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            style={styles.foodList}
            data={allFood}
            renderItem={({ item }) => (
              <View style={styles.item}>
                
                <Text style={styles.itemName} >{Math.round(item.calories)} calories   {item.name}</Text>

                <View style={styles.infoIcon}>
                  <Pressable onPress={() => {
                    setSelectedFood({
                      'name' : item.name,
                      'calories' : item.calories,
                      'protein' : item.protein,
                      'carbs' : item.carbs,
                      'fat' : item.fat,
                      'sugar' : item.sugar
                    })
                    setModalVisible(true);
                  }}>
                    <Image source={require('./assets/infoIcon.png')} />
                  </Pressable>
                </View>

              </View>
            )}
          />
        </View>
        
        <View style={styles.inputBox}>
          <TextInput style={styles.input} placeholder='food' placeholderTextColor='#8FBEF3' onChangeText={(foodInput) => setFoodEntry(foodInput)}/>
          <View style={styles.submitBox}>
            <Button title='Submit' color='#111818' onPress={() => getFoodNutrition(foodEntry)}/>
          </View>
        </View>
        
        
        <View style={styles.listContainer}>
          <FlatList
            style={styles.foodList}
            data={allExercises}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={[styles.itemName, {paddingTop:0}]}>{Math.round(item.calories)} calories      {item.exercise}</Text>
              </View>
            )}
          />
        </View>

        <View style={[styles.dashboard]}>
          <Text style={styles.caloriesCount}>Calories Burnt: {Math.round(dailyExercise)}</Text>
        </View>

        <View style={styles.exerciseInput}>

          <TextInput style={styles.input} width='80%' placeholder='exercise' placeholderTextColor='#8FBEF3' onChangeText={(exerciseInput) => setExerciseEntry(exerciseInput)}/>
          <TextInput style={styles.input} width='40%' placeholder='male or female' placeholderTextColor='#8FBEF3' onChangeText={(text) => setGender(text)}/>
          <TextInput style={styles.input} width='40%' placeholder='weight (lbs)' placeholderTextColor='#8FBEF3' onChangeText={(text) => setWeight(parseInt(text, 10))} />
          <TextInput style={styles.input} width='40%' placeholder='height (in)' placeholderTextColor='#8FBEF3' onChangeText={(text) => setHeight(parseInt(text, 10))} />
          <TextInput style={styles.input} width='40%' placeholder='age' placeholderTextColor='#8FBEF3' onChangeText={(text) => setAge(parseInt(text, 10))} />


        </View>

        <View style={styles.submitBox}>
          <Button title='Submit' color='#111818' onPress={() => getCaloriesBurnt(exerciseEntry, gender, weight, height, age)}/>
        </View>

        <StatusBar style="auto" />

      </ScrollView>
    </View>
  );

  // Get the nutrition information from the API
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
        'fat' : response.foods[0].nf_total_fat,
        'sugar' : response.foods[0].nf_sugars
      }]);

      setDailyIntake({
        'calories' : dailyIntake.calories + response.foods[0].nf_calories,
        'protein' : dailyIntake.protein + response.foods[0].nf_protein,
        'carbs' : dailyIntake.carbs + response.foods[0].nf_total_carbohydrate,
        'fat' : dailyIntake.fat + response.foods[0].nf_total_fat,
        'sugar' : dailyIntake.sugar + response.foods[0].nf_sugars
      })

    })
    .catch((error) => {
      console.error(error);
    });

  };

  // Get the exercise information from the API
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
    // backgroundColor: '#e6eded',
    backgroundColor: '#111818',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    width: '90%',
  },
  logo: {
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 10
  },
  dashboard: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#5ab44b',
    borderRadius: '15px',
    paddingVertical: 10,
    width: "80%"
  },
  caloriesCount: {
    fontFamily: 'Gill Sans',
    fontSize: 30,
  },
  dashboardStats: {
    alignItems: 'center',
  },
  stats: {
    fontSize: 25,
    fontFamily: 'Gill Sans',
    alignSelf: 'center',
  },
  subtitle: {
    fontFamily: 'Gill Sans',
    alignSelf: 'center',
  },
  listContainer: {
    maxHeight: '50%',
  },
  foodList: {
    backgroundColor: '#35333B',
    borderRadius: '15px',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    width: '100%'
  },
  item: {
    borderRadius: '15px',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    alignSelf: 'right',
    backgroundColor: '#8FBEF3',
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  itemName: {
    fontFamily: 'Gill Sans',
    fontSize: 20,
    width: 250,
    paddingTop: 5
  },
  infoIcon: {
    width: 32,
    height: 32
  },
  inputBox: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    borderColor: '#8FBEF3',
    width: '70%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Gill Sans',
    fontSize: 15,
    color: '#8FBEF3',
    marginBottom: 10
  },
  submitBox: {
    backgroundColor: '#8DD874',
    borderRadius: 10,
    width: '30%',
    marginTop: 5,
    alignSelf: 'center'
  },
  exerciseInput: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 55
  },
  modal: {
    alignSelf: 'center',
    backgroundColor: '#8DD874',
    borderRadius: 10,
    padding: 10,
    marginTop: 250,
    position: 'absolute',
    opacity: 0.9
  }

});
