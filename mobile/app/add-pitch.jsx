import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  Image as ImageIcon,
  X,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
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
  // Form state - converted to refs for performance
  const pitchNameRef = useRef("");
  const locationRef = useRef("");
  const pricePerHourRef = useRef("");
  const [images, setImages] = useState([]);

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

  // Request permissions and select images
  const selectImages = useCallback(async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker for multiple images
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      orderedSelection: true,
      selectionLimit: 3 - images.length, // Limit to 3 images total
      allowsEditing: false,
      quality: 1,
    });

    // Add selected images to state
    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages]);
    }
  }, [images.length]);

  // Remove an image
  const removeImage = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Optimize form handlers
  const handlePitchNameChange = useCallback((text) => {
    pitchNameRef.current = text;
  }, []);

  const handleLocationChange = useCallback((text) => {
    locationRef.current = text;
  }, []);

  const handlePriceChange = useCallback((text) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    pricePerHourRef.current = numericValue;
  }, []);

  const handleSubmit = useCallback(async () => {
    const pitchName = pitchNameRef.current;
    const location = locationRef.current;
    const pricePerHour = pricePerHourRef.current;

    console.log("Form data:", { pitchName, location, pricePerHour, images });

    // Validation
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

    if (images.length < 3) {
      Alert.alert("Error", "Please upload at least 3 images");
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
        photos: images,
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

      // Navigate back to pitches page
      router.push("/(tabs)/pitches");
    } catch (error) {
      console.error("Error creating pitch:", error);
      Alert.alert("Error", "Failed to create pitch. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [images, router]);

  const handleCancel = useCallback(() => {
    router.push("/(tabs)/pitches");
  }, [router]);

  const InputField = useMemo(() => React.memo(({
    label,
    defaultValue,
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
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  )), [colors]);

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

          {/* Form Sections */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 20,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Pitch Information
            </Text>

            <InputField
              label="Pitch Name *"
              defaultValue={pitchNameRef.current}
              onChangeText={handlePitchNameChange}
              placeholder="Enter pitch name"
              icon={Building}
            />

            <InputField
              label="Location *"
              defaultValue={locationRef.current}
              onChangeText={handleLocationChange}
              placeholder="Enter location"
              icon={MapPin}
            />

            <InputField
              label="Price per Hour (NGN) *"
              defaultValue={pricePerHourRef.current}
              onChangeText={handlePriceChange}
              placeholder="Enter price per hour"
              icon={DollarSign}
              keyboardType="numeric"
            />
          </View>

          {/* Image Upload Section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 20,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Pitch Images
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 12,
              }}
            >
              Upload at least 3 images of your pitch ({images.length}/3)
            </Text>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
                {images.map((imageUri, index) => (
                  <View key={index} style={{ width: "30%", margin: "1.66%" }}>
                    <View style={{ position: "relative" }}>
                      <Image
                        source={{ uri: imageUri }}
                        style={{ width: "100%", height: 100, borderRadius: 8 }}
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Add Image Button */}
            <TouchableOpacity
              onPress={selectImages}
              disabled={images.length >= 3}
              style={{
                backgroundColor: images.length >= 3 ? colors.lightGray : colors.cardBg,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                opacity: images.length >= 3 ? 0.6 : 1,
              }}
            >
              <ImageIcon size={20} color={colors.secondary} style={{ marginRight: 8 }} />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.secondary,
                }}
              >
                {images.length >= 3 ? "Maximum Images Added" : "Add Images"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
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
      </ScrollView>
    </View>
  );
}