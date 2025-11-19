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
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function Payments() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedFilter, setSelectedFilter] = useState("all");

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

  const fetchFinancialData = async () => {
    try {
      // Mock data for demonstration
      const mockData = {
        earnings: {
          today: 125000,
          weekly: 850000,
          monthly: 3500000
        },
        recentActivity: [
          { 
            id: "1", 
            player_name: "John Doe", 
            pitch_name: "Main Football Pitch",
            total_amount: 15000, 
            created_at: "2023-06-15", 
            payment_status: "completed" 
          },
          { 
            id: "2", 
            player_name: "Jane Smith", 
            pitch_name: "Basketball Court",
            total_amount: 20000, 
            created_at: "2023-06-14", 
            payment_status: "pending" 
          },
          { 
            id: "3", 
            player_name: "Mike Johnson", 
            pitch_name: "Tennis Court",
            total_amount: 18000, 
            created_at: "2023-06-14", 
            payment_status: "completed" 
          },
          { 
            id: "4", 
            player_name: "Sarah Williams", 
            pitch_name: "Volleyball Court",
            total_amount: 22000, 
            created_at: "2023-06-13", 
            payment_status: "failed" 
          }
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFinancialData(mockData);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
    
    // Check for font loading errors
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFinancialData();
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "failed":
      case "refunded":
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
      case "refunded":
        return XCircle;
      default:
        return Clock;
    }
  };

  const FinancialCard = ({
    title,
    amount,
    change,
    icon: IconComponent,
    trend,
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
              color: colors.primary,
            }}
          >
            ₦{amount.toLocaleString()}
          </Text>
          {change && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              {trend === "up" ? (
                <TrendingUp size={16} color={colors.success} />
              ) : (
                <TrendingDown size={16} color={colors.error} />
              )}
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: trend === "up" ? colors.success : colors.error,
                  marginLeft: 4,
                }}
              >
                {change}
              </Text>
            </View>
          )}
        </View>
        {IconComponent && (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primaryGreen + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconComponent size={24} color={colors.primaryGreen} />
          </View>
        )}
      </View>
    </View>
  );

  const TransactionItem = ({ transaction }) => {
    const StatusIcon = getStatusIcon(transaction.payment_status);

    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: isDark ? "#000000" : "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
        onPress={() => router.push(`/booking-receipt?id=${transaction.id}`)}
        activeOpacity={0.8}
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
          {transaction.payment_status === "completed" ? (
            <ArrowDownLeft size={20} color="#FFFFFF" />
          ) : (
            <ArrowUpRight size={20} color="#FFFFFF" />
          )}
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
              {transaction.player_name}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: transaction.payment_status === "completed" ? colors.success : colors.error,
              }}
            >
              ₦{transaction.total_amount.toLocaleString()}
            </Text>
          </View>
          
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              color: colors.secondary,
              marginTop: 4,
            }}
          >
            {transaction.pitch_name}
          </Text>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              {new Date(transaction.created_at).toLocaleDateString()}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: getStatusColor(transaction.payment_status) + "20",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <StatusIcon size={12} color={getStatusColor(transaction.payment_status)} />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: getStatusColor(transaction.payment_status),
                  marginLeft: 4,
                  textTransform: "capitalize",
                }}
              >
                {transaction.payment_status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
          Loading payments...
        </Text>
      </View>
    );
  }

  const filteredTransactions = selectedFilter === "all" 
    ? financialData?.recentActivity || [] 
    : financialData?.recentActivity.filter(t => t.payment_status === selectedFilter) || [];

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
            Payments
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
          >
            <Download size={20} color={colors.primary} />
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
          {/* Earnings Overview */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 20,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Earnings Overview
            </Text>
            
            {/* Two small bars next to each other like in dashboard */}
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: 16,
                  padding: 16,
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
                      Today
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 20,
                        color: colors.primary,
                      }}
                    >
                      ₦{financialData?.earnings.today.toLocaleString() || 0}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <TrendingUp size={14} color={colors.success} />
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 12,
                          color: colors.success,
                          marginLeft: 4,
                        }}
                      >
                        +12% from yesterday
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.primaryGreen + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DollarSign size={18} color={colors.primaryGreen} />
                  </View>
                </View>
              </View>
              
              <View
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: 16,
                  padding: 16,
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
                      This Week
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 20,
                        color: colors.primary,
                      }}
                    >
                      ₦{financialData?.earnings.weekly.toLocaleString() || 0}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <TrendingUp size={14} color={colors.success} />
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 12,
                          color: colors.success,
                          marginLeft: 4,
                        }}
                      >
                        +8% from last week
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.primaryGreen + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={18} color={colors.primaryGreen} />
                  </View>
                </View>
              </View>
            </View>
            
            <FinancialCard
              title="This Month"
              amount={financialData?.earnings.monthly || 0}
              change="+5% from last month"
              icon={CreditCard}
              trend="up"
            />
          </View>

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
            {['all', 'completed', 'pending', 'failed'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: selectedFilter === filter ? colors.primaryGreen : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: selectedFilter === filter ? colors.white : colors.secondary,
                    textTransform: "capitalize",
                    textAlign: "center",
                  }}
                >
                  {filter === "all" ? "All Transactions" : filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Transactions */}
          <View style={{ marginBottom: 24 }}>
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
                Recent Transactions
              </Text>
              <TouchableOpacity>
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
            
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
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
                <CreditCard size={40} color={colors.secondary} />
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 18,
                    color: colors.primary,
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  No {selectedFilter === "all" ? "" : selectedFilter} transactions
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
                    ? "You don't have any transactions yet." 
                    : `You don't have any ${selectedFilter} transactions.`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}