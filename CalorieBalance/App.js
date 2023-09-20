import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
  .then(response => console.log(response))
  .catch((error) => {
    console.error(error);
  });

}

export default function App() {
  getFoodNutrition('1 cup chicken noodle soup')
  return (
    <View style={styles.container}>
      <Text>1 cup chicken noodle soup</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
