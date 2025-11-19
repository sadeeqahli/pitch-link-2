import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Building,
  MapPin,
  DollarSign,
  Edit,
  Plus,
  Users,
  Star,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function Pitches() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pitches, setPitches] = useState([]);
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

  useEffect(() => {
    loadPitches();
    
    // Check for font loading errors
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

  const loadPitches = async () => {
    try {
      setLoading(true);
      const storedPitches = await AsyncStorage.getItem('pitches');
      if (storedPitches) {
        const parsedPitches = JSON.parse(storedPitches);
        setPitches(parsedPitches);
      } else {
        // Initialize with empty array if no pitches exist
        setPitches([]);
      }
    } catch (error) {
      console.error("Error loading pitches:", error);
      setPitches([]);
      Alert.alert("Error", "Failed to load pitches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPitches();
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const togglePitchStatus = async (pitchId, currentStatus) => {
    try {
      // Update the pitch status in the local state
      const updatedPitches = pitches.map(pitch => 
        pitch._id === pitchId 
          ? { ...pitch, is_active: !currentStatus } 
          : pitch
      );
      
      setPitches(updatedPitches);
      
      // Save updated pitches to AsyncStorage
      await AsyncStorage.setItem('pitches', JSON.stringify(updatedPitches));
    
      // Show success message
      console.log("Pitch status updated successfully");
    } catch (error) {
      console.error("Error updating pitch status:", error);
      Alert.alert("Error", "Failed to update pitch status. Please try again.");
      
      // Reload pitches to revert the change in case of error
      loadPitches();
    }
  };

  const PitchCard = ({ pitch }) => (
    <View
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      {/* Pitch Image */}
      {pitch.photos && pitch.photos.length > 0 && (
        <Image
          source={{ uri: pitch.photos[0] }}
          style={{ width: "100%", height: 160 }}
          contentFit="cover"
          transition={300}
        />
      )}

      <View style={{ padding: 20 }}>
        {/* Header with status toggle */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {pitch.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={14} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  marginLeft: 4,
                }}
              >
                {pitch.location}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {pitch.is_active ? (
                <Eye size={16} color={colors.success} />
              ) : (
                <EyeOff size={16} color={colors.error} />
              )}
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: pitch.is_active ? colors.success : colors.error,
                  marginLeft: 4,
                }}
              >
                {pitch.is_active ? "Active" : "Inactive"}
              </Text>
            </View>
            <Switch
              value={pitch.is_active}
              onValueChange={() => togglePitchStatus(pitch._id, pitch.is_active)}
              trackColor={{
                false: colors.lightGray,
                true: colors.success,
              }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Pitch Details */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <DollarSign size={16} color={colors.secondary} style={{ marginRight: 4 }} />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                ₦{parseFloat(pitch.price_per_hour || 0).toLocaleString()}/hr
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Users size={16} color={colors.secondary} style={{ marginRight: 4 }} />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                {pitch.capacity || 0} players
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Star size={16} color={colors.secondary} style={{ marginRight: 4 }} />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                {pitch.rating || 0}/5
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Building size={16} color={colors.secondary} style={{ marginRight: 4 }} />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                {pitch.type || "Standard"}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.lightGray,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
            onPress={() => router.push(`/edit-pitch?id=${pitch._id}`)}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.primary,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.primaryGreen,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
            onPress={() => router.push(`/simple-edit-pitch?id=${pitch._id}`)}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: "#FFFFFF",
              }}
            >
              Quick Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
          Loading pitches...
        </Text>
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
            Pitches
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
            onPress={() => router.push("/add-pitch")}
          >
            <Plus size={20} color={colors.primary} />
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
          {/* Stats Overview */}
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
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Pitch Overview
            </Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 24,
                    color: colors.primary,
                  }}
                >
                  {pitches.length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                    marginTop: 4,
                  }}
                >
                  Total Pitches
                </Text>
              </View>
              
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 24,
                    color: colors.success,
                  }}
                >
                  {pitches.filter(p => p.is_active).length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                    marginTop: 4,
                  }}
                >
                  Active
                </Text>
              </View>
              
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 24,
                    color: colors.error,
                  }}
                >
                  {pitches.filter(p => !p.is_active).length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                    marginTop: 4,
                  }}
                >
                  Inactive
                </Text>
              </View>
            </View>
          </View>

          {/* Pitches List */}
          {pitches.length > 0 ? (
            pitches.map((pitch) => (
              <PitchCard key={pitch._id} pitch={pitch} />
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
              <Building size={40} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No Pitches Yet
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
                Add your first pitch to get started
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  marginTop: 16,
                }}
                onPress={() => router.push("/add-pitch")}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Add Pitch
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}