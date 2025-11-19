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
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

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
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

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
            backgroundColor: colors.primaryGreen,
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
                fontFamily: "Inter_600SemiBold",
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
                backgroundColor: getStatusColor(booking.status) + "20",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getStatusColor(booking.status),
                  marginRight: 4,
                }}
              />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
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
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginTop: 4,
            }}
          >
            {booking.pitchName} • {formatDate(booking.date)}
          </Text>
          
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginTop: 2,
            }}
          >
            {booking.time}
          </Text>
        </View>
        
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.lightGray,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronRight size={20} color={colors.secondary} />
        </View>
      </TouchableOpacity>
    );
  };

  // Added missing StatCard component
  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <View
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        padding: 20,
        flex: 1,
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              color: color || colors.primary,
            }}
          >
            {value}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {Icon && (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: (color || colors.primary) + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={24} color={color || colors.primary} />
          </View>
        )}
      </View>
    </View>
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
          Loading dashboard...
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
          <View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 28,
                color: colors.primary,
              }}
            >
              Dashboard
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              Welcome back, John!
            </Text>
          </View>
          
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.lightGray,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Bell size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.lightGray,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Menu size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
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
          {/* Stats Grid */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
            <StatCard
              title="Total Bookings"
              value={dashboardData.totalBookings}
              icon={Calendar}
              color={colors.primaryGreen}
            />
            
            <StatCard
              title="Active Pitches"
              value={dashboardData.activePitches}
              icon={Building}
              color={colors.footballDark}
            />
          </View>

          {/* Earnings Overview */}
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                Earnings Overview
              </Text>
              <TouchableOpacity onPress={() => router.push("/earnings-overview")}>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: colors.primaryGreen,
                  }}
                >
                  View Report
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
              <StatCard
                title="Today"
                value={`₦${(dashboardData.earnings.today / 1000).toFixed(1)}k`}
                subtitle="+12% from yesterday"
                color={colors.primaryGreen}
              />
              
              <StatCard
                title="This Week"
                value={`₦${(dashboardData.earnings.weekly / 1000).toFixed(1)}k`}
                subtitle="+8% from last week"
                color={colors.footballDark}
              />
            </View>
            
            <View
              style={{
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Monthly Earnings
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 20,
                    color: colors.primary,
                  }}
                >
                  ₦{(dashboardData.earnings.monthly / 1000).toFixed(1)}k
                </Text>
              </View>
              
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.lightGray,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: "78%",
                    backgroundColor: colors.primaryGreen,
                    borderRadius: 4,
                  }}
                />
              </View>
              
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  Occupancy Rate: {dashboardData.occupancyRate}%
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  Target: 90%
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
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
              onPress={() => router.push("/add-booking")}
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
                <Plus size={24} color={colors.primaryGreen} />
              </View>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Add Booking
              </Text>
            </TouchableOpacity>
            
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
              onPress={() => router.push("/add-pitch")}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.footballDark + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Building size={24} color={colors.footballDark} />
              </View>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Add Pitch
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={{ paddingHorizontal: 0, paddingTop: 8 }}>
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
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                Recent Activity
              </Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/bookings")}>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: colors.primaryGreen,
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
                    fontFamily: "Inter_600SemiBold",
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
                    fontFamily: "Inter_400Regular",
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
        </View>
      </ScrollView>
    </View>
  );
}