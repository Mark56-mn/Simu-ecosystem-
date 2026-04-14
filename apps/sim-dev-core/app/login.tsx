import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    })();
  }, []);

  const handleLogin = () => {
    // Admin auth logic here
    router.replace('/(tabs)/dashboard');
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access SIMU Admin Core',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication was not successful.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during biometric authentication.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIMU Admin Core</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Admin Email" 
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Authenticate</Text>
      </TouchableOpacity>

      {isBiometricSupported && (
        <TouchableOpacity style={styles.bioBtn} onPress={handleBiometricAuth}>
          <Text style={styles.bioBtnText}>Login with Biometrics</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
  btn: { backgroundColor: '#00ff00', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  bioBtn: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: '#00ff00' },
  bioBtnText: { color: '#00ff00', fontWeight: 'bold', fontSize: 16 }
});
