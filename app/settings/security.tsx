import { useState, useEffect } from 'react'
import { StyleSheet, Switch, View, Alert } from 'react-native'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import * as BiometricService from '@/services/biometricService'
import { useAuth } from '@/contexts/AuthContext'

export default function SecuritySettingsScreen() {
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Get theme colors
  const textColor = useThemeColor({}, 'text')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const tintColor = useThemeColor({}, 'tint')
  const dividerColor = useThemeColor({}, 'divider')
  const cardBgColor = useThemeColor({}, 'cardBackground')

  useEffect(() => {
    checkBiometricStatus()
  }, [])

  const checkBiometricStatus = async () => {
    try {
      const available = await BiometricService.isBiometricAvailable();
      setBiometricAvailable(available);
      
      if (available) {
        const enabled = await BiometricService.isBiometricEnabled();
        setBiometricEnabled(enabled);
      }
    } catch (error) {
      console.warn('Error checking biometrics:', error);
      setBiometricAvailable(false);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    setIsLoading(true);
    
    try {
      if (value) {
        // Enable biometric
        if (!user?.email) {
          Alert.alert('Error', 'Please log in again to enable biometric authentication');
          setIsLoading(false);
          return;
        }
        
        // First authenticate with biometrics to confirm user identity
        const authenticated = await BiometricService.authenticateWithBiometric();
        if (!authenticated) {
          // Check if packages are installed
          const available = await BiometricService.isBiometricAvailable();
          if (!available) {
            Alert.alert(
              'Required Packages Not Installed',
              'To use biometric authentication, you need to install additional packages. See INSTALL_PACKAGES.md for instructions.',
              [{ text: 'OK' }]
            );
            setIsLoading(false);
            return;
          }
          
          // Create a prompt to get the password
          Alert.prompt(
            'Enter Password',
            'Please enter your password to enable biometric authentication',
            [
              { 
                text: 'Cancel', 
                style: 'cancel',
                onPress: () => setIsLoading(false)
              },
              {
                text: 'Enable',
                onPress: async (password) => {
                  if (!password) {
                    Alert.alert('Error', 'Password is required');
                    setIsLoading(false);
                    return;
                  }
                  
                  const success = await BiometricService.enableBiometric(user.email, password);
                  if (success) {
                    setBiometricEnabled(true);
                    Alert.alert('Success', 'Biometric authentication enabled');
                  } else {
                    Alert.alert('Error', 'Failed to enable biometric authentication');
                  }
                  setIsLoading(false);
                },
              },
            ],
            'secure-text'
          );
        } else {
          setIsLoading(false);
        }
      } else {
        // Disable biometric
        const success = await BiometricService.disableBiometric();
        if (success) {
          setBiometricEnabled(false);
          Alert.alert('Success', 'Biometric authentication disabled');
        } else {
          Alert.alert('Error', 'Failed to disable biometric authentication');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      Alert.alert('Error', 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Security Settings' }} />

      <ThemedView style={[styles.section, { backgroundColor: cardBgColor }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Authentication
        </ThemedText>

        <View style={[styles.settingItem, { borderBottomColor: dividerColor }]}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="key-outline" size={22} color={textColor} />
            </View>
            <ThemedText style={styles.settingText}>Change Password</ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={secondaryTextColor}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: dividerColor }]}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-outline" size={22} color={textColor} />
            </View>
            <View>
              <ThemedText style={styles.settingText}>
                Two-Factor Authentication
              </ThemedText>
              <ThemedText
                style={[
                  styles.settingDescription,
                  { color: secondaryTextColor },
                ]}
              >
                Secure your account with 2FA
              </ThemedText>
            </View>
          </View>
          <Switch
            value={true}
            disabled={true}
            trackColor={{ false: '#D1D1D6', true: tintColor }}
            thumbColor={'#FFFFFF'}
          />
        </View>

        {biometricAvailable && (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="finger-print-outline"
                  size={22}
                  color={textColor}
                />
              </View>
              <View>
                <ThemedText style={styles.settingText}>
                  Biometric Authentication
                </ThemedText>
                <ThemedText
                  style={[
                    styles.settingDescription,
                    { color: secondaryTextColor },
                  ]}
                >
                  Login with Face ID or Touch ID
                </ThemedText>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              disabled={isLoading}
              trackColor={{ false: '#D1D1D6', true: tintColor }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        )}
      </ThemedView>

      <ThemedView
        style={[
          styles.section,
          { backgroundColor: cardBgColor, marginTop: 20 },
        ]}
      >
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Session
        </ThemedText>

        <View style={[styles.settingItem, { borderBottomColor: dividerColor }]}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="log-out-outline" size={22} color="#E53935" />
            </View>
            <ThemedText style={[styles.settingText, { color: '#E53935' }]}>
              Log Out from All Devices
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedText style={[styles.securityInfo, { color: secondaryTextColor }]}>
        Biometric authentication adds an extra layer of security to your account
        and allows you to log in quickly with your device's authentication.
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  securityInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 16,
  },
})
