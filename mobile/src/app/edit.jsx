import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Save, Plus, X, Eye, EyeOff } from "lucide-react-native";

export default function Edit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Form state with all requested fields
  const [pitchName, setPitchName] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [isActive, setIsActive] = useState(true);
  // For photos, we'll just show a placeholder since implementing image picker would be complex
  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1540442588252-6b93036098a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  ]);

  // Load mock data when component mounts
  useEffect(() => {
    // Mock data for the pitch being edited
    const mockPitchData = {
      name: "Main Football Pitch",
      price_per_hour: "8000",
      description: "Professional football pitch with floodlights and changing rooms",
      location: "123 Sports Avenue, Lagos",
      amenities: ["Floodlights", "Changing Rooms", "Parking", "Showers"],
      is_active: true
    };
    
    setPitchName(mockPitchData.name);
    setPricePerHour(mockPitchData.price_per_hour);
    setDescription(mockPitchData.description);
    setLocation(mockPitchData.location);
    setAmenities(mockPitchData.amenities);
    setIsActive(mockPitchData.is_active);
  }, []);

  const handleSave = () => {
    // Simple validation
    if (!pitchName.trim()) {
      Alert.alert("Error", "Please enter a pitch name");
      return;
    }
    
    if (!pricePerHour.trim()) {
      Alert.alert("Error", "Please enter a price per hour");
      return;
    }
    
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }
    
    // Show success message
    Alert.alert(
      "Success", 
      "Pitch updated successfully!",
      [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]
    );
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Edit Pitch</Text>
        <TouchableOpacity onPress={handleSave}>
          <Save size={24} color="#00CC66" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 16, textAlign: "center" }}>
          Editing pitch ID: {id || "No ID"}
        </Text>
        
        {/* Pitch Name */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Pitch Name *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              fontSize: 16,
            }}
            value={pitchName}
            onChangeText={setPitchName}
            placeholder="Enter pitch name"
          />
        </View>
        
        {/* Price per Hour */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Price per Hour (₦) *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              fontSize: 16,
            }}
            value={pricePerHour}
            onChangeText={setPricePerHour}
            placeholder="Enter price per hour"
            keyboardType="numeric"
          />
        </View>
        
        {/* Location */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Location *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              fontSize: 16,
            }}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
          />
        </View>
        
        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Description
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              fontSize: 16,
              minHeight: 100,
              textAlignVertical: "top",
            }}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter pitch description"
            multiline={true}
          />
        </View>
        
        {/* Photos */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Photos
          </Text>
          <View style={{ 
            borderWidth: 1, 
            borderColor: "#ccc", 
            borderRadius: 8, 
            padding: 16, 
            backgroundColor: "#fff",
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
              Current photo
            </Text>
            <View style={{ 
              width: 100, 
              height: 100, 
              backgroundColor: "#eee",
              borderRadius: 8,
              marginBottom: 8,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text style={{ color: "#999" }}>Image</Text>
            </View>
            <Text style={{ fontSize: 14, color: "#00CC66", textAlign: "center" }}>
              Tap to change photo
            </Text>
          </View>
        </View>
        
        {/* Amenities */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Amenities
          </Text>
          
          {/* Add amenity input */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#fff",
                fontSize: 16,
                marginRight: 8,
              }}
              value={newAmenity}
              onChangeText={setNewAmenity}
              placeholder="Add an amenity"
              onSubmitEditing={addAmenity}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#00CC66",
                borderRadius: 8,
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={addAmenity}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Amenities list */}
          {amenities.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {amenities.map((amenity, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#e0e0e0",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#333", marginRight: 6 }}>
                    {amenity}
                  </Text>
                  <TouchableOpacity onPress={() => removeAmenity(amenity)}>
                    <X size={16} color="#ff0000" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Status Toggle */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
              Pitch Status
            </Text>
            <Text style={{ fontSize: 14, color: "#666" }}>
              {isActive ? "Pitch is visible to customers" : "Pitch is hidden from customers"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isActive ? (
              <Eye size={20} color="#00CC66" style={{ marginRight: 8 }} />
            ) : (
              <EyeOff size={20} color="#ff0000" style={{ marginRight: 8 }} />
            )}
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#ccc", true: "#00CC66" }}
              thumbColor={isActive ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#00CC66",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={handleSave}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}