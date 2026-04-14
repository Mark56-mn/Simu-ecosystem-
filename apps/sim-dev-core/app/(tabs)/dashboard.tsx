import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>System Health</Text>
      
      <View style={styles.card}>
        <Text style={styles.appName}>SIMU Testnet</Text>
        <Text style={styles.statusOk}>Operational</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.appName}>SIMU Browser</Text>
        <Text style={styles.statusOk}>Operational</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.appName}>Ang Nodes</Text>
        <Text style={styles.statusWarn}>Degraded (High Latency)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  header: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#1a1a1a', padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statusOk: { color: '#00ff00' },
  statusWarn: { color: '#ffaa00' }
});
