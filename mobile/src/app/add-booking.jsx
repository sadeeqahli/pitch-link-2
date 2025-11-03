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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Plus,
  ChevronDown,
  Building,
} from "lucide-react-native";
import { bookingsStorage } from "../utils/bookingStorage";
import { useRouter } from "expo-router";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { toast } from "sonner-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Use the correct Picker import
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

// Add DatePicker component
const DatePicker = ({ label, value, onChange }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    cardBg: isDark ? "#1F2937" : "#FFFFFF",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    footballGreen: "#00CC66",
  };

  const openDatePicker = () => {
    // For now, we'll just show instructions since we don't have a date picker library
    Alert.alert(
      "Date Selection",
      "Please enter the date in YYYY-MM-DD format (e.g., 2023-12-25)",
      [
        { text: "OK" }
      ]
    );
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: colors.primary,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.cardBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        onPress={openDatePicker}
      >
        <Calendar
          size={20}
          color={colors.secondary}
          style={{ marginRight: 12 }}
        />
        <TextInput
          style={{
            flex: 1,
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: colors.primary,
          }}
          value={value}
          onChangeText={onChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function AddBooking() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [fontsLoaded, fontLoadErrorResult] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [fontLoadError, setFontLoadError] = useState(false);

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

  useEffect(() => {
    fetchPitches();
    // Set default date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setBookingDate(`${year}-${month}-${day}`);
    
    // Set loading to false immediately to show the form
    setLoading(false);
    
    // Check for font loading errors (but don't block the UI)
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

  const fetchPitches = async () => {
    try {
      // Mock data instead of API call
      const mockPitches = [
        {
          id: 1,
          name: "Pitch A",
          location: "Main Field",
          price_per_hour: 15000,
          is_active: true
        },
        {
          id: 2,
          name: "Pitch B",
          location: "East Wing",
          price_per_hour: 20000,
          is_active: true
        },
        {
          id: 3,
          name: "Pitch C",
          location: "West Wing",
          price_per_hour: 18000,
          is_active: false
        }
      ];

      setPitches(mockPitches);
      if (mockPitches.length > 0) {
        setSelectedPitch(mockPitches[0]); // Set the first pitch as selected
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
      // Still set some mock data even if there's an error
      const fallbackPitches = [
        {
          id: 1,
          name: "Main Football Pitch",
          location: "123 Sports Avenue, Lagos",
          price_per_hour: 15000,
          is_active: true
        }
      ];
      setPitches(fallbackPitches);
      setSelectedPitch(fallbackPitches[0]);
    }
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const handleSubmit = async () => {
    // Validation
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter the player's name");
      return;
    }

    if (!playerPhone.trim() && !playerEmail.trim()) {
      Alert.alert(
        "Error",
        "Please enter either a phone number or email address",
      );
      return;
    }

    if (!bookingDate) {
      Alert.alert("Error", "Please select a booking date");
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingDate)) {
      Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    // Validate that date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);
    if (selectedDate < today) {
      Alert.alert("Error", "Booking date cannot be in the past");
      return;
    }

    if (!startTime || !endTime) {
      Alert.alert("Error", "Please select start and end times");
      return;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert("Error", "Please enter valid times in HH:MM format");
      return;
    }

    if (!selectedPitch) {
      Alert.alert("Error", "Please select a pitch");
      return;
    }

    setSubmitting(true);

    try {
      // Calculate total amount (simplified calculation)
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diffHours = (end - start) / (1000 * 60 * 60);
      const totalAmount = Math.max(0, diffHours * selectedPitch.price_per_hour);

      // Create booking object (mock data only)
      const newBooking = {
        id: Date.now().toString(),
        player_name: playerName,
        pitch_name: selectedPitch.name,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_amount: totalAmount.toString(),
        payment_status: "confirmed",
        player_phone: playerPhone,
        player_email: playerEmail,
        pitch_location: selectedPitch.location,
        created_at: new Date().toISOString()
      };

      // Show success toast (mock data only, no actual storage)
      toast.success("Booking created successfully!");

      // Navigate back to dashboard
      router.push("/(tabs)/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
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
  }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
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
          borderWidth: 1,
          borderColor: colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 16 : 12,
        }}
      >
        {IconComponent && (
          <IconComponent
            size={20}
            color={colors.secondary}
            style={{ marginRight: 12, marginTop: multiline ? 4 : 0 }}
          />
        )}
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
        />
      </View>
    </View>
  );

  // Handle font loading states more gracefully
  if (!fontsLoaded && !fontLoadError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.footballGreen} />
        <Text style={{ fontSize: 16, color: colors.secondary, marginTop: 10 }}>
          Loading fonts...
        </Text>
      </View>
    );
  }

  // If there's a font loading error, continue with system fonts
  if (fontLoadError) {
    console.log("Using system fonts due to font loading error");
  }

  // Remove loading state since we're using mock data
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.footballGreen} />
        <Text style={{ fontSize: 16, color: colors.secondary, marginTop: 10 }}>
          Loading form...
        </Text>
      </View>
    );
  }

  // Calculate total amount based on selected pitch and time duration
  const calculateTotalAmount = () => {
    if (!selectedPitch || !startTime || !endTime) return 0;
    
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    
    // Handle case where end time is next day (e.g., 22:00 to 02:00)
    let diffHours;
    if (end <= start) {
      diffHours = 24 - (start - end) / (1000 * 60 * 60);
    } else {
      diffHours = (end - start) / (1000 * 60 * 60);
    }
    
    return Math.max(0, diffHours * selectedPitch.price_per_hour);
  };

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior="padding"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background pattern */}
      <View
        style={{
          position: "absolute",
          top: -100,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.footballGreen,
          opacity: 0.1,
        }}
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 24,
          borderBottomWidth: showHeaderBorder ? 1 : 0,
          borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
          zIndex: 1000,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Add Manual Booking
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Create booking for walk-in customer
            </Text>
          </View>

          <View style={{ width: 32 }} />
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
          {/* Pitch Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Select Pitch
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Building size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <Picker
                selectedValue={selectedPitch ? selectedPitch.id : null}
                style={{ flex: 1, color: colors.primary }}
                onValueChange={(itemValue) => {
                  const pitch = pitches.find(p => p.id === itemValue);
                  setSelectedPitch(pitch);
                }}
              >
                {pitches.map((pitch) => (
                  <Picker.Item
                    key={pitch.id}
                    label={`${pitch.name} – ₦${parseFloat(pitch.price_per_hour).toLocaleString()}/hr`}
                    value={pitch.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {/* Player Information */}
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Player Information
          </Text>

          <InputField
            label="Player Name *"
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter player's full name"
            icon={User}
          />

          <InputField
            label="Phone Number"
            value={playerPhone}
            onChangeText={setPlayerPhone}
            placeholder="Enter phone number"
            icon={Phone}
            keyboardType="phone-pad"
          />

          <InputField
            label="Email Address"
            value={playerEmail}
            onChangeText={setPlayerEmail}
            placeholder="Enter email address"
            icon={Mail}
            keyboardType="email-address"
          />

          {/* Booking Details */}
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            Booking Details
          </Text>

          <InputField
            label="Booking Date *"
            value={bookingDate}
            onChangeText={setBookingDate}
            placeholder="YYYY-MM-DD"
            icon={Calendar}
            isDate={true}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Start Time *"
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                icon={Clock}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label="End Time *"
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                icon={Clock}
              />
            </View>
          </View>

          {/* Total Amount */}
          {selectedPitch && startTime && endTime && (
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                borderWidth: 2,
                borderColor: colors.footballGreen,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 4,
                    }}
                  >
                    Total Amount
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 28,
                      color: colors.footballGreen,
                    }}
                  >
                    ₦{Math.round(calculateTotalAmount()).toLocaleString()}
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: colors.footballGreen,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DollarSign size={24} color="#FFFFFF" />
                </View>
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: submitting
                ? colors.secondary
                : colors.footballGreen,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 8,
            }}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              {submitting ? "Creating Booking..." : "Create Booking"}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            * Required fields
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}