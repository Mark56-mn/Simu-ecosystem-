import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function BugsScreen() {
  const bugs = [
    { id: '1', app: 'Browser', severity: 'High', title: 'Crash on offline mode' },
    { id: '2', app: 'Nodes', severity: 'Medium', title: 'Thermal throttle not triggering' }
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={bugs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.appBadge}>{item.app}</Text>
              <Text style={[styles.severity, { color: item.severity === 'High' ? '#ff4444' : '#ffaa00' }]}>
                {item.severity}
              </Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  card: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 8, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  appBadge: { color: '#000', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
  severity: { fontWeight: 'bold', fontSize: 12 },
  title: { color: '#fff', fontSize: 16 }
});
