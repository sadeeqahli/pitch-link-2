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
  Bug,
  Star,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function SupportPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);

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

  const handleQuickAction = (action) => {
    switch (action) {
      case "bug":
        Alert.alert(
          "Report a Bug",
          "Please describe the issue you're experiencing:",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Submit", style: "default" },
          ]
        );
        break;
      case "rate":
        Alert.alert(
          "Rate the App",
          "You will be redirected to the app store to rate our application.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Continue", style: "default" },
          ]
        );
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
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {/* Contact Support Section */}
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
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
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  Call Support
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  +234 803 123 4567
                </Text>
              </View>
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
                  backgroundColor: colors.footballGreen,
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
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  Email Support
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  support@pitchowner.ng
                </Text>
              </View>
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
                  backgroundColor: "#25D366",
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
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  WhatsApp Support
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Chat with our support team
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick Actions Section */}
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>

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
            {/* Report a Bug */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
              onPress={() => handleQuickAction("bug")}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.warning,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Bug size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  Report a Bug
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Report any issues you've encountered
                </Text>
              </View>
            </TouchableOpacity>

            {/* Rate the App */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
              }}
              onPress={() => handleQuickAction("rate")}
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
                <Star size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  Rate the App
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Share your experience with us
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}