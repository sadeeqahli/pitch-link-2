import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Menu,
  Bell,
  Plus,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const { width: screenWidth } = Dimensions.get("window");

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fontLoadError, setFontLoadError] = useState(false);

  // Mock data to replace Convex queries
  const dashboardData = {
    totalBookings: 24,
    totalRevenue: 1240,
    activePitches: 3,
    occupancyRate: 78,
    earnings: {
      today: 120000,
      weekly: 850000,
      monthly: 3500000
    },
    bookings: {
      pending: 3,
      upcoming: 7
    }
  };
  
  const recentActivity = [
    {
      id: "1",
      playerName: "John Doe",
      pitchName: "Main Field",
      date: "2023-06-15",
      time: "14:00 - 16:00",
      status: "confirmed",
    },
    {
      id: "2",
      playerName: "Jane Smith",
      pitchName: "Side Court",
      date: "2023-06-15",
      time: "10:00 - 12:00",
      status: "pending",
    },
    {
      id: "3",
      playerName: "Mike Johnson",
      pitchName: "Main Field",
      date: "2023-06-14",
      time: "18:00 - 20:00",
      status: "completed",
    },
    {
      id: "4",
      playerName: "Sarah Wilson",
      pitchName: "Training Area",
      date: "2023-06-14",
      time: "09:00 - 11:00",
      status: "confirmed",
    },
    {
      id: "5",
      playerName: "David Brown",
      pitchName: "Main Field",
      date: "2023-06-13",
      time: "15:00 - 17:00",
      status: "completed",
    },
  ];

  const [fontsLoaded, fontLoadErrorResult] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

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
    // Simulate loading mock data
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Check for font loading errors
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  // Added missing RecentActivityItem component
  const RecentActivityItem = ({ booking }) => {
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'confirmed':
          return colors.success;
        case 'pending':
          return colors.warning;
        case 'completed':
          return colors.secondary;
        default:
          return colors.secondary;
      }
    };

    const formatDate = (dateString) => {
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => router.push(`/booking-receipt?id=${booking.id}`)}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.footballGreen,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Users size={20} color="#FFFFFF" />
        </View>
        
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              {booking.playerName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getStatusColor(booking.status),
                  marginRight: 6,
                }}
              />
              <Text
                style={{
                  fontFamily: fontsLoaded && !fontLoadError ? "Poppins_500Medium" : "normal",
                  fontSize: 12,
                  color: getStatusColor(booking.status),
                  textTransform: "capitalize",
                }}
              >
                {booking.status}
              </Text>
            </View>
          </View>
          
          <Text
            style={{
              fontFamily: fontsLoaded && !fontLoadError ? "Poppins_400Regular" : "normal",
              fontSize: 14,
              color: colors.secondary,
              marginTop: 4,
            }}
          >
            {booking.pitchName} • {formatDate(booking.date)} • {booking.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const MetricCard = ({
    title,
    value,
    subtitle,
    color,
    icon: IconComponent,
  }) => (
    <View
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
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fontsLoaded && !fontLoadError ? "Poppins_500Medium" : "normal",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
              fontSize: 28,
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {value}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontFamily: fontsLoaded && !fontLoadError ? "Poppins_400Regular" : "normal",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: color,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconComponent size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );

  const QuickActionCard = ({
    title,
    subtitle,
    color,
    icon: IconComponent,
    onPress,
  }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: color,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        marginHorizontal: 8,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <IconComponent size={20} color="#FFFFFF" />
      </View>
      <Text
        style={{
          fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
          fontSize: 14,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: fontsLoaded && !fontLoadError ? "Poppins_400Regular" : "normal",
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.8)",
          textAlign: "center",
        }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
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
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background football pattern */}
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
          {/* Logo */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri: "https://ucarecdn.com/803dfc8d-a031-4f35-9ce6-13ba59adea83/-/format/auto/",
              }}
              style={{ width: 32, height: 32, marginRight: 12 }}
              contentFit="contain"
            />
            <View>
              <Text
                style={{
                  fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                PitchOwner
              </Text>
              <Text
                style={{
                  fontFamily: fontsLoaded && !fontLoadError ? "Poppins_400Regular" : "normal",
                  fontSize: 12,
                  color: colors.secondary,
                }}
              >
                Dashboard
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push("../notifications")}>
            <Bell size={24} color={colors.primary} />
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
        {/* Key Metrics */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
              fontSize: 24,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Today's Overview
          </Text>

          <MetricCard
            title="Today's Earnings"
            value={`₦${dashboardData?.earnings?.today?.toLocaleString() || "0"}`}
            subtitle={`Weekly: ₦${dashboardData?.earnings?.weekly?.toLocaleString() || "0"} • Monthly: ₦${dashboardData?.earnings?.monthly?.toLocaleString() || "0"}`}
            color={colors.footballGreen}
            icon={DollarSign}
          />

          <View style={{ flexDirection: "row", marginHorizontal: -8 }}>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <MetricCard
                title="Pending Bookings"
                value={dashboardData?.bookings?.pending?.toString() || "0"}
                color={colors.warning}
                icon={Clock}
              />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <MetricCard
                title="Upcoming Bookings"
                value={dashboardData?.bookings?.upcoming?.toString() || "0"}
                color={colors.footballDark}
                icon={Calendar}
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <Text
            style={{
              fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: -8,
              marginBottom: 16,
            }}
          >
            <QuickActionCard
              title="Add Booking"
              subtitle="Manual booking"
              color={colors.footballGreen}
              icon={Plus}
              onPress={() => router.push("/add-booking")}
            />
            <QuickActionCard
              title="Add Pitch"
              subtitle="New facility"
              color="#6366F1"
              icon={Building}
              onPress={() => router.push("/add-pitch")}
            />
            <QuickActionCard
              title="View Calendar"
              subtitle="Check schedule"
              color={colors.footballDark}
              icon={Calendar}
              onPress={() => router.push("/(tabs)/bookings")}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/bookings")}>
              <Text
                style={{
                  fontFamily: fontsLoaded && !fontLoadError ? "Poppins_500Medium" : "normal",
                  fontSize: 14,
                  color: colors.footballGreen,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {recentActivity?.length > 0 ? (
            recentActivity
              .slice(0, 5)
              .map((booking) => (
                <RecentActivityItem key={booking.id} booking={booking} />
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
              <Clock size={40} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: fontsLoaded && !fontLoadError ? "Poppins_600SemiBold" : "normal",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No Recent Activity
              </Text>
              <Text
                style={{
                  fontFamily: fontsLoaded && !fontLoadError ? "Poppins_400Regular" : "normal",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                New bookings will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}