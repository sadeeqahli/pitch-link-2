import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
} from "lucide-react-native";
import { bookingsStorage } from "../../utils/bookingStorage";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function Bookings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [bookings, setBookings] = useState([]);

  // Mock data to replace Convex queries
  const allBookings = bookings;

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
  };

  useEffect(() => {
    // Load bookings from storage
    loadBookings();
    
    // Check for font loading errors
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

  const loadBookings = useCallback(() => {
    try {
      const storedBookings = bookingsStorage.getAllBookings();
      setBookings(storedBookings);
      setLoading(false);
    } catch (error) {
      console.error("Error loading bookings:", error);
      // Fallback to mock data
      setBookings(bookingsStorage.bookings);
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
    setTimeout(() => setRefreshing(false), 1000);
  }, [loadBookings]);

  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  }, []);

  const getStatusColor = useCallback((paymentStatus) => {
    switch (paymentStatus) {
      case "confirmed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "cancelled":
        return colors.error;
      default:
        return colors.secondary;
    }
  }, [colors]);

  const getStatusIcon = useCallback((paymentStatus) => {
    switch (paymentStatus) {
      case "confirmed":
        return CheckCircle;
      case "pending":
        return AlertCircle;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  }, []);

  const handleAddBooking = useCallback(() => {
    router.push("/add-booking");
  }, [router]);

  const BookingCard = useCallback(({ booking }) => {
    const StatusIcon = getStatusIcon(booking.payment_status);

    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: isDark ? "#000000" : "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
        activeOpacity={0.8}
        onPress={() => router.push(`/booking-receipt?id=${booking.id}`)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {booking.player_name}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: colors.primaryGreen,
                marginBottom: 6,
              }}
            >
              {booking.pitch_name}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: colors.primaryGreen,
                marginBottom: 4,
              }}
            >
              ₦{parseFloat(booking.total_amount || 0).toLocaleString()}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: getStatusColor(booking.payment_status) + "20",
              }}
            >
              <StatusIcon size={12} color={getStatusColor(booking.payment_status)} />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 11,
                  color: getStatusColor(booking.payment_status),
                  marginLeft: 4,
                  textTransform: "capitalize",
                }}
              >
                {booking.payment_status}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderTopColor: isDark ? "#2C2C2C" : "#E5E7EB",
            paddingTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Calendar size={14} color={colors.secondary} style={{ marginRight: 6 }} />
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              {new Date(booking.booking_date).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock size={14} color={colors.secondary} style={{ marginRight: 6 }} />
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              {booking.start_time} - {booking.end_time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [colors, isDark, getStatusColor, getStatusIcon, router]);

  const filteredBookings = useMemo(() => {
    return selectedFilter === "all" 
      ? allBookings 
      : allBookings.filter(booking => booking.payment_status === selectedFilter);
  }, [selectedFilter, allBookings]);

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
          Loading bookings...
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
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              color: colors.primary,
            }}
          >
            Bookings
          </Text>
          
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.lightGray,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleAddBooking}
          >
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryGreen} />
        }
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Filter Tabs */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.lightGray,
              borderRadius: 16,
              padding: 4,
              marginBottom: 24,
            }}
          >
            {["all", "confirmed", "pending", "cancelled"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: selectedFilter === filter ? colors.primaryGreen : "transparent",
                  alignItems: "center",
                }}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: selectedFilter === filter ? colors.white : colors.secondary,
                    textTransform: "capitalize",
                  }}
                >
                  {filter === "all" ? "All Bookings" : filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Calendar size={40} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No {selectedFilter === "all" ? "" : selectedFilter} bookings
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {selectedFilter === "all" 
                  ? "You don't have any bookings yet." 
                  : `You don't have any ${selectedFilter} bookings.`}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  marginTop: 16,
                }}
                onPress={handleAddBooking}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Add Booking
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}