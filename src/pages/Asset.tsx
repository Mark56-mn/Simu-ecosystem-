import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useAssetBalance } from '../hooks/useAssetBalance';
import { useScanRedeem } from '../hooks/useScanRedeem';
import { SmartScanner } from '../components/SmartScanner';

export default function Asset({ navigation }: any) {
  const deviceId = 'device-123';
  const { balance, txs, refresh } = useAssetBalance(deviceId);
  const [scanMode, setScanMode] = useState(false);
  const [ussdCode, setUssdCode] = useState('');
  const { redeem, loading } = useScanRedeem(deviceId, () => { setScanMode(false); refresh(); });

  const getBadge = (status: string) => {
    const colors: any = { provisional: '🟡', confirmed: '🟢', rolled_back: '🔴' };
    return colors[status] || '⚪';
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>SIMU Asset</Text>
      <Text style={{ color: '#10b981', fontSize: 48, fontWeight: 'bold', marginVertical: 20 }}>{balance} SIMU</Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 30 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#27272a', padding: 15, borderRadius: 10, alignItems: 'center' }} onPress={() => navigation.navigate('Generate')}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#10b981', padding: 15, borderRadius: 10, alignItems: 'center' }} onPress={() => setScanMode(true)}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>Receive</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={txs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#18181b', borderRadius: 10, marginBottom: 10 }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 16 }}>{item.type === 'credit' ? '+' : '-'}{item.amount}</Text>
              <Text style={{ color: '#a1a1aa', fontSize: 12 }}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
            <Text>{getBadge(item.status)}</Text>
          </View>
        )}
      />

      <Modal visible={scanMode} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flex: 1 }}>
            <SmartScanner onScan={(data) => redeem(data, false)} onClose={() => setScanMode(false)} />
          </View>
          <View style={{ padding: 20, backgroundColor: '#18181b' }}>
            <Text style={{ color: '#fff', marginBottom: 10 }}>Or enter 6-digit code:</Text>
            <TextInput style={{ backgroundColor: '#27272a', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 }} value={ussdCode} onChangeText={setUssdCode} keyboardType="number-pad" maxLength={6} />
            <TouchableOpacity style={{ backgroundColor: '#10b981', padding: 15, borderRadius: 10, alignItems: 'center' }} onPress={() => redeem(ussdCode, true)} disabled={loading}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>{loading ? 'Verifying...' : 'Redeem Code'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
