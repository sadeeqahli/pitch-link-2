import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

export default function SimpleEditPitch() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);

  // Form state
  const [pitchName, setPitchName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Mock data for demonstration - REPLACE THIS WITH REAL DATA FETCHING
  useEffect(() => {
    if (id) {
      setLoading(true);
      // Simulate fetching pitch data
      setTimeout(() => {
        // In a real app, you would fetch the actual pitch data from your backend
        // For now, we'll keep the mock data but you should replace this with:
        // fetchPitchData(id).then(data => {
        //   setPitchName(data.name);
        //   setLocation(data.location);
        //   setPricePerHour(data.price_per_hour.toString());
        //   setDescription(data.description);
        //   setAmenities(data.amenities);
        //   setImage(data.photos[0]);
        //   setIsActive(data.is_active);
        //   setLoading(false);
        // });
        
        const mockPitch = {
          id: parseInt(id),
          name: "Main Football Pitch",
          location: "123 Sports Avenue, Lagos",
          price_per_hour: "8000",
          description: "Professional football pitch with floodlights and changing rooms",
          amenities: ["Floodlights", "Changing Rooms", "Parking", "Showers"],
          photos: ["https://images.unsplash.com/photo-1540442588252-6b93036098a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"],
          is_active: true
        };
        
        setPitchName(mockPitch.name);
        setLocation(mockPitch.location);
        setPricePerHour(mockPitch.price_per_hour.toString());
        setDescription(mockPitch.description);
        setAmenities(mockPitch.amenities);
        setImage(mockPitch.photos[0]);
        setIsActive(mockPitch.is_active);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  // Add this function for image selection
  const selectImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Set the selected image
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!pitchName.trim()) {
      Alert.alert("Error", "Please enter a pitch name");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    if (!pricePerHour.trim()) {
      Alert.alert("Error", "Please enter a price per hour");
      return;
    }

    const price = parseFloat(pricePerHour);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setSubmitting(true);

    try {
      // In a real app, you would save the data to your backend:
      // await updatePitch({
      //   id,
      //   name: pitchName,
      //   location,
      //   price_per_hour: price,
      //   description,
      //   amenities,
      //   photo: image,
      //   is_active: isActive
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Success", "Pitch updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating pitch:", error);
      Alert.alert("Error", "Failed to update pitch. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00CC66" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading pitch data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 16,
          paddingHorizontal: 24,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 16, color: "#000" }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
          Edit Pitch
        </Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 16, color: submitting ? "#999" : "#00CC66" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 24, textAlign: "center" }}>
            Update the details below to modify your pitch
          </Text>

          {/* Image Picker */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
              Pitch Image
            </Text>
            <TouchableOpacity
              onPress={selectImage}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#ddd",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
            >
              {image ? (
                <View style={{ alignItems: "center" }}>
                  <Image 
                    source={{ uri: image }} 
                    style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 8 }} 
                  />
                  <Text style={{ fontSize: 14, color: "#00CC66" }}>
                    Tap to change image
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 48, color: "#999" }}>📷</Text>
                  <Text style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
                    Tap to select an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Pitch Name */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
              Pitch Name *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#000",
                }}
                placeholder="Enter pitch name"
                placeholderTextColor="#999"
                value={pitchName}
                onChangeText={setPitchName}
              />
            </View>
          </View>

          {/* Location */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
              Location *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#000",
                }}
                placeholder="Enter location"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Price per Hour */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
              Price per Hour (₦) *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#000",
                }}
                placeholder="Enter price per hour"
                placeholderTextColor="#999"
                value={pricePerHour}
                onChangeText={setPricePerHour}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
              Description
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                backgroundColor: "#f5f5f5",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#000",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
                placeholder="Enter pitch description"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Amenities */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
              Amenities
            </Text>
            
            {/* Add amenity input */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 12,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#000",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  marginRight: 8,
                }}
                placeholder="Add an amenity"
                placeholderTextColor="#999"
                value={newAmenity}
                onChangeText={setNewAmenity}
                onSubmitEditing={addAmenity}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#00CC66",
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={addAmenity}
              >
                <Text style={{ fontSize: 20, color: "#fff" }}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Amenities list */}
            {amenities.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
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
                    <Text style={{ fontSize: 14, color: "#000", marginRight: 6 }}>
                      {amenity}
                    </Text>
                    <TouchableOpacity onPress={() => removeAmenity(amenity)}>
                      <Text style={{ fontSize: 16, color: "#ff0000" }}>×</Text>
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
              backgroundColor: "#f5f5f5",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 4 }}>
                Pitch Status
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>
                {isActive ? "Pitch is visible to customers" : "Pitch is hidden from customers"}
              </Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#ccc", true: "#00CC66" }}
              thumbColor={isActive ? "#fff" : "#f4f3f4" }
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: submitting ? "#999" : "#00CC66",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "bold" }}>
              {submitting ? "Updating Pitch..." : "Update Pitch"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}