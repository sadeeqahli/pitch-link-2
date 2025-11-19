import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Linking,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function SupportPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);

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
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const handleContactSupport = async (method) => {
    switch (method) {
      case "phone":
        const phoneNumber = "+234 803 123 4567";
        try {
          await Linking.openURL(`tel:${phoneNumber}`);
        } catch (error) {
          Alert.alert("Error", "Unable to make a call. Please try again.");
        }
        break;
      case "email":
        const email = "support@pitchowner.ng";
        const subject = "Support Request - PitchOwner App Nigeria";
        try {
          await Linking.openURL(
            `mailto:${email}?subject=${encodeURIComponent(subject)}`
          );
        } catch (error) {
          Alert.alert("Error", "Unable to send email. Please try again.");
        }
        break;
      case "whatsapp":
        const whatsappNumber = "2348079876543";
        const message = "Hi, I need help with the PitchOwner app.";
        try {
          await Linking.openURL(
            `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
          );
        } catch (error) {
          try {
            // Fallback to web version
            await Linking.openURL(
              `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
            );
          } catch (fallbackError) {
            Alert.alert("Error", "Unable to open WhatsApp. Please try again.");
          }
        }
        break;
      default:
        break;
    }
  };

  if (!fontsLoaded) {
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
          paddingTop: insets.top + 20,
          paddingBottom: 20,
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
            Support
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
          {/* Contact Support Section */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Contact Support
          </Text>

          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 32,
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Call Support */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
              onPress={() => handleContactSupport("phone")}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.success,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Phone size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 2,
                  }}
                >
                  Call Support
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  +234 803 123 4567
                </Text>
              </View>
              <ArrowLeft size={20} color={colors.secondary} style={{ transform: [{ rotate: "180deg" }] }} />
            </TouchableOpacity>

            {/* Email Support */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
              onPress={() => handleContactSupport("email")}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.primaryGreen,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Mail size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 2,
                  }}
                >
                  Email Support
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  support@pitchowner.ng
                </Text>
              </View>
              <ArrowLeft size={20} color={colors.secondary} style={{ transform: [{ rotate: "180deg" }] }} />
            </TouchableOpacity>

            {/* WhatsApp Support */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
              }}
              onPress={() => handleContactSupport("whatsapp")}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.success,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <MessageSquare size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 2,
                  }}
                >
                  WhatsApp Support
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Chat with our support team
                </Text>
              </View>
              <ArrowLeft size={20} color={colors.secondary} style={{ transform: [{ rotate: "180deg" }] }} />
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Frequently Asked Questions
          </Text>

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
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                How do I add a new pitch?
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Go to the Pitches tab and tap the + button to add a new pitch. Fill in the required details and save.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                How do I manage bookings?
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Navigate to the Bookings tab to view, add, or edit bookings. You can filter by status and date.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                How do I view my earnings?
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Go to the Payments tab to see your earnings, transaction history, and financial reports.
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Support */}
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
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 12,
              }}
            >
              Need More Help?
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 16,
                lineHeight: 22,
              }}
            >
              If you can't find what you're looking for, our support team is here to help. Contact us through any of the methods above and we'll get back to you as soon as possible.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primaryGreen,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
              onPress={() => handleContactSupport("email")}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                Contact Support Team
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}