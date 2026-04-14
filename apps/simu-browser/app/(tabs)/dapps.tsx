import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DAppsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approved dApps</Text>
      <Text style={styles.desc}>
        Web3 apps injected with SIMU Wallet context.
        (window.simu = {`{address, balance}`})
      </Text>
      <View style={styles.card}>
        <Text style={styles.appName}>SIMU DEX</Text>
        <Text style={styles.status}>Requires Wallet Permission</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  desc: { color: '#888', marginBottom: 20 },
  card: { padding: 15, backgroundColor: '#1a1a1a', borderRadius: 8 },
  appName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  status: { color: '#ffaa00', marginTop: 5, fontSize: 12 }
});
