import { IpcMessage, verifyMessage } from '../../packages/@simu/ecosystem-core/ipc';

export interface Intent {
  action: string;
  data: any;
}

export const handleIntent = (message: IpcMessage, senderPublicKey: string) => {
  if (!verifyMessage(message, senderPublicKey)) {
    console.error('Invalid intent signature');
    return false;
  }

  const intent = message.payload as Intent;
  
  switch (intent.action) {
    case 'simu.browser.open':
      console.log('Opening SIMU Browser:', intent.data.path);
      // Fallback: window.open(`simu-browser://${intent.data.path}`)
      return true;
      
    case 'simu.nodes.validate':
      console.log('Launching Ang Nodes validation:', intent.data.txBatch);
      // Fallback: window.location.href = `simu-nodes://validate`
      return true;
      
    default:
      console.warn('Unknown intent action:', intent.action);
      return false;
  }
};

export const sendIntent = (action: string, data: any) => {
  console.log(`Sending intent: ${action}`, data);
  // In a real app, this would use Android Intents or deep links
  // window.location.href = `simu-app://${action}?data=${encodeURIComponent(JSON.stringify(data))}`;
};
