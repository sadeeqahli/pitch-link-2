import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function TestEdit() {
  const [name, setName] = useState("John Doe");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  const startEditing = () => {
    setTempName(name);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setName(tempName);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Test Edit Functionality
      </Text>
      
      {!isEditing ? (
        <View>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Name: {name}</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#00CC66",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={startEditing}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Edit Name
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 15,
              fontSize: 18,
              backgroundColor: "white",
              marginBottom: 20,
            }}
            value={tempName}
            onChangeText={setTempName}
            autoFocus
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#ccc",
                padding: 15,
                borderRadius: 10,
                flex: 0.45,
                alignItems: "center",
              }}
              onPress={cancelEdit}
            >
              <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#00CC66",
                padding: 15,
                borderRadius: 10,
                flex: 0.45,
                alignItems: "center",
              }}
              onPress={saveEdit}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}