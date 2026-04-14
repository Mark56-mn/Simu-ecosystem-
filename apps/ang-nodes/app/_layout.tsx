import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff',
      contentStyle: { backgroundColor: '#000' }
    }}>
      <Stack.Screen name="dashboard" options={{ title: 'Ang Nodes' }} />
      <Stack.Screen name="validation" options={{ title: 'Validation Activity' }} />
    </Stack>
  );
}
