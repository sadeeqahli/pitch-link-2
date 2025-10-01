import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";

export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, navigate to dashboard
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality will be implemented in a future update.");
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior="padding"
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 24,
          paddingTop: insets.top + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.footballGreen,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 24,
                color: "#FFFFFF",
              }}
            >
              PL
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 28,
              color: colors.primary,
              marginBottom: 8,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Sign in to continue to your dashboard
          </Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
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
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          >
            <Mail size={20} color={colors.secondary} style={{ marginRight: 12 }} />
            <TextInput
              style={{
                flex: 1,
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Enter your email"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text
            style={{
              fontFamily: "Poppins_500Medium",
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
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          >
            <Lock size={20} color={colors.secondary} style={{ marginRight: 12 }} />
            <TextInput
              style={{
                flex: 1,
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Enter your password"
              placeholderTextColor={colors.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              {hidePassword ? (
                <EyeOff size={20} color={colors.secondary} />
              ) : (
                <Eye size={20} color={colors.secondary} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ alignItems: "flex-end", marginTop: 8 }}
            onPress={handleForgotPassword}
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: colors.footballGreen,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: loading ? colors.secondary : colors.footballGreen,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            marginBottom: 24,
          }}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.inputBorder }}
          />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginHorizontal: 16,
            }}
          >
            Or continue with
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.inputBorder }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.lightGray,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              G
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.lightGray,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              f
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.lightGray,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              in
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginRight: 4,
            }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
                color: colors.footballGreen,
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}