import React, { useState } from "react";
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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Plus,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function AddBookingTest() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    primary: isDark ? "#FFFFFF" : "#000000",
    secondary: isDark ? "#CCCCCC" : "#6B7280",
    lightGray: isDark ? "#2C2C2C" : "#F9FAFB",
    white: isDark ? "#121212" : "#FFFFFF",
    cardBg: isDark ? "#1F2937" : "#FFFFFF",
    footballGreen: "#00CC66",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
  };

  // Form state
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = () => {
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter the player's name");
      return;
    }

    Alert.alert("Success", "Booking would be created here!");
  };

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
            onPress={() => router.back()}
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
              Add Manual Booking
            </Text>
            <Text
              style={{
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
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Player Information
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Player Name *
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
              <User
                size={20}
                color={colors.secondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={playerName}
                onChangeText={setPlayerName}
                placeholder="Enter player's full name"
                placeholderTextColor={colors.secondary}
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Phone Number
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
              <Phone
                size={20}
                color={colors.secondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }
}
                value={playerPhone}
                onChangeText={setPlayerPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Email Address
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
              <Mail
                size={20}
                color={colors.secondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={playerEmail}
                onChangeText={setPlayerEmail}
                placeholder="Enter email address"
                placeholderTextColor={colors.secondary}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Booking Details */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.primary,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            Booking Details
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Booking Date *
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
              <Calendar
                size={20}
                color={colors.secondary}
                style={{ marginRight: 12 }}
              />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={bookingDate}
                onChangeText={setBookingDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.secondary}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
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
                  <Clock
                    size={20}
                    color={colors.secondary}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
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
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
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
                  <Clock
                    size={20}
                    color={colors.secondary}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
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
              marginTop: 8,
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