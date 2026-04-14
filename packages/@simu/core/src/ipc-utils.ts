export interface IntentPayload {
  action: string;
  data: any;
  signature?: string;
}

export const createIntentUrl = (scheme: string, payload: IntentPayload) => {
  const encoded = encodeURIComponent(JSON.stringify(payload));
  return `${scheme}intent?payload=${encoded}`;
};

export const parseIntent = (url: string): IntentPayload | null => {
  try {
    const params = new URLSearchParams(url.split('?')[1]);
    const payload = params.get('payload');
    return payload ? JSON.parse(decodeURIComponent(payload)) : null;
  } catch {
    return null;
  }
};
