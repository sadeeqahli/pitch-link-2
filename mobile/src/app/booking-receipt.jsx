import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Printer,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CheckCircle,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { bookingsStorage } from "../utils/bookingStorage";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function BookingReceipt() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

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
    footballDark: "#059142",
  };

  useEffect(() => {
    // Load booking data
    loadBooking();
    
    // Check for font loading errors
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [id, fontLoadErrorResult]);

  const loadBooking = () => {
    if (id) {
      try {
        const allBookings = bookingsStorage.getAllBookings();
        const foundBooking = allBookings.find(b => b.id === id);
        
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          Alert.alert("Error", "Booking not found");
          router.back();
        }
      } catch (error) {
        console.error("Error loading booking:", error);
        Alert.alert("Error", "Failed to load booking details");
        router.back();
      }
    }
    setLoading(false);
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    Alert.alert(
      "Print Receipt",
      "In a real app, this would connect to a printer or generate a PDF. For now, you can take a screenshot of this receipt.",
      [
        { text: "OK" }
      ]
    );
  };

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
          Loading receipt...
        </Text>
      </View>
    );
  }

  // If there's a font loading error, continue with system fonts
  if (fontLoadError) {
    console.log("Using system fonts due to font loading error");
  }

  if (loading || !booking) {
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
          Loading booking details...
        </Text>
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
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
            Booking Receipt
          </Text>
          <TouchableOpacity
            onPress={handlePrint}
            style={{ padding: 4 }}
          >
            <Printer size={24} color={colors.primaryGreen} />
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
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Receipt Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <CheckCircle size={64} color={colors.success} />
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 24,
                color: colors.success,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Payment Confirmed
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Receipt for booking #{booking.id}
            </Text>
          </View>

          {/* Booking Details */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
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
                marginBottom: 12,
              }}
            >
              Booking Details
            </Text>

            {/* Player Name */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              <User size={18} color={colors.secondary} style={{ marginRight: 10 }} />
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginBottom: 2,
                  }}
                >
                  Player Name
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {booking.player_name}
                </Text>
              </View>
            </View>

            {/* Pitch Name */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              <MapPin size={18} color={colors.secondary} style={{ marginRight: 10 }} />
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginBottom: 2,
                  }}
                >
                  Pitch
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {booking.pitch_name}
                </Text>
              </View>
            </View>

            {/* Booking Date */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              <Calendar size={18} color={colors.secondary} style={{ marginRight: 10 }} />
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginBottom: 2,
                  }}
                >
                  Date
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {formatDate(booking.booking_date)}
                </Text>
              </View>
            </View>

            {/* Time */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              <Clock size={18} color={colors.secondary} style={{ marginRight: 10 }} />
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginBottom: 2,
                  }}
                >
                  Time
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {booking.start_time} - {booking.end_time}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
              }}
            >
              <MapPin size={18} color={colors.secondary} style={{ marginRight: 10 }} />
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                    color: colors.secondary,
                    marginBottom: 2,
                  }}
                >
                  Location
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {booking.pitch_location || "Not specified"}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Information */}
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
                fontSize: 20,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Customer Information
            </Text>

            {/* Phone */}
            {booking.player_phone && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                }}
              >
                <Phone size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Phone
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  >
                    {booking.player_phone}
                  </Text>
                </View>
              </View>
            )}

            {/* Email */}
            {booking.player_email && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  paddingVertical: 8,
                }}
              >
                <Mail size={20} color={colors.secondary} style={{ marginRight: 12, marginTop: 2 }} />
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Email
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.primary,
                      flexWrap: "wrap",
                      flexShrink: 1,
                    }}
                    numberOfLines={2}
                  >
                    {booking.player_email}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Payment Summary */}
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
                fontSize: 20,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Payment Summary
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Pitch Booking
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                ₦{parseFloat(booking.total_amount || 0).toLocaleString()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                borderTopWidth: 1,
                borderTopColor: isDark ? "#2C2C2C" : "#E5E7EB",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                }}
              >
                Total Amount
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primaryGreen,
                }}
              >
                ₦{parseFloat(booking.total_amount || 0).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Receipt Info */}
          <View
            style={{
              backgroundColor: colors.lightGray,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Receipt ID: {booking.id}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Generated on {new Date().toLocaleDateString("en-GB")}
            </Text>
          </View>

          {/* Print Button */}
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
            onPress={handlePrint}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primaryGreen + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Printer size={24} color={colors.primaryGreen} />
            </View>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              Print Receipt
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}