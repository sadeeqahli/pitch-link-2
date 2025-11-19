import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Plus,
  Building,
  MapPin,
  DollarSign,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function AddPitch() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Form state
  const [pitchName, setPitchName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#9CA3AF" : "#6B7280",
    lightGray: isDark ? "#1E1E1E" : "#F8F9FA",
    white: isDark ? "#0A0A0A" : "#F8F9FA",
    cardBg: isDark ? "#1E1E1E" : "#FFFFFF",
    success: "#00FF88",
    warning: "#F59E0B",
    error: "#EF4444",
    primaryGreen: "#00FF88",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    inputFocus: "#00FF88",
  };

  useEffect(() => {
    // Any initialization code can go here
  }, []);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const handleSubmit = async () => {
    console.log("Form data:", { pitchName, location, pricePerHour });
    const allFieldsFilled =
      pitchName.trim() && location.trim() && pricePerHour.trim();

    if (!allFieldsFilled) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const price = parseFloat(pricePerHour);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setSubmitting(true);

    try {
      // Create pitch object
      const newPitch = {
        _id: Date.now().toString(),
        name: pitchName.trim(),
        location: location.trim(),
        price_per_hour: price,
        description: "Professional football pitch",
        amenities: ["Floodlights", "Changing Rooms"],
        photos: [
          "https://images.unsplash.com/photo-1540442588252-6b93036098a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        ],
        is_active: true,
        rating: 4.5,
        total_bookings: 0,
      };

      console.log("Creating new pitch:", newPitch);

      // Save to AsyncStorage
      try {
        const existingPitches = await AsyncStorage.getItem('pitches');
        const pitches = existingPitches ? JSON.parse(existingPitches) : [];
        pitches.unshift(newPitch);
        await AsyncStorage.setItem('pitches', JSON.stringify(pitches));
        console.log("Pitch saved to AsyncStorage");
      } catch (storageError) {
        console.log("Error saving to AsyncStorage:", storageError);
      }

      // Show success toast
      toast.success("Pitch added successfully!");

      // Navigate back to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating pitch:", error);
      Alert.alert("Error", "Failed to create pitch. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: IconComponent,
    keyboardType = "default",
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Inter_500Medium",
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
          alignItems: "center",
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: colors.inputBorder,
        }}
      >
        <IconComponent size={20} color={colors.secondary} style={{ marginRight: 12 }} />
        <TextInput
          style={{
            flex: 1,
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: colors.primary,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.secondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
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

  // Always render the content - use system fonts if custom fonts aren't loaded
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
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
            onPress={handleCancel}
            style={{ padding: 4, marginRight: 16 }}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              color: colors.primary,
            }}
          >
            Add New Pitch
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
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 16,
              color: colors.secondary,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Fill in the details below to add a new pitch to your facility
          </Text>

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
            label="Price per Hour (NGN) *"
            value={pricePerHour}
            onChangeText={setPricePerHour}
            placeholder="Enter price per hour"
            icon={DollarSign}
            keyboardType="numeric"
          />

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.lightGray,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={handleCancel}
              disabled={submitting}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: submitting ? colors.secondary : colors.primaryGreen,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Plus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                {submitting ? "Adding..." : "Add Pitch"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}