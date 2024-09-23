import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projeto integrador VI-A</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Membros do Grupo"
          onPress={() => navigation.navigate("GroupMembers")}
          color="#1E90FF"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Game"
          onPress={() => navigation.navigate("Game")}
          color="#32CD32"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: "80%",
  },
});
