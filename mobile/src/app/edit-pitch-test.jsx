import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  DollarSign,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditPitchTest() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Form state
  const [pitchName, setPitchName] = useState("Main Football Pitch");
  const [location, setLocation] = useState("123 Sports Avenue, Lagos");
  const [pricePerHour, setPricePerHour] = useState("8000");
  const [description, setDescription] = useState("Professional football pitch with floodlights and changing rooms");
  const [amenities, setAmenities] = useState(["Floodlights", "Changing Rooms", "Parking", "Showers"]);
  const [newAmenity, setNewAmenity] = useState("");
  const [isActive, setIsActive] = useState(true);

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    lightGray: isDark ? "#2C2C2C" : "#F9FAFB",
    white: isDark ? "#121212" : "#FFFFFF",
    cardBg: isDark ? "#1F2937" : "#FFFFFF",
    success: "#00CC66",
    warning: "#F59E0B",
    error: "#EF4444",
    footballGreen: "#00CC66",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
  };

  useEffect(() => {
    if (id) {
      console.log("Editing pitch with ID:", id);
    }
  }, [id]);

  const handleSubmit = () => {
    Alert.alert("Success", "Pitch updated successfully!");
    router.back();
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
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 24,
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: colors.primary,
            }}
          >
            Edit Pitch
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{ padding: 4 }}
          >
            <Save size={24} color={colors.footballGreen} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.secondary,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Update the details below to modify your pitch
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Pitch Name *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
            >
              <Building size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }}
                placeholder="Enter pitch name"
                placeholderTextColor={colors.secondary}
                value={pitchName}
                onChangeText={setPitchName}
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Location *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
            >
              <MapPin size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }}
                placeholder="Enter location"
                placeholderTextColor={colors.secondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Price per Hour (₦) *
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
            >
              <DollarSign size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }}
                placeholder="Enter price per hour"
                placeholderTextColor={colors.secondary}
                value={pricePerHour}
                onChangeText={setPricePerHour}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Description
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
            >
              <Building size={20} color={colors.secondary} style={{ marginRight: 12, marginTop: 4 }} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
                placeholder="Enter pitch description"
                placeholderTextColor={colors.secondary}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Amenities */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
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
                  color: colors.primary,
                  backgroundColor: colors.cardBg,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  marginRight: 8,
                }}
                placeholder="Add an amenity"
                placeholderTextColor={colors.secondary}
                value={newAmenity}
                onChangeText={setNewAmenity}
                onSubmitEditing={addAmenity}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: colors.footballGreen,
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={addAmenity}
              >
                <Plus size={20} color="#FFFFFF" />
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
                      backgroundColor: colors.lightGray,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      marginRight: 8,
                      marginBottom: 8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.primary,
                        marginRight: 6,
                      }}
                    >
                      {amenity}
                    </Text>
                    <TouchableOpacity onPress={() => removeAmenity(amenity)}>
                      <X size={16} color={colors.error} />
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
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                Pitch Status
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                {isActive ? "Pitch is visible to customers" : "Pitch is hidden from customers"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isActive ? (
                <Eye size={20} color={colors.success} style={{ marginRight: 8 }} />
              ) : (
                <EyeOff size={20} color={colors.error} style={{ marginRight: 8 }} />
              )}
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{
                  false: colors.lightGray,
                  true: colors.footballGreen,
                }}
                thumbColor={isActive ? "#FFFFFF" : "#f4f3f4"}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.footballGreen,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={handleSubmit}
          >
            <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Update Pitch
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}