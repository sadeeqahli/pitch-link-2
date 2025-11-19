import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  Key,
  Settings,
  Bell,
  Building,
  HelpCircle,
  Shield,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as ImagePickerAPI from "expo-image-picker";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Add the useAuth import
import { useAuth } from '@/utils/auth/useAuth';
import { countries, states } from '@/utils/countriesAndStates';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut: authSignOut } = useAuth(); // Get the signOut function from useAuth
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Profile data with defaults as specified
  const [profileData, setProfileData] = useState({
    fullName: "John Smith",
    businessName: "Smith Football Complex",
    emailAddress: "john.smith@pitchlink.com",
    phoneNumber: "+44 20 7123 4567",
    location: "Lagos, Nigeria",
    country: "NG",
    state: "LA"
  });

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
    // Check for font loading errors
    if (fontLoadErrorResult) {
      setFontLoadError(true);
      console.log("Font loading error:", fontLoadErrorResult);
    }
  }, [fontLoadErrorResult]);

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

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive", 
          onPress: () => {
            authSignOut(); // Clear the authentication state
            router.push("/login"); // Navigate to login page
          } 
        },
      ]
    );
  };

  const handleSupportPress = () => {
    router.push("../support");
  };

  const openEditProfileModal = () => {
    setShowEditProfileModal(true);
  };

  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
  };

  const saveProfileChanges = (updatedData) => {
    // Update location based on selected country and state
    const countryName = countries.find(c => c.id === updatedData.country)?.name || "Nigeria";
    const stateName = states[updatedData.country]?.find(s => s.id === updatedData.state)?.name || "Lagos";
    
    const updatedProfileData = {
      ...updatedData,
      location: `${stateName}, ${countryName}`
    };
    
    setProfileData(updatedProfileData);
    
    // In a real app, you would save the data to your backend here
    setShowEditProfileModal(false);
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
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 28,
            color: colors.primary,
            textAlign: "center",
          }}
        >
          Profile
        </Text>
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 16,
            color: colors.secondary,
            textAlign: "center",
            marginTop: 4,
          }}
        >
          Manage your account and settings
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Profile Card */}
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ position: "relative", marginRight: 16 }}>
                  <TouchableOpacity onPress={() => setShowImagePicker(true)}>
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          backgroundColor: colors.lightGray,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <User size={24} color={colors.secondary} />
                      </View>
                    )}
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: colors.primaryGreen,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: colors.white,
                      }}
                    >
                      <Camera size={10} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </View>
                
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 18,
                      color: colors.primary,
                      marginBottom: 4,
                    }}
                  >
                    {profileData.fullName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    {profileData.businessName}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={{
                  backgroundColor: colors.lightGray,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
                onPress={openEditProfileModal}
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
            </View>
            
            {/* Contact Information */}
            <View style={{ marginTop: 20 }}>
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                paddingVertical: 8 
              }}>
                <Mail size={16} color={colors.secondary} style={{ marginRight: 12, width: 20 }} />
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {profileData.emailAddress}
                </Text>
              </View>
              
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                paddingVertical: 8 
              }}>
                <Phone size={16} color={colors.secondary} style={{ marginRight: 12, width: 20 }} />
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {profileData.phoneNumber}
                </Text>
              </View>
              
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                paddingVertical: 8 
              }}>
                <MapPin size={16} color={colors.secondary} style={{ marginRight: 12, width: 20 }} />
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  {profileData.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Account Settings Section */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Account Settings
          </Text>

          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              marginBottom: 24,
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Change Password */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lightGray,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Key size={18} color={colors.secondary} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 2,
                    }}
                  >
                    Change Password
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    Update your password
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.secondary} />
            </TouchableOpacity>

            {/* General Settings */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lightGray,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Settings size={18} color={colors.secondary} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 2,
                    }}
                  >
                    General Settings
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    App preferences and defaults
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.secondary} />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lightGray,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Bell size={18} color={colors.secondary} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 2,
                    }}
                  >
                    Notifications
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    Manage alerts and reminders
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.secondary} />
            </TouchableOpacity>

            {/* Business Settings */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lightGray,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Building size={18} color={colors.secondary} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 2,
                    }}
                  >
                    Business Settings
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    Manage your business info
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Support
          </Text>

          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              marginBottom: 24,
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Help Center */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2C" : "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lightGray,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <HelpCircle size={18} color={colors.secondary} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 2,
                    }}
                  >
                    Help Center
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    FAQs and support articles
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.secondary} />
            </TouchableOpacity>

            {/* Terms & Privacy */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lightGray,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Shield size={18} color={colors.secondary} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 2,
                    }}
                  >
                    Terms & Privacy
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    Legal documents and policies
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Sign Out Option */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: isDark ? "#000000" : "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
            onPress={handleSignOut}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.error,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <LogOut size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 2,
                  }}
                >
                  Sign Out
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Sign out of your account
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.secondary} />
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
                fontFamily: "Inter_600SemiBold",
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
                fontFamily: "Inter_500Medium",
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
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: colors.primary,
              }}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        visible={showEditProfileModal}
        onClose={closeEditProfileModal}
        profileData={profileData}
        onSave={saveProfileChanges}
        countries={countries}
        states={states}
        colors={colors}
        insets={insets}
      />
    </View>
  );
}

