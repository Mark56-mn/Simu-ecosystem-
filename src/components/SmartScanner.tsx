import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSmartScanner } from '../hooks/useSmartScanner';

interface Props {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const SmartScanner: React.FC<Props> = ({ onScan, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  
  const handleValidScan = (data: string) => {
    Vibration.vibrate(100); // Haptic feedback
    onScan(data);
  };

  const { handleCameraScan, handleImageUpload, scanSuccess, toast } = useSmartScanner(handleValidScan);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleCameraScan}
      />
      
      <View style={styles.overlay}>
        <View style={[styles.frame, scanSuccess && styles.frameSuccess]} />
      </View>

      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={handleImageUpload}>
          <Text style={styles.btnText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', marginBottom: 20 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  frame: { width: 250, height: 250, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 24 },
  frameSuccess: { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 4 },
  toast: { position: 'absolute', top: 60, backgroundColor: '#18181b', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, borderWidth: 1, borderColor: '#27272a' },
  toastText: { color: '#10b981', fontWeight: 'bold', fontSize: 16 },
  controls: { position: 'absolute', bottom: 50, flexDirection: 'row', gap: 15 },
  btn: { backgroundColor: '#27272a', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  btnCancel: { backgroundColor: '#ef4444' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
