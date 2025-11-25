import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Info,
  Share as ShareIcon,
  FileText,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { LineChart, BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

// Helper function to generate realistic data based on period
const generateAnalyticsData = (period) => {
  const now = new Date();
  let labels = [];
  let revenueData = [];
  let bookingsData = [];
  let totalRevenue = 0;
  let totalBookings = 0;
  let avgBookingValue = 0;
  let peakDay = "";
  let peakRevenue = 0;
  let growthRate = 0;

  switch (period) {
    case "week":
      // Daily data for this week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      labels = days;
      // More bookings and revenue on weekends
      revenueData = [12000, 15000, 13000, 14000, 18000, 25000, 22000];
      bookingsData = [8, 9, 7, 8, 12, 18, 15];
      totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
      totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
      avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
      
      // Find peak day
      peakRevenue = Math.max(...revenueData);
      const peakIndex = revenueData.indexOf(peakRevenue);
      peakDay = days[peakIndex];
      
      // Calculate growth rate (simplified)
      growthRate = 12.5;
      break;
      
    case "month":
      // Weekly data for this month
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      revenueData = [85000, 92000, 78000, 105000];
      bookingsData = [55, 62, 48, 75];
      totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
      totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
      avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
      
      // Find peak week
      peakRevenue = Math.max(...revenueData);
      const peakWeekIndex = revenueData.indexOf(peakRevenue);
      peakDay = labels[peakWeekIndex];
      
      // Calculate growth rate (simplified)
      growthRate = 8.3;
      break;
      
    case "year":
      // Monthly data for this year
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      labels = months;
      // Seasonal variation - more activity in certain months
      revenueData = [75000, 68000, 82000, 95000, 110000, 130000, 145000, 140000, 120000, 100000, 85000, 80000];
      bookingsData = [50, 45, 55, 65, 75, 90, 100, 95, 80, 65, 55, 50];
      totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
      totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
      avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
      
      // Find peak month
      peakRevenue = Math.max(...revenueData);
      const peakMonthIndex = revenueData.indexOf(peakRevenue);
      peakDay = `Month ${months[peakMonthIndex]}`;
      
      // Calculate growth rate (simplified)
      growthRate = 5.7;
      break;
      
    default:
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      revenueData = [12000, 19000, 15000, 22000, 18000, 25000, 20000];
      bookingsData = [8, 12, 9, 15, 11, 18, 14];
      totalRevenue = 131000;
      totalBookings = 87;
      avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
      
      // Find peak day
      peakRevenue = Math.max(...revenueData);
      const defaultPeakIndex = revenueData.indexOf(peakRevenue);
      peakDay = labels[defaultPeakIndex];
      
      // Calculate growth rate (simplified)
      growthRate = 10.2;
  }
  
  // Calculate occupancy rate based on bookings
  const occupancyRate = Math.min(100, Math.floor((totalBookings / (labels.length * 5)) * 100));
  
  return {
    revenueLabels: labels,
    revenueData,
    bookingsLabels: labels,
    bookingsData,
    totalRevenue,
    totalBookings,
    occupancyRate,
    avgBookingValue,
    peakDay,
    peakRevenue,
    growthRate,
  };
};

export default function PitchAnalytics() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [analyticsData, setAnalyticsData] = useState(generateAnalyticsData("week"));

  // Update data when period changes
  useEffect(() => {
    setAnalyticsData(generateAnalyticsData(selectedPeriod));
  }, [selectedPeriod]);

  const handleSavePDF = () => {
    Alert.alert(
      "Save PDF",
      "In a real app, this would generate and save a PDF report. For now, this is a demonstration.",
      [{ text: "OK" }]
    );
  };

  const handleShare = async () => {
    try {
      await Sharing.shareAsync("https://example.com/analytics-report", {
        mimeType: "text/plain",
        dialogTitle: "Share Analytics Report",
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share report: " + error.message);
    }
  };

  const [fontsLoaded] = useFonts({
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
    footballDark: "#059142",
    inputBorder: isDark ? "#374151" : "#D1D5DB",
    inputFocus: "#00FF88",
  };

  const chartConfig = {
    backgroundColor: colors.cardBg,
    backgroundGradientFrom: colors.cardBg,
    backgroundGradientTo: colors.cardBg,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
    labelColor: (opacity = 1) => colors.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#00FF88",
    },
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
  };

  const revenueChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`, // Green for revenue
  };

  const bookingsChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(5, 145, 66, ${opacity})`, // Darker green for bookings
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
        color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4, marginRight: 16 }}
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
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
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
            {["week", "month", "year"].map((period) => (
              <TouchableOpacity
                key={period}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedPeriod === period ? colors.primaryGreen : "transparent",
                  alignItems: "center",
                }}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
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
              <DollarSign size={24} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                ₦{analyticsData?.totalRevenue?.toLocaleString() || "0"}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
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
              <Users size={24} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                {analyticsData?.totalBookings || "0"}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Bookings
              </Text>
            </View>
          </View>

          {/* Detailed Stats */}
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
              <TrendingUp size={24} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                {analyticsData?.growthRate?.toFixed(1) || "0"}%
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Growth Rate
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
              <DollarSign size={24} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                ₦{analyticsData?.avgBookingValue?.toLocaleString() || "0"}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Avg. Value
              </Text>
            </View>
          </View>

          {/* Insights */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Info size={20} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Key Insights
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                lineHeight: 20,
              }}
            >
              Peak performance on <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.primary }}>{analyticsData?.peakDay}</Text> with revenue of ₦{analyticsData?.peakRevenue?.toLocaleString()}. 
              {analyticsData?.growthRate > 0 
                ? `Showing positive growth of ${analyticsData?.growthRate?.toFixed(1)}%.`
                : "Performance stable compared to previous period."}
            </Text>
          </View>

          {/* Occupancy Rate */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Occupancy Rate
            </Text>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 32,
                color: colors.primaryGreen,
              }}
            >
              {analyticsData?.occupancyRate || 0}%
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Based on {selectedPeriod} data
            </Text>
          </View>

          {/* Performance Summary */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
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
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Performance Summary
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                lineHeight: 20,
                marginBottom: 8,
              }}
            >
              Your pitch performance is{" "}
              <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.primary }}>
                {analyticsData?.occupancyRate > 80 ? "excellent" : analyticsData?.occupancyRate > 60 ? "good" : "moderate"}
              </Text>{" "}
              this {selectedPeriod}.
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                lineHeight: 20,
                marginBottom: 8,
              }}
            >
              {analyticsData?.occupancyRate > 80 
                ? "Keep up the great work!"
                : analyticsData?.occupancyRate > 60 
                  ? "There's room for improvement."
                  : "Consider promotional strategies to increase bookings."}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                lineHeight: 20,
              }}
            >
              Average booking value of ₦{analyticsData?.avgBookingValue?.toLocaleString() || "0"} indicates{" "}
              <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.primary }}>
                {analyticsData?.avgBookingValue > 20000 ? "premium" : analyticsData?.avgBookingValue > 10000 ? "standard" : "budget"}
              </Text>{" "}
              pricing strategy.
            </Text>
          </View>

          {/* Revenue Chart */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 16,
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
                marginBottom: 12,
              }}
            >
              <TrendingUp size={20} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Revenue Trend
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LineChart
                data={revenueData}
                width={width - 72}
                height={200}
                chartConfig={revenueChartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>

          {/* Bookings Chart */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 16,
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
                marginBottom: 12,
              }}
            >
              <Calendar size={20} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Bookings Trend
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart
                data={bookingsData}
                width={width - 72}
                height={200}
                chartConfig={bookingsChartConfig}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                yAxisLabel=""
                yAxisSuffix=""
                showValuesOnTopOfBars={true}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: isDark ? "#000000" : "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
                flexDirection: "row",
              }}
              onPress={handleSavePDF}
            >
              <FileText size={20} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Save PDF
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: isDark ? "#000000" : "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
                flexDirection: "row",
              }}
              onPress={handleShare}
            >
              <ShareIcon size={20} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
