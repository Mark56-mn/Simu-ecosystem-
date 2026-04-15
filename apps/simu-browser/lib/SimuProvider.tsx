import React, { useRef, useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, TextInput } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface SimuProviderProps {
  url: string;
  walletAddress: string;
}

export const SimuProvider: React.FC<SimuProviderProps> = ({ url, walletAddress }) => {
  const webViewRef = useRef<WebView>(null);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [pin, setPin] = useState('');

  // Inject window.simu into the WebView
  const injectedScript = `
    window.simu = {
      isSimu: true,
      address: '${walletAddress}',
      callbacks: {},
      requestPermissions: function() {
        return this._sendMsg('requestPermissions', {});
      },
      getBalance: function() {
        return this._sendMsg('getBalance', {});
      },
      send: function(to, amount) {
        return this._sendMsg('send', { to, amount });
      },
      signMessage: function(msg) {
        return this._sendMsg('signMessage', { msg });
      },
      _sendMsg: function(method, params) {
        return new Promise((resolve, reject) => {
          const id = Math.random().toString(36).substr(2, 9);
          this.callbacks[id] = { resolve, reject };
          window.ReactNativeWebView.postMessage(JSON.stringify({ id, method, params }));
        });
      }
    };
    true;
  `;

  const handleMessage = async (event: WebViewMessageEvent) => {
    const { id, method, params } = JSON.parse(event.nativeEvent.data);
    const origin = event.nativeEvent.url;

    // Basic Origin Validation
    if (!origin.startsWith('https://')) {
      sendResponse(id, null, 'Insecure origin blocked');
      return;
    }

    switch (method) {
      case 'requestPermissions':
        sendResponse(id, { granted: true, address: walletAddress });
        break;
      case 'getBalance':
        // Fetch from local state or Supabase
        sendResponse(id, { balance: 1000 }); 
        break;
      case 'send':
        setPendingTx({ id, ...params, origin });
        break;
      case 'signMessage':
        sendResponse(id, { signature: '0x_mock_signature_' + Date.now() });
        break;
      default:
        sendResponse(id, null, 'Unknown method');
    }
  };

  const sendResponse = (id: string, result: any, error?: string) => {
    const script = `
      if (window.simu.callbacks['${id}']) {
        ${error 
          ? `window.simu.callbacks['${id}'].reject(new Error('${error}'));` 
          : `window.simu.callbacks['${id}'].resolve(${JSON.stringify(result)});`
        }
        delete window.simu.callbacks['${id}'];
      }
      true;
    `;
    webViewRef.current?.injectJavaScript(script);
  };

  const approveTransaction = () => {
    if (pin === '2026') { // Mock PIN check
      sendResponse(pendingTx.id, { txId: 'tx_' + Date.now(), status: 'success' });
      setPendingTx(null);
      setPin('');
    } else {
      alert('Invalid PIN');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScriptBeforeContentLoaded={injectedScript}
        onMessage={handleMessage}
      />
      
      {pendingTx && (
        <Modal transparent visible animationType="slide">
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Approve Transaction</Text>
              <Text>Origin: {pendingTx.origin}</Text>
              <Text>To: {pendingTx.to}</Text>
              <Text>Amount: {pendingTx.amount} SIMU</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                placeholder="Enter PIN" 
                value={pin} 
                onChangeText={setPin} 
              />
              <View style={styles.row}>
                <TouchableOpacity onPress={() => { sendResponse(pendingTx.id, null, 'User rejected'); setPendingTx(null); }}>
                  <Text style={styles.btnReject}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={approveTransaction}>
                  <Text style={styles.btnApprove}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  modal: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnReject: { color: 'red', padding: 10 },
  btnApprove: { color: 'green', padding: 10, fontWeight: 'bold' }
});
