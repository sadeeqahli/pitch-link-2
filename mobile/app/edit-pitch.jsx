import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  Trash2,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditPitch() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [fontLoadError, setFontLoadError] = useState(false);

  // Form state
  // Form state - converted to refs for performance
  const pitchNameRef = useRef("");
  const locationRef = useRef("");
  const pricePerHourRef = useRef("");
  const descriptionRef = useRef("");
  const [dataLoaded, setDataLoaded] = useState(false);
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

  const colors = useMemo(() => ({
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
  }), [isDark]);

  // Fetch pitch data
  useEffect(() => {
    if (id) {
      loadPitchData();
    }
  }, [id]);

  const loadPitchData = useCallback(async () => {
    try {
      const storedPitches = await AsyncStorage.getItem('pitches');
      if (storedPitches) {
        const pitches = JSON.parse(storedPitches);
        const pitch = pitches.find(p => p._id === id);
        if (pitch) {
          if (pitch) {
            pitchNameRef.current = pitch.name;
            locationRef.current = pitch.location;
            pricePerHourRef.current = pitch.price_per_hour.toString();
            descriptionRef.current = pitch.description;
            setAmenities(pitch.amenities || []);
            setImages(pitch.photos || []);
            setIsActive(pitch.is_active);
            setDataLoaded(true);
          }
        }
      }
    } catch (error) {
      console.error("Error loading pitch data:", error);
      Alert.alert("Error", "Failed to load pitch data. Please try again.");
    }
  }, [id]);

  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  }, []);

  const handleSubmit = useCallback(async () => {
    const pitchName = pitchNameRef.current;
    const location = locationRef.current;
    const pricePerHour = pricePerHourRef.current;
    const description = descriptionRef.current;

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

    if (images.length < 3) {
      Alert.alert("Error", "Please upload at least 3 images");
      return;
    }

    setSubmitting(true);

    try {
      // Update the pitch in AsyncStorage
      const storedPitches = await AsyncStorage.getItem('pitches');
      if (storedPitches) {
        const pitches = JSON.parse(storedPitches);
        const updatedPitches = pitches.map(pitch => {
          if (pitch._id === id) {
            return {
              ...pitch,
              name: pitchName.trim(),
              location: location.trim(),
              price_per_hour: price,
              description: description.trim(),
              amenities,
              photos: images,
              is_active: isActive
            };
          }
          return pitch;
        });

        await AsyncStorage.setItem('pitches', JSON.stringify(updatedPitches));

        Alert.alert("Success", "Pitch updated successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/pitches"),
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating pitch:", error);
      Alert.alert("Error", "Failed to update pitch. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [amenities, images, isActive, id, router]);

const handleDelete = useCallback(async () => {
  Alert.alert(
    "Delete Pitch",
    "Are you sure you want to delete this pitch? This action cannot be undone.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const storedPitches = await AsyncStorage.getItem('pitches');
            if (storedPitches) {
              const pitches = JSON.parse(storedPitches);
              const updatedPitches = pitches.filter(pitch => pitch._id !== id);
              await AsyncStorage.setItem('pitches', JSON.stringify(updatedPitches));
              router.push("/(tabs)/pitches");
            }
          } catch (error) {
            console.error("Error deleting pitch:", error);
            Alert.alert("Error", "Failed to delete pitch. Please try again.");
          }
        }
      }
    ]
  );
}, [id, router]);

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

const addAmenity = useCallback(() => {
  if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
    setAmenities(prev => [...prev, newAmenity.trim()]);
    setNewAmenity("");
  }
}, [newAmenity, amenities]);

const removeAmenity = useCallback((amenityToRemove) => {
  setAmenities(prev => prev.filter(amenity => amenity !== amenityToRemove));
}, []);

// Optimize input handlers
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

const handleDescriptionChange = useCallback((text) => {
  descriptionRef.current = text;
}, []);

const handleNewAmenityChange = useCallback((text) => {
  setNewAmenity(text);
}, []);

const handleActiveChange = useCallback((value) => {
  setIsActive(value);
}, []);

const InputField = useMemo(() => React.memo(({
  label,
  defaultValue,
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
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  </View>
)), [colors, fontLoadError]);

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

if (!dataLoaded) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.white, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.footballGreen} />
      <Text style={{ marginTop: 10, color: colors.secondary }}>Loading pitch data...</Text>
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
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/pitches")}
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
          Update pitch details
        </Text>

        {/* Form Sections - Same as Add Pitch but pre-filled with existing data */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: fontLoadError ? "normal" : "Poppins_600SemiBold",
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
            label="Price per Hour (₦) *"
            defaultValue={pricePerHourRef.current}
            onChangeText={handlePriceChange}
            placeholder="Enter price per hour"
            icon={DollarSign}
            keyboardType="numeric"
          />

          <InputField
            label="Description"
            defaultValue={descriptionRef.current}
            onChangeText={handleDescriptionChange}
            placeholder="Enter pitch description"
            icon={Building}
            multiline={true}
            numberOfLines={3}
          />
        </View>

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
              onChangeText={handleNewAmenityChange}
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

        {/* Image Upload Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: fontLoadError ? "normal" : "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Pitch Images
          </Text>
          <Text
            style={{
              fontFamily: fontLoadError ? "normal" : "Poppins_400Regular",
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
                fontFamily: fontLoadError ? "normal" : "Poppins_500Medium",
                fontSize: 16,
                color: colors.secondary,
              }}
            >
              {images.length >= 3 ? "Maximum Images Added" : "Add Images"}
            </Text>
          </TouchableOpacity>
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
              onValueChange={handleActiveChange}
              trackColor={{
                false: colors.lightGray,
                true: colors.footballGreen,
              }}
              thumbColor={isActive ? "#FFFFFF" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          {/* Delete Button (only for edit mode) */}
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.error,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontFamily: fontLoadError ? "normal" : "Poppins_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Delete Pitch
            </Text>
          </TouchableOpacity>

          {/* Update Button */}
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: submitting ? colors.secondary : colors.footballGreen,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
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
              {submitting ? "Updating..." : "Update Pitch"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </View>
);
}