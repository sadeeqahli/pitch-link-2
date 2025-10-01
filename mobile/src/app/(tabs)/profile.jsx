import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  Alert,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Edit3,
  LogOut,
  ChevronRight,
  X,
  Check,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { ImagePicker } from "expo-image-picker";
import * as ImagePickerAPI from "expo-image-picker";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    phoneNumber: "+234 803 123 4567",
    emailAddress: "john.doe@example.com",
    location: "Lagos, Nigeria"
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
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowHeaderBorder(scrollY > 0);
  };

  const openImagePicker = async () => {
    setShowImagePicker(false);
    
    const { status } = await ImagePickerAPI.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePickerAPI.launchImageLibraryAsync({
      mediaTypes: ImagePickerAPI.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setShowImagePicker(false);
    
    const { status } = await ImagePickerAPI.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry', 'We need camera permissions to make this work!');
      return;
    }

    let result = await ImagePickerAPI.launchCameraAsync({
      mediaTypes: ImagePickerAPI.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    setProfileData({
      ...profileData,
      [editingField]: editValue
    });
    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => router.push("/login") },
      ]
    );
  };

  const handleSupportPress = () => {
    router.push("../support");
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
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 24,
            color: colors.primary,
            textAlign: "center",
          }}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {/* Profile Picture Section */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View style={{ position: "relative" }}>
              <TouchableOpacity onPress={() => setShowImagePicker(true)}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      marginBottom: 16,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: colors.lightGray,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <User size={48} color={colors.secondary} />
                  </View>
                )}
                <View
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 0,
                    backgroundColor: colors.footballGreen,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: colors.white,
                  }}
                >
                  <Camera size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
            
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 22,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {profileData.fullName}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Professional Pitch Owner with 5+ years of experience managing premium sports facilities.
            </Text>
          </View>

          {/* Stats Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                128
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Bookings
              </Text>
            </View>
            
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                4.8
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Rating
              </Text>
            </View>
            
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                42
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Favorites
              </Text>
            </View>
          </View>

          {/* Personal Information Section */}
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Personal Information
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
            {/* Full Name */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <User size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Full Name
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  >
                    {profileData.fullName}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => startEditing("fullName", profileData.fullName)}>
                <Edit3 size={20} color={colors.footballGreen} />
              </TouchableOpacity>
            </View>

            {/* Phone Number */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Phone size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Phone Number
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  >
                    {profileData.phoneNumber}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => startEditing("phoneNumber", profileData.phoneNumber)}>
                <Edit3 size={20} color={colors.footballGreen} />
              </TouchableOpacity>
            </View>

            {/* Email Address */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Mail size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Email Address
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  >
                    {profileData.emailAddress}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => startEditing("emailAddress", profileData.emailAddress)}>
                <Edit3 size={20} color={colors.footballGreen} />
              </TouchableOpacity>
            </View>

            {/* Location */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={20} color={colors.secondary} style={{ marginRight: 12 }} />
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Location
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  >
                    {profileData.location}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => startEditing("location", profileData.location)}>
                <Edit3 size={20} color={colors.footballGreen} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
            onPress={handleSupportPress}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              Support
            </Text>
            <ChevronRight size={20} color={colors.secondary} />
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.error,
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImagePicker}
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            backgroundColor: colors.cardBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: insets.bottom + 20
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
              }}>
                Select Image
              </Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <X size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={{
                padding: 16,
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={openCamera}
            >
              <Camera size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <Text style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: colors.primary,
              }}>
                Take Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                padding: 16,
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={openImagePicker}
            >
              <User size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <Text style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: colors.primary,
              }}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Field Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editingField !== null}
        onRequestClose={cancelEdit}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24
        }}>
          <View style={{
            backgroundColor: colors.cardBg,
            borderRadius: 20,
            padding: 20,
            width: '100%',
            maxWidth: 400
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: colors.primary,
              }}>
                Edit {editingField === 'fullName' ? 'Full Name' : 
                       editingField === 'phoneNumber' ? 'Phone Number' : 
                       editingField === 'emailAddress' ? 'Email Address' : 'Location'}
              </Text>
              <TouchableOpacity onPress={cancelEdit}>
                <X size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={{
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                padding: 16,
                fontFamily: "Poppins_400Regular",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 20
              }}
              value={editValue}
              onChangeText={setEditValue}
              autoFocus
            />
            
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  marginRight: 8,
                  alignItems: 'center'
                }}
                onPress={cancelEdit}
              >
                <Text style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 16,
                  color: colors.primary,
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: colors.footballGreen,
                  borderRadius: 12,
                  marginLeft: 8,
                  alignItems: 'center'
                }}
                onPress={saveEdit}
              >
                <Text style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 16,
                  color: '#FFFFFF',
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}