import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const { width } = Dimensions.get("window");

export default function PitchAnalytics() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Convex queries
  const analyticsData = useQuery(api.analytics.getAnalytics, { 
    pitchId: id,
    period: selectedPeriod 
  });

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
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    inputFocus: "#00CC66",
  };

  const chartConfig = {
    backgroundColor: colors.cardBg,
    backgroundGradientFrom: colors.cardBg,
    backgroundGradientTo: colors.cardBg,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 204, 102, ${opacity})`,
    labelColor: (opacity = 1) => colors.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#00CC66",
    },
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Prepare chart data
  const revenueData = {
    labels: analyticsData?.revenueLabels || [],
    datasets: [
      {
        data: analyticsData?.revenueData || [],
        color: (opacity = 1) => `rgba(0, 204, 102, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const bookingsData = {
    labels: analyticsData?.bookingsLabels || [],
    datasets: [
      {
        data: analyticsData?.bookingsData || [],
        color: (opacity = 1) => `rgba(5, 145, 66, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 24,
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4, marginRight: 16 }}
          >
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Pitch Analytics
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: colors.secondary,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Track your pitch performance and revenue
          </Text>

          {/* Period Selector */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.lightGray,
              borderRadius: 12,
              padding: 4,
              marginBottom: 24,
            }}
          >
            {["day", "week", "month", "year"].map((period) => (
              <TouchableOpacity
                key={period}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedPeriod === period ? colors.footballGreen : "transparent",
                  alignItems: "center",
                }}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 14,
                    color:
                      selectedPeriod === period ? "#FFFFFF" : colors.secondary,
                  }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats Summary */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
              }}
            >
              <DollarSign size={24} color={colors.footballGreen} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                ₦{analyticsData?.totalRevenue?.toLocaleString() || "0"}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Revenue
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Users size={24} color={colors.footballGreen} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                {analyticsData?.totalBookings || "0"}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Bookings
              </Text>
            </View>
          </View>

          {/* Revenue Chart */}
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <TrendingUp size={20} color={colors.footballGreen} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Revenue Trend
              </Text>
            </View>
            <LineChart
              data={revenueData}
              width={width - 88}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          {/* Bookings Chart */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
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
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Calendar size={20} color={colors.footballGreen} />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Bookings Trend
              </Text>
            </View>
            <BarChart
              data={bookingsData}
              width={width - 88}
              height={220}
              chartConfig={chartConfig}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}