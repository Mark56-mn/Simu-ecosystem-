import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { createApiClient, NodeStats } from '@simu/core';
import { Link } from 'expo-router';

const api = createApiClient(process.env.EXPO_PUBLIC_API_KEY);

export default function DashboardScreen() {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [isNodeActive, setIsNodeActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.get('/v1/nodes/stats?nodeId=bsm1_local');
      setStats(data);
    } catch (e) {
      // Fallback for offline/dev
      setStats({
        nodeId: 'bsm1_local',
        reputation: 98,
        validationsToday: 142,
        simuEarned: 5.2,
        uptime: 99.9,
        status: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} color="#00ff00" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nodeId}>{stats?.nodeId}</Text>
        <Text style={styles.rep}>Rep: {stats?.reputation}%</Text>
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Enable Node Mode</Text>
        <Switch 
          value={isNodeActive} 
          onValueChange={setIsNodeActive}
          trackColor={{ false: '#333', true: '#004400' }}
          thumbColor={isNodeActive ? '#00ff00' : '#888'}
        />
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Validations</Text>
          <Text style={styles.cardValue}>{stats?.validationsToday}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Earned</Text>
          <Text style={styles.cardValue}>{stats?.simuEarned} SIMU</Text>
        </View>
      </View>

      <Link href="/validation" style={styles.link}>
        <Text style={styles.linkText}>View Validation Activity →</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  nodeId: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  rep: { color: '#00ff00', fontSize: 18 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 20, borderRadius: 12, marginBottom: 20 },
  toggleText: { color: '#fff', fontSize: 16 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flex: 0.48, backgroundColor: '#1a1a1a', padding: 20, borderRadius: 12, alignItems: 'center' },
  cardLabel: { color: '#888', marginBottom: 10 },
  cardValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  link: { marginTop: 20, alignSelf: 'center' },
  linkText: { color: '#00ff00', fontSize: 16 }
});
