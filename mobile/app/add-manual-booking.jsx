import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  DollarSign,
  Plus,
  Building,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { toast } from "sonner-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Use the correct Picker import

export default function AddManualBooking() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loadingPitches, setLoadingPitches] = useState(true);

  // Pitch options
  const [pitchOptions, setPitchOptions] = useState([]);

  const colors = useMemo(() => ({
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    lightGray: isDark ? "#2C2C2C" : "#F9FAFB",
    white: isDark ? "#121212" : "#FFFFFF",
    cardBg: isDark ? "#1F2937" : "#FFFFFF",
    success: "#00CC66",
    warning: "#F59E0B",
    error: "#EF4444",
    primaryBlue: "#0066CC",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
  }), [isDark]);

  useEffect(() => {
    // Load pitches from AsyncStorage
    loadPitches();
    
    // Set default date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setBookingDate(`${year}-${month}-${day}`);
  }, []);

  const loadPitches = useCallback(async () => {
    try {
      setLoadingPitches(true);
      const storedPitches = await AsyncStorage.getItem('pitches');
      if (storedPitches) {
        const parsedPitches = JSON.parse(storedPitches);
        setPitchOptions(parsedPitches);
        // Set default pitch to the first one if available
        if (parsedPitches.length > 0) {
          setSelectedPitch(parsedPitches[0]);
        }
      } else {
        // Fallback to default pitches if none are stored
        const defaultPitches = [
          { _id: 1, name: "Pitch A", price_per_hour: 15000 },
          { _id: 2, name: "Pitch B", price_per_hour: 10000 },
          { _id: 3, name: "Pitch C", price_per_hour: 20000 },
        ];
        setPitchOptions(defaultPitches);
        if (defaultPitches.length > 0) {
          setSelectedPitch(defaultPitches[0]);
        }
      }
    } catch (error) {
      console.error("Error loading pitches:", error);
      // Fallback to default pitches in case of error
      const defaultPitches = [
        { _id: 1, name: "Pitch A", price_per_hour: 15000 },
        { _id: 2, name: "Pitch B", price_per_hour: 10000 },
        { _id: 3, name: "Pitch C", price_per_hour: 20000 },
      ];
      setPitchOptions(defaultPitches);
      if (defaultPitches.length > 0) {
        setSelectedPitch(defaultPitches[0]);
      }
    } finally {
      setLoadingPitches(false);
    }
  }, []);

  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  }, []);

  // Calculate total amount based on selected pitch and time duration
  const calculateTotalAmount = useCallback(() => {
    if (!selectedPitch || !startTime || !endTime) return 0;
    
    // Fix the time format to avoid octal literal issues
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");
    const start = new Date(1970, 0, 1, parseInt(startParts[0]), parseInt(startParts[1]));
    const end = new Date(1970, 0, 1, parseInt(endParts[0]), parseInt(endParts[1]));
    
    // Handle case where end time is next day (e.g., 22:00 to 02:00)
    let diffHours;
    if (end <= start) {
      diffHours = 24 - (start - end) / (1000 * 60 * 60);
    } else {
      diffHours = (end - start) / (1000 * 60 * 60);
    }
    
    return Math.max(0, diffHours * selectedPitch.price_per_hour);
  }, [selectedPitch, startTime, endTime]);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter the player's name");
      return;
    }

    if (!playerPhone.trim() && !playerEmail.trim()) {
      Alert.alert("Error", "Please enter either a phone number or email address");
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

    setSubmitting(true);

    try {
      // Create booking object (mock data only)
      const newBooking = {
        id: Date.now().toString(),
        player_name: playerName,
        player_phone: playerPhone,
        player_email: playerEmail,
        pitch_name: selectedPitch.name,
        pitch_price_per_hour: selectedPitch.price_per_hour,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_amount: calculateTotalAmount(),
        created_at: new Date().toISOString(),
      };

      // Show success toast (mock data only, no actual storage)
      toast.success("Manual booking created successfully.");

      // Navigate back to dashboard
      router.push("/(tabs)/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [playerName, playerPhone, playerEmail, bookingDate, startTime, endTime, selectedPitch, router, calculateTotalAmount]);

  const handleCancel = useCallback(() => {
    router.push("/(tabs)/dashboard");
  }, [router]);

  // Optimize input handlers
  const handlePlayerNameChange = useCallback((text) => {
    setPlayerName(text);
  }, []);

  const handlePlayerPhoneChange = useCallback((text) => {
    setPlayerPhone(text);
  }, []);

  const handlePlayerEmailChange = useCallback((text) => {
    setPlayerEmail(text);
  }, []);

  const handleBookingDateChange = useCallback((text) => {
    setBookingDate(text);
  }, []);

  const handleStartTimeChange = useCallback((text) => {
    setStartTime(text);
  }, []);

  const handleEndTimeChange = useCallback((text) => {
    setEndTime(text);
  }, []);

  const handlePitchChange = useCallback((itemValue) => {
    const pitch = pitchOptions.find(p => p._id === itemValue);
    setSelectedPitch(pitch);
  }, [pitchOptions]);

  const InputField = useCallback(({
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
          fontWeight: "500",
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
  ), [colors]);

  // Precompute picker items to avoid re-rendering
  const pitchPickerItems = useMemo(() => {
    return pitchOptions.map((pitch) => (
      <Picker.Item
        key={pitch._id}
        label={`${pitch.name} - NGN${parseFloat(pitch.price_per_hour || 0).toLocaleString()}/hr`}
        value={pitch._id}
      />
    ));
  }, [pitchOptions]);

  // Show loading indicator while pitches are loading
  if (loadingPitches) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.lightGray,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text style={{ fontSize: 16, color: colors.secondary, marginTop: 10 }}>
          Loading pitches...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 24,
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
              fontWeight: "600",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Add Manual Booking
          </Text>
        </View>
      </View>

      {/* Main Content - Centered Card */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 500,
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Pitch Selection */}
            <Text
              style={{
                fontWeight: "600",
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
                onValueChange={handlePitchChange}
              >
                {pitchPickerItems}
              </Picker>
            </View>

            {/* Player Information */}
            <Text
              style={{
                fontWeight: "600",
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
              onChangeText={handlePlayerNameChange}
              placeholder="Enter player's full name"
              icon={User}
            />

            <InputField
              label="Phone Number"
              value={playerPhone}
              onChangeText={handlePlayerPhoneChange}
              placeholder="Enter phone number"
              icon={Phone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Email Address"
              value={playerEmail}
              onChangeText={handlePlayerEmailChange}
              placeholder="Enter email address"
              icon={Mail}
              keyboardType="email-address"
            />

            {/* Booking Details */}
            <Text
              style={{
                fontWeight: "600",
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
              onChangeText={handleBookingDateChange}
              placeholder="YYYY-MM-DD"
              icon={Calendar}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Start Time *"
                  value={startTime}
                  onChangeText={handleStartTimeChange}
                  placeholder="HH:MM"
                  icon={Clock}
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  label="End Time *"
                  value={endTime}
                  onChangeText={handleEndTimeChange}
                  placeholder="HH:MM"
                  icon={Clock}
                />
              </View>
            </View>

            {/* Total Price Display */}
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 14,
                  color: colors.secondary,
                  marginBottom: 4,
                }}
              >
                Total Price
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 24,
                  color: colors.primaryBlue,
                }}
              >
                NGN{Math.round(calculateTotalAmount()).toLocaleString()}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
                onPress={handleCancel}
                disabled={submitting}
              >
                <Text
                  style={{
                    fontWeight: "600",
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
                  backgroundColor: submitting ? colors.secondary : colors.primaryBlue,
                  borderRadius: 12,
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
                    fontWeight: "600",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  {submitting ? "Creating..." : "Create Booking"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}