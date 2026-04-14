import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createApiClient, Game } from '@simu/core';

const api = createApiClient(process.env.EXPO_PUBLIC_API_KEY);

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      // Fetching games from API. Caching strategy should be added here for offline support in Africa.
      const data = await api.get('/v1/browser/games');
      setGames(data.games || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load games. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} color="#00ff00" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconPlaceholder} />
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.size}>{item.sizeMB} MB</Text>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Play</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: '#ff4444', textAlign: 'center', marginTop: 20 },
  card: { flex: 1, margin: 5, padding: 10, backgroundColor: '#1a1a1a', borderRadius: 8, alignItems: 'center' },
  iconPlaceholder: { width: 60, height: 60, backgroundColor: '#333', borderRadius: 12, marginBottom: 10 },
  title: { color: '#fff', fontWeight: 'bold', marginBottom: 4 },
  size: { color: '#888', fontSize: 12, marginBottom: 10 },
  btn: { backgroundColor: '#00ff00', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: '#000', fontWeight: 'bold' }
});
