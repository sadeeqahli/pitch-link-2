import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  RefreshControl,
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
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

  const fetchDashboardData = async () => {
    try {
      // Mock data for demonstration with more realistic data
      const mockData = {
        earnings: {
          today: 45000,
          weekly: 245000,
          monthly: 875000
        },
        bookings: {
          pending: 3,
          upcoming: 8
        },
        recentActivity: [
          { 
            id: 1, 
            player_name: "John Doe", 
            pitch_name: "Pitch A",
            booking_date: "2023-06-15",
            start_time: "14:00", 
            end_time: "16:00",
            total_amount: 15000,
            payment_status: "confirmed"
          },
          { 
            id: 2, 
            player_name: "Jane Smith", 
            pitch_name: "Pitch B",
            booking_date: "2023-06-15",
            start_time: "17:00", 
            end_time: "19:00",
            total_amount: 20000,
            payment_status: "pending"
          },
          { 
            id: 3, 
            player_name: "Mike Johnson", 
            pitch_name: "Pitch C",
            booking_date: "2023-06-16",
            start_time: "19:00", 
            end_time: "21:00",
            total_amount: 18000,
            payment_status: "confirmed"
          }
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
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
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
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
                fontFamily: "Poppins_400Regular",
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
          fontFamily: "Poppins_600SemiBold",
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
          fontFamily: "Poppins_400Regular",
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.8)",
          textAlign: "center",
        }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  const RecentActivityItem = ({ booking }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      activeOpacity={0.7}
      onPress={() => router.push("../bookings")}
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
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {booking.player_name}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginBottom: 2,
            }}
          >
            {booking.pitch_name}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            {new Date(booking.booking_date).toLocaleDateString()} •{" "}
            {booking.start_time} - {booking.end_time}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: colors.footballGreen,
              marginBottom: 4,
            }}
          >
            ₦{parseFloat(booking.total_amount || 0).toLocaleString()}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor:
                booking.payment_status === "confirmed"
                  ? colors.success
                  : colors.warning,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 10,
                color: "#FFFFFF",
                textTransform: "capitalize",
              }}
            >
              {booking.payment_status || "pending"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: colors.secondary }}>
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
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                PitchOwner
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
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
              fontFamily: "Poppins_600SemiBold",
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
              fontFamily: "Poppins_600SemiBold",
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
              onPress={() => router.push("../add-booking")}
            />
            <QuickActionCard
              title="View Calendar"
              subtitle="Check schedule"
              color={colors.footballDark}
              icon={Calendar}
              onPress={() => router.push("/(tabs)/bookings")}
            />
            <QuickActionCard
              title="Manage Pitches"
              subtitle="Edit pitch info"
              color="#6366F1"
              icon={Building}
              onPress={() => router.push("/(tabs)/pitches")}
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
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/bookings")}>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                  color: colors.footballGreen,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {dashboardData?.recentActivity?.length > 0 ? (
            dashboardData.recentActivity
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
                  fontFamily: "Poppins_600SemiBold",
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
                  fontFamily: "Poppins_400Regular",
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