import React, { useState, useCallback, useMemo } from "react";
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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Plus,
  Building,
  ChevronDown,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function AddBookingTest() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = useMemo(() => ({
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    lightGray: isDark ? "#2C2C2C" : "#F9FAFB",
    white: isDark ? "#121212" : "#FFFFFF",
    cardBg: isDark ? "#1F2937" : "#FFFFFF",
    footballGreen: "#00CC66",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
  }), [isDark]);

  // Mock pitches data
  const pitches = [
    { id: 1, name: "Main Football Pitch", rate: 15000 },
    { id: 2, name: "Premium Football Pitch", rate: 20000 },
    { id: 3, name: "Standard Football Pitch", rate: 12000 },
  ];

  // Form state
  const [selectedPitch, setSelectedPitch] = useState(pitches[0]);
  const [customerName, setCustomerName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = useCallback(() => {
    if (!selectedPitch || !customerName.trim() || !bookingDate.trim() || !startTime.trim() || !endTime.trim() || !amount.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert("Success", "Booking created successfully!");
    // In a real app, you would submit the data to your backend here
  }, [selectedPitch, customerName, bookingDate, startTime, endTime, amount]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Optimize input handlers
  const handleCustomerNameChange = useCallback((text) => {
    setCustomerName(text);
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

  const handleAmountChange = useCallback((text) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  }, []);

  const handleNotesChange = useCallback((text) => {
    setNotes(text);
  }, []);

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
          fontSize: 14,
          fontWeight: "500",
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
        <IconComponent
          size={20}
          color={colors.secondary}
          style={{ marginRight: 12, marginTop: multiline ? 4 : 0 }}
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.primary,
            minHeight: multiline ? 80 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondary}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    </View>
  ), [colors]);

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
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
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
            onPress={handleBack}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.primary,
              }}
            >
              Add Booking
            </Text>
          </View>

          <View style={{ width: 32 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {/* Form Sections */}
          
          {/* Select Pitch */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
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
              selectedValue={selectedPitch?.id}
              style={{ flex: 1, color: colors.primary }}
              onValueChange={(value) => setSelectedPitch(pitches.find(p => p.id === value))}
            >
              {pitches.map((pitch) => (
                <Picker.Item 
                  key={pitch.id} 
                  label={`${pitch.name} - ₦${pitch.rate}/hr`} 
                  value={pitch.id} 
                />
              ))}
            </Picker>
          </View>

          {/* Customer Information */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Customer Information
          </Text>

          <InputField
            label="Customer Name *"
            value={customerName}
            onChangeText={handleCustomerNameChange}
            placeholder="Customer name"
            icon={User}
          />

          {/* Date & Time */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Date & Time
          </Text>

          <InputField
            label="Booking Date *"
            value={bookingDate}
            onChangeText={handleBookingDateChange}
            placeholder="YYYY-MM-DD"
            icon={Calendar}
          />

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
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

          {/* Payment */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Payment
          </Text>

          <InputField
            label="Amount *"
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Amount"
            icon={DollarSign}
            keyboardType="numeric"
          />

          {/* Notes */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Notes
          </Text>

          <InputField
            label="Special Requests"
            value={notes}
            onChangeText={handleNotesChange}
            placeholder="Add any special requests or notes"
            icon={Mail}
            multiline={true}
          />

          {/* Info Box */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              The customer will receive a confirmation notification with booking details.
            </Text>
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
            <Plus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Create Booking
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}