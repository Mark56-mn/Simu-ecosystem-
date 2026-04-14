import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#121212', borderTopColor: '#333' },
      tabBarActiveTintColor: '#00ff00',
      tabBarInactiveTintColor: '#888',
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff',
      sceneStyle: { backgroundColor: '#000' }
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Overview' }} />
      <Tabs.Screen name="bugs" options={{ title: 'Bugs' }} />
      <Tabs.Screen name="apk-manager" options={{ title: 'APKs' }} />
    </Tabs>
  );
}
