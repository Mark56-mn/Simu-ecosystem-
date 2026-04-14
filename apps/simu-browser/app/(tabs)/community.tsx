import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { createApiClient, Post } from '@simu/core';

const api = createApiClient(process.env.EXPO_PUBLIC_API_KEY);

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/v1/community/posts')
      .then(data => setPosts(data.posts || []))
      .catch(() => setPosts([])) // Fallback to empty for now
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} color="#00ff00" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.meta}>
              <Text style={styles.author}>u/{item.author}</Text>
              <Text style={styles.upvotes}>↑ {item.upvotes}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No posts available offline.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center' },
  post: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#fff', fontSize: 16, marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  author: { color: '#888', fontSize: 12 },
  upvotes: { color: '#00ff00', fontSize: 12, fontWeight: 'bold' },
  empty: { color: '#888', textAlign: 'center', marginTop: 20 }
});
