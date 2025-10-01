import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
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
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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

  // Form state
  const [pitchName, setPitchName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

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

  // Mock data for demonstration
  useEffect(() => {
    if (id) {
      // Simulate fetching pitch data
      const mockPitch = {
        id: parseInt(id),
        name: "Pitch A",
        location: "Main Field",
        price_per_hour: "15000",
        description: "Premium football pitch with excellent facilities",
        photos: ["https://example.com/pitch-a.jpg"]
      };
      
      setPitchName(mockPitch.name);
      setLocation(mockPitch.location);
      setPricePerHour(mockPitch.price_per_hour.toString());
      setDescription(mockPitch.description);
      setImage(mockPitch.photos[0]);
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
          fontFamily: "Poppins_500Medium",
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
            fontFamily: "Poppins_400Regular",
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

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Text>Loading...</Text>
      </View>
    );
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4, marginRight: 16 }}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Edit Pitch
          </Text>
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
              fontFamily: "Poppins_400Regular",
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
                fontFamily: "Poppins_500Medium",
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
                  <ImageIcon 
                    source={{ uri: image }} 
                    style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 8 }} 
                  />
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
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
                      fontFamily: "Poppins_400Regular",
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
                fontFamily: "Poppins_600SemiBold",
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