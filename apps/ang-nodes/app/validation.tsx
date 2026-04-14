import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function ValidationScreen() {
  const recentTx = [
    { id: 'tx_1', status: 'valid', time: '2 mins ago' },
    { id: 'tx_2', status: 'invalid', time: '5 mins ago' },
    { id: 'tx_3', status: 'valid', time: '12 mins ago' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Validations</Text>
      <Text style={styles.subtitle}>Thermal Guard: Active (38°C)</Text>
      
      <FlatList
        data={recentTx}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.txId}>{item.id}</Text>
            <Text style={[styles.status, { color: item.status === 'valid' ? '#00ff00' : '#ff4444' }]}>
              {item.status.toUpperCase()}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#888', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  txId: { color: '#fff', flex: 1 },
  status: { fontWeight: 'bold', width: 80, textAlign: 'center' },
  time: { color: '#888', width: 80, textAlign: 'right' }
});
