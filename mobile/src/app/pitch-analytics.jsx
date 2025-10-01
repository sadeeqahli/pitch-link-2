import React, { useState, useEffect } from "react";
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
import { format, subDays, subWeeks, subMonths, subYears, isSameDay, isSameWeek, isSameMonth, isSameYear, startOfWeek, startOfMonth, startOfYear } from "date-fns";

const { width } = Dimensions.get("window");

export default function PitchAnalytics() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch bookings data
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Mock data for demonstration - in a real app, this would come from an API
      const mockBookings = [
        { id: 1, player_name: "John Doe", pitch_name: "Pitch A", booking_date: "2023-06-10", start_time: "14:00:00", end_time: "16:00:00", total_amount: 15000, payment_status: "confirmed" },
        { id: 2, player_name: "Jane Smith", pitch_name: "Pitch B", booking_date: "2023-06-12", start_time: "17:00:00", end_time: "19:00:00", total_amount: 20000, payment_status: "pending" },
        { id: 3, player_name: "Mike Johnson", pitch_name: "Pitch C", booking_date: "2023-06-15", start_time: "19:00:00", end_time: "21:00:00", total_amount: 18000, payment_status: "confirmed" },
        { id: 4, player_name: "Sarah Wilson", pitch_name: "Pitch A", booking_date: "2023-06-18", start_time: "10:00:00", end_time: "12:00:00", total_amount: 15000, payment_status: "confirmed" },
        { id: 5, player_name: "Robert Brown", pitch_name: "Pitch B", booking_date: "2023-06-20", start_time: "15:00:00", end_time: "17:00:00", total_amount: 20000, payment_status: "confirmed" },
        { id: 6, player_name: "Emily Davis", pitch_name: "Pitch C", booking_date: "2023-06-22", start_time: "18:00:00", end_time: "20:00:00", total_amount: 18000, payment_status: "pending" },
        { id: 7, player_name: "David Miller", pitch_name: "Pitch A", booking_date: "2023-06-25", start_time: "13:00:00", end_time: "15:00:00", total_amount: 15000, payment_status: "confirmed" },
        { id: 8, player_name: "Lisa Taylor", pitch_name: "Pitch B", booking_date: "2023-06-28", start_time: "16:00:00", end_time: "18:00:00", total_amount: 20000, payment_status: "confirmed" },
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(mockBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on selected period
  const filterBookingsByPeriod = (period) => {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case "day":
        startDate = subDays(now, 1);
        break;
      case "week":
        startDate = subWeeks(now, 1);
        break;
      case "month":
        startDate = subMonths(now, 1);
        break;
      case "year":
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subWeeks(now, 1);
    }
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= startDate && bookingDate <= now;
    });
  };

  // Generate chart data based on selected period
  const generateChartData = (period) => {
    const filteredBookings = filterBookingsByPeriod(period);
    const now = new Date();
    let labels = [];
    let revenueData = [];
    let bookingsData = [];
    
    switch (period) {
      case "day":
        // Last 24 hours - show hourly data
        for (let i = 0; i < 24; i++) {
          const hour = new Date(now);
          hour.setHours(now.getHours() - i);
          labels.unshift(`${hour.getHours()}:00`);
          
          const hourlyBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.booking_date);
            return bookingDate.getHours() === hour.getHours();
          });
          
          bookingsData.unshift(hourlyBookings.length);
          revenueData.unshift(hourlyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0));
        }
        break;
        
      case "week":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = subDays(now, i);
          labels.push(format(date, "EEE"));
          
          const dailyBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.booking_date);
            return isSameDay(bookingDate, date);
          });
          
          bookingsData.push(dailyBookings.length);
          revenueData.push(dailyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0));
        }
        break;
        
      case "month":
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = subDays(now, i);
          labels.push(format(date, "dd"));
          
          const dailyBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.booking_date);
            return isSameDay(bookingDate, date);
          });
          
          bookingsData.push(dailyBookings.length);
          revenueData.push(dailyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0));
        }
        break;
        
      case "year":
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(now, i);
          labels.push(format(date, "MMM"));
          
          const monthlyBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.booking_date);
            return isSameMonth(bookingDate, date);
          });
          
          bookingsData.push(monthlyBookings.length);
          revenueData.push(monthlyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0));
        }
        break;
        
      default:
        // Default to week view
        for (let i = 6; i >= 0; i--) {
          const date = subDays(now, i);
          labels.push(format(date, "EEE"));
          
          const dailyBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.booking_date);
            return isSameDay(bookingDate, date);
          });
          
          bookingsData.push(dailyBookings.length);
          revenueData.push(dailyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0));
        }
    }
    
    return { labels, revenueData, bookingsData };
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    const filteredBookings = filterBookingsByPeriod(selectedPeriod);
    
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
    const totalBookings = filteredBookings.length;
    
    return { totalRevenue, totalBookings };
  };

  const { totalRevenue, totalBookings } = calculateSummaryStats();
  const chartData = generateChartData(selectedPeriod);

  const revenueData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.revenueData,
        color: (opacity = 1) => `rgba(0, 204, 102, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const bookingsData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.bookingsData,
        color: (opacity = 1) => `rgba(5, 145, 66, ${opacity})`,
        strokeWidth: 2,
      },
    ],
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

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Text>Loading...</Text>
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
                ₦{totalRevenue.toLocaleString()}
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
                {totalBookings}
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