import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Share2,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { LineChart, BarChart } from "react-native-chart-kit";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get("window");

// Mock data for earnings
const generateEarningsData = (period) => {
  const now = new Date();
  let labels = [];
  let revenueData = [];
  let bookingsData = [];
  let totalRevenue = 0;
  let totalBookings = 0;

  switch (period) {
    case "week":
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      labels = days;
      revenueData = [120000, 150000, 130000, 140000, 180000, 250000, 220000];
      bookingsData = [8, 9, 7, 8, 12, 18, 15];
      totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
      totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
      break;
      
    case "month":
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      revenueData = [850000, 920000, 780000, 1050000];
      bookingsData = [55, 62, 48, 75];
      totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
      totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
      break;
      
    case "year":
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      labels = months;
      revenueData = [7500000, 6800000, 8200000, 9500000, 11000000, 13000000, 14500000, 14000000, 12000000, 10000000, 8500000, 8000000];
      bookingsData = [500, 450, 550, 650, 750, 900, 1000, 950, 800, 650, 550, 500];
      totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
      totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
      break;
      
    default:
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      revenueData = [120000, 190000, 150000, 220000, 180000, 250000, 200000];
      bookingsData = [8, 12, 9, 15, 11, 18, 14];
      totalRevenue = 1310000;
      totalBookings = 87;
  }
  
  const occupancyRate = Math.min(100, Math.floor((totalBookings / (labels.length * 5)) * 100));
  
  return {
    revenueLabels: labels,
    revenueData,
    bookingsLabels: labels,
    bookingsData,
    totalRevenue,
    totalBookings,
    occupancyRate,
  };
};

export default function EarningsOverview() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [earningsData, setEarningsData] = useState(generateEarningsData("week"));
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    setEarningsData(generateEarningsData(selectedPeriod));
  }, [selectedPeriod]);

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
      r: "4",
      strokeWidth: "2",
      stroke: "#00FF88",
    },
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  // Export data as CSV
  const exportAsCSV = async () => {
    try {
      // Create CSV content
      let csvContent = "Date,Revenue (₦),Bookings\n";
      
      // Add data rows
      for (let i = 0; i < earningsData.revenueLabels.length; i++) {
        csvContent += `${earningsData.revenueLabels[i]},${earningsData.revenueData[i]},${earningsData.bookingsData[i]}\n`;
      }
      
      // Add summary row
      csvContent += `\nTotal Revenue,₦${earningsData.totalRevenue.toLocaleString()}\n`;
      csvContent += `Total Bookings,${earningsData.totalBookings}\n`;
      csvContent += `Occupancy Rate,${earningsData.occupancyRate}%\n`;
      
      // Write to file
      const fileName = `earnings_report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Sharing Unavailable", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Export Failed", "Failed to export earnings data");
    }
  };

  // Share earnings summary
  const shareEarnings = async () => {
    try {
      const message = `PitchLink Earnings Report (${selectedPeriod})
      
Total Revenue: ₦${earningsData.totalRevenue.toLocaleString()}
Total Bookings: ${earningsData.totalBookings}
Occupancy Rate: ${earningsData.occupancyRate}%

Generated on ${new Date().toLocaleDateString()}`;

      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Share Failed", "Failed to share earnings data");
    }
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
    labels: earningsData?.revenueLabels || [],
    datasets: [
      {
        data: earningsData?.revenueData || [],
        color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const bookingsData = {
    labels: earningsData?.bookingsLabels || [],
    datasets: [
      {
        data: earningsData?.bookingsData || [],
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
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Earnings Overview
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
                      selectedPeriod === period ? "#000000" : colors.secondary,
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
              gap: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                shadowColor: isDark ? "#000000" : "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <DollarSign size={24} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 24,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                ₦{earningsData?.totalRevenue?.toLocaleString() || "0"}
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
                Total Revenue
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                shadowColor: isDark ? "#000000" : "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Users size={24} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 24,
                  color: colors.primary,
                  marginTop: 8,
                }}
              >
                {earningsData?.totalBookings || "0"}
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
                Total Bookings
              </Text>
            </View>
          </View>

          {/* Occupancy Rate */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              alignItems: "center",
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
                marginBottom: 8,
              }}
            >
              Occupancy Rate
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 36,
                color: colors.primaryGreen,
              }}
            >
              {earningsData?.occupancyRate || 0}%
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
            <LineChart
              data={revenueData}
              width={width - 80}
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
            <BarChart
              data={bookingsData}
              width={width - 80}
              height={220}
              chartConfig={chartConfig}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          {/* Export Options */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
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
                flexDirection: "row",
                justifyContent: "center",
                shadowColor: isDark ? "#000000" : "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
              onPress={exportAsCSV}
            >
              <Download size={20} color={colors.primaryGreen} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginLeft: 8,
                }}
              >
                Export CSV
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                shadowColor: isDark ? "#000000" : "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
              onPress={shareEarnings}
            >
              <Share2 size={20} color={colors.primaryGreen} />
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