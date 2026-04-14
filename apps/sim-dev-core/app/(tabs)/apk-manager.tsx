import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ApkManagerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Release Management</Text>
      
      <View style={styles.uploadBox}>
        <Text style={styles.uploadText}>+ Select APK File</Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Push Update Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  uploadBox: { borderWidth: 2, borderColor: '#333', borderStyle: 'dashed', padding: 40, alignItems: 'center', borderRadius: 12, marginBottom: 20 },
  uploadText: { color: '#888', fontSize: 16 },
  btn: { backgroundColor: '#00ff00', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: 'bold' }
});
