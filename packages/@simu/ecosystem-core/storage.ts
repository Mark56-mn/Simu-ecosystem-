// Mock EncryptedSharedPreferences wrapper
export const secureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    // In a real app, this would use Android's EncryptedSharedPreferences
    // protected by signature permissions
    const encrypted = btoa(value); // Mock encryption
    localStorage.setItem(`secure_${key}`, encrypted);
  },
  
  getItem: async (key: string): Promise<string | null> => {
    const encrypted = localStorage.getItem(`secure_${key}`);
    if (!encrypted) return null;
    try {
      return atob(encrypted); // Mock decryption
    } catch (e) {
      return null;
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(`secure_${key}`);
  }
};