// Separate component for the Edit Profile Modal
const EditProfileModal = ({ visible, onClose, profileData, onSave, countries, states, colors, insets }) => {
  const [editedData, setEditedData] = useState({ ...profileData });
  
  useEffect(() => {
    if (visible) {
      setEditedData({ ...profileData });
    }
  }, [visible, profileData]);

  const handleSave = () => {
    onSave(editedData);
  };

  const handleCountryChange = (countryCode) => {
    setEditedData({
      ...editedData,
      country: countryCode,
      state: states[countryCode] ? states[countryCode][0].id : ""
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
      }}>
        <View style={{
          backgroundColor: colors.cardBg,
          borderRadius: 20,
          padding: 20,
          width: '100%',
          maxHeight: '80%',
        }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: colors.primary,
            }}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ maxHeight: 400 }}>
            {/* Full Name */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8
              }}>
                Full Name
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={editedData.fullName}
                onChangeText={(text) => setEditedData({...editedData, fullName: text})}
                placeholder="Enter your full name"
              />
            </View>
            
            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8
              }}>
                Email
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={editedData.emailAddress}
                onChangeText={(text) => setEditedData({...editedData, emailAddress: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            {/* Phone */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8
              }}>
                Phone
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={editedData.phoneNumber}
                onChangeText={(text) => setEditedData({...editedData, phoneNumber: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            {/* Business Name */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8
              }}>
                Business Name
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
                value={editedData.businessName}
                onChangeText={(text) => setEditedData({...editedData, businessName: text})}
                placeholder="Enter your business name"
              />
            </View>
            
            {/* Country */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8
              }}>
                Country
              </Text>
              <View
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Picker
                  selectedValue={editedData.country}
                  onValueChange={handleCountryChange}
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  {countries.map(country => (
                    <Picker.Item key={country.id} label={country.name} value={country.id} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* State */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 8
              }}>
                State
              </Text>
              <View
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Picker
                  selectedValue={editedData.state}
                  onValueChange={(value) => setEditedData({...editedData, state: value})}
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  {states[editedData.country]?.map(state => (
                    <Picker.Item key={state.id} label={state.name} value={state.id} />
                  ))}
                </Picker>
              </View>
            </View>
          </ScrollView>
          
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity 
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: colors.lightGray,
                borderRadius: 12,
                marginRight: 8,
                alignItems: 'center'
              }}
              onPress={onClose}
            >
              <Text style={{
                fontFamily: "Inter_500Medium",
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
                backgroundColor: colors.primaryGreen,
                borderRadius: 12,
                marginLeft: 8,
                alignItems: 'center'
              }}
              onPress={handleSave}
            >
              <Text style={{
                fontFamily: "Inter_500Medium",
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
  );
}
