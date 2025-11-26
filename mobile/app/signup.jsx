import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react-native";

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

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
    primaryGreen: "#00FF88",
  };

  const handleSignUp = () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // In a real app, you would send this data to your backend
    console.log("Sign up with:", formData);
    
    // Navigate to dashboard after successful sign up
    router.replace("/(tabs)/dashboard");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: insets.top + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 32,
                color: colors.primary,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Join PitchLink to manage your football pitches
            </Text>
          </View>

          {/* Full Name Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Full Name
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                paddingHorizontal: 16,
              }}
            >
              <User size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                placeholder="Enter your full name"
                placeholderTextColor={colors.secondary}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Email Address
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                paddingHorizontal: 16,
              }}
            >
              <Mail size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                placeholder="Enter your email"
                placeholderTextColor={colors.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                paddingHorizontal: 16,
              }}
            >
              <Lock size={20} color={colors.secondary} style={{ marginRight: 12 }} />
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                placeholder="Create a password"
                placeholderTextColor={colors.secondary}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.secondary} />
                ) : (
                  <Eye size={20} color={colors.secondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primaryGreen,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={handleSignUp}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#000000",
              }}
            >
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: colors.primaryGreen,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}