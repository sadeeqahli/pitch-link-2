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
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Save,
  Building,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import * as ImagePicker from "expo-image-picker";

export default function EditPitch() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [fontLoadError, setFontLoadError] = useState(false);

  // Form state
  const [pitchName, setPitchName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [fontsLoaded, fontLoadErrorResult] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [fontLoadTimeout, setFontLoadTimeout] = useState(false);

  useEffect(() => {
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

  // Timeout fallback for font loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFontLoadTimeout(true);
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timer);
  }, []);

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
    footballDark: "#059142",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    inputFocus: "#00CC66",
  };

  // Mock data for demonstration - REPLACE THIS WITH REAL DATA FETCHING
  useEffect(() => {
    if (id) {
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
      // });
      
      // Simulate fetching pitch data
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
    }
  }, [id]);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
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

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: IconComponent,
    keyboardType = "default",
    multiline = false,
    numberOfLines = 1,
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: fontLoadError ? "normal" : "Poppins_500Medium",
          fontSize: 16,
          color: colors.primary,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 16 : 12,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        }}
      >
        <IconComponent size={20} color={colors.secondary} style={{ marginRight: 12, marginTop: multiline ? 4 : 0 }} />
        <TextInput
          style={{
            flex: 1,
            fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
            fontSize: 16,
            color: colors.primary,
            minHeight: multiline ? 80 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.secondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
    </View>
  );

  // Show loading indicator while fonts are loading and no error
  // Also show content after timeout to prevent infinite loading
  if ((!fontsLoaded && !fontLoadError) && !fontLoadTimeout) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.footballGreen} />
        <Text style={{ marginTop: 10, color: colors.secondary }}>Loading...</Text>
      </View>
    );
  }

  // If there's a font loading error or timeout, continue with system fonts
  if (fontLoadError || fontLoadTimeout) {
    console.log("Using system fonts due to font loading error or timeout");
  }

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
          borderBottomWidth: showHeaderBorder ? 1 : 0,
          borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
          shadowColor: showHeaderBorder ? (isDark ? "#000000" : "#000000") : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: showHeaderBorder ? (isDark ? 0.3 : 0.1) : 0,
          shadowRadius: showHeaderBorder ? 8 : 0,
          elevation: showHeaderBorder ? 3 : 0,
          zIndex: 10,
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
              fontFamily: fontLoadError ? "normal" : "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Edit Pitch
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={{ padding: 4 }}
          >
            <Save size={24} color={submitting ? colors.secondary : colors.footballGreen} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
              fontSize: 16,
              color: colors.secondary,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Update the details below to modify your pitch
          </Text>

          {/* Image Picker */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: fontLoadError ? "normal" : "Poppins_500Medium",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Pitch Image
            </Text>
            <TouchableOpacity
              onPress={selectImage}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.inputBorder,
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
                  <Text
                    style={{
                      fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
                      fontSize: 14,
                      color: colors.footballGreen,
                    }}
                  >
                    Tap to change image
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <ImageIcon size={48} color={colors.secondary} />
                  <Text
                    style={{
                      fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                      marginTop: 8,
                    }}
                  >
                    Tap to select an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <InputField
            label="Pitch Name *"
            value={pitchName}
            onChangeText={setPitchName}
            placeholder="Enter pitch name"
            icon={Building}
          />

          <InputField
            label="Location *"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
            icon={MapPin}
          />

          <InputField
            label="Price per Hour (₦) *"
            value={pricePerHour}
            onChangeText={setPricePerHour}
            placeholder="Enter price per hour"
            icon={DollarSign}
            keyboardType="numeric"
          />

          <InputField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter pitch description"
            icon={Building}
            multiline={true}
            numberOfLines={3}
          />

          {/* Amenities */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: fontLoadError ? "normal" : "Poppins_500Medium",
                fontSize: 16,
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
                  fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
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
                        fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
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
                  fontFamily: fontLoadError ? "normal" : "Poppins_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                Pitch Status
              </Text>
              <Text
                style={{
                  fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
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
                thumbColor={isActive ? "#FFFFFF" : "#f4f3f4" }
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: submitting ? colors.secondary : colors.footballGreen,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 8,
            }}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Save size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontFamily: fontLoadError ? "normal" : "Poppins_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              {submitting ? "Updating Pitch..." : "Update Pitch"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}