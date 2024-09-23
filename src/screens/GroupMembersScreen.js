import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function GroupMembersScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Felipe Zanotto</Text>
      <Button title="Voltar à Home" onPress={() => navigation.goBack()} />
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
});
