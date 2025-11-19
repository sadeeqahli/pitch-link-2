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
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Add DatePicker component
const DatePicker = ({ label, value, onChange }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#9CA3AF" : "#6B7280",
    cardBg: isDark ? "#1E1E1E" : "#FFFFFF",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    primaryGreen: "#00FF88",
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
          fontFamily: "Inter_500Medium",
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
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: colors.primary,
          }
}
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
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [fontLoadError, setFontLoadError] = useState(false);

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
          _id: 1,
          name: "Pitch A",
          location: "Main Field",
          price_per_hour: 15000,
          is_active: true
        },
        {
          _id: 2,
          name: "Pitch B",
          location: "East Wing",
          price_per_hour: 20000,
          is_active: true
        },
        {
          _id: 3,
          name: "Pitch C",
          location: "West Wing",
          price_per_hour: 18000,
          is_active: false
        }
      ];

      setPitches(mockPitches);
      if (mockPitches.length > 0) {
        // Set the first active pitch as selected
        const firstActivePitch = mockPitches.find(pitch => pitch.is_active);
        if (firstActivePitch) {
          setSelectedPitch(firstActivePitch);
        }
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
      Alert.alert("Error", "Failed to load pitches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const handleSubmit = async () => {
    const allFieldsFilled =
      selectedPitch &&
      playerName.trim() &&
      playerEmail.trim() &&
      playerPhone.trim() &&
      bookingDate.trim() &&
      startTime.trim() &&
      endTime.trim();

    if (!allFieldsFilled) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(playerEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(playerPhone)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      Alert.alert("Error", "Please enter valid time in HH:MM format");
      return;
    }

    setSubmitting(true);

    try {
      // Create booking object
      const newBooking = {
        id: Date.now().toString(),
        pitch_id: selectedPitch._id,
        pitch_name: selectedPitch.name,
        player_name: playerName.trim(),
        player_email: playerEmail.trim(),
        player_phone: playerPhone.trim(),
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_amount: selectedPitch.price_per_hour,
        payment_status: "pending",
        created_at: new Date().toISOString(),
      };

      // Save booking using storage utility
      bookingsStorage.addBooking(newBooking);

      // Show success toast
      toast.success("Booking created successfully!");

      // Navigate back to dashboard
      router.push("/dashboard");
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
          fontFamily: "Inter_500Medium",
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
            fontFamily: "Inter_400Regular",
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
        <ActivityIndicator size="large" color={colors.primaryGreen} />
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
        <ActivityIndicator size="large" color={colors.primaryGreen} />
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
          backgroundColor: colors.primaryGreen,
          opacity: 0.1,
        }}
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
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
                fontFamily: "Inter_700Bold",
                fontSize: 28,
                color: colors.primary,
              }}
            >
              Add Manual Booking
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Create booking for walk-in customer
            </Text>
          </View>

          <View style={{ width: 32 }} /> {/* Spacer for alignment */}
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
          {/* Pitch Selection */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
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
              marginBottom: 24,
            }}
          >
            <Building size={20} color={colors.secondary} style={{ marginRight: 12 }} />
            <Picker
              selectedValue={selectedPitch?._id}
              style={{ flex: 1, color: colors.primary }}
              onValueChange={(itemValue) => {
                const pitch = pitches.find(p => p._id === itemValue);
                setSelectedPitch(pitch);
              }}
            >
              {pitches.filter(pitch => pitch.is_active).map((pitch) => (
                <Picker.Item
                  key={pitch._id}
                  label={`${pitch.name} - ₦${parseFloat(pitch.price_per_hour || 0).toLocaleString()}/hr`}
                  value={pitch._id}
                />
              ))}
            </Picker>
          </View>

          {/* Player Information */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Player Information
          </Text>

          <InputField
            label="Full Name *"
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter player's full name"
            icon={User}
          />

          <InputField
            label="Email Address *"
            value={playerEmail}
            onChangeText={setPlayerEmail}
            placeholder="Enter player's email"
            icon={Mail}
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number *"
            value={playerPhone}
            onChangeText={setPlayerPhone}
            placeholder="Enter player's phone number"
            icon={Phone}
            keyboardType="phone-pad"
          />

          {/* Booking Details */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Booking Details
          </Text>

          <DatePicker label="Booking Date *" value={bookingDate} onChange={setBookingDate} />

          <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Start Time *
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
                <Clock size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <TextInput
                  style={{
                    flex: 1,
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.secondary}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                End Time *
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
                <Clock size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <TextInput
                  style={{
                    flex: 1,
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.secondary}
                />
              </View>
            </View>
          </View>

          {/* Booking Summary */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Booking Summary
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.secondary,
                }}
              >
                Pitch:
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                {selectedPitch?.name || "Not selected"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.secondary,
                }}
              >
                Date:
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                {bookingDate || "Not selected"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.secondary,
                }}
              >
                Time:
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                {startTime || "00:00"} - {endTime || "00:00"}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: colors.inputBorder,
                marginVertical: 16,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                }}
              >
                Total Amount:
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  color: colors.primaryGreen,
                }}
              >
                ₦{calculateTotalAmount().toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.lightGray,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={() => router.back()}
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
                {submitting ? "Creating..." : "Create Booking"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}