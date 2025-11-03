import React, { useState, useEffect } from "react";
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
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";



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

  const loadBookings = () => {
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
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const getStatusColor = (paymentStatus) => {
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
  };

  const getStatusIcon = (paymentStatus) => {
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
  };

  const BookingCard = ({ booking }) => {
    const StatusIcon = getStatusIcon(booking.payment_status);

    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
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
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {booking.player_name}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.footballGreen,
                marginBottom: 8,
              }}
            >
              {booking.pitch_name}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.footballGreen,
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
                backgroundColor: getStatusColor(booking.payment_status),
              }}
            >
              <StatusIcon size={12} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 10,
                  color: "#FFFFFF",
                  marginLeft: 4,
                  textTransform: "capitalize",
                }}
              >
                {booking.payment_status || "pending"}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Calendar size={16} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginLeft: 8,
            }}
          >
            {new Date(booking.booking_date).toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Clock size={16} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginLeft: 8,
            }}
          >
            {booking.start_time} - {booking.end_time}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <MapPin size={16} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginLeft: 8,
            }}
          >
            {booking.pitch_location || "Location not specified"}
          </Text>
        </View>

        {booking.player_phone && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Phone size={16} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
                marginLeft: 8,
              }}
            >
              {booking.player_phone}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ title, value, count }) => (
    <TouchableOpacity
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor:
          selectedFilter === value ? colors.footballGreen : colors.lightGray,
        marginRight: 12,
      }}
      onPress={() => setSelectedFilter(value)}
    >
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: selectedFilter === value ? "#FFFFFF" : colors.primary,
        }}
      >
        {title} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

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
          Loading bookings...
        </Text>
      </View>
    );
  }

  // Calculate filter counts
  const todayBookings = allBookings?.filter((b) =>
    b.booking_date.startsWith(new Date().toISOString().split("T")[0]),
  ) || [];
  const upcomingBookings = allBookings?.filter(
    (b) => b.booking_date >= new Date().toISOString().split("T")[0],
  ) || [];
  const pendingBookings = allBookings?.filter(
    (b) => b.payment_status === "pending",
  ) || [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background pattern */}
      <View
        style={{
          position: "absolute",
          top: -100,
          left: -50,
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
          <View>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: colors.primary,
              }}
            >
              Bookings
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Manage your pitch bookings
            </Text>
          </View>

          {/* Add Manual Booking Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.footballGreen,
              borderRadius: 12,
              padding: 10,
            }}
            onPress={() => router.push("../add-booking")}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.footballGreen}
          />
        }
      >
        {/* Filter buttons */
        }
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 8,
          }}
        >
          <FilterButton title="All" value="all" count={allBookings?.length || 0} />
          <FilterButton
            title="Today"
            value="today"
            count={todayBookings.length}
          />
          <FilterButton
            title="Upcoming"
            value="upcoming"
            count={upcomingBookings.length}
          />
          <FilterButton
            title="Pending"
            value="pending"
            count={pendingBookings.length}
          />
        </ScrollView>

        {/* Bookings list */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          {bookings?.length > 0 ? (
            bookings.map((booking) => (
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
              <Calendar size={48} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No Bookings Found
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {selectedFilter === "all"
                  ? "You don't have any bookings yet"
                  : `No ${selectedFilter} bookings found`}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.footballGreen,
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginTop: 16,
                }}
                onPress={() => router.push("../add-booking")}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 14,
                    color: "#FFFFFF",
                  }}
                >
                  Add Manual Booking
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}