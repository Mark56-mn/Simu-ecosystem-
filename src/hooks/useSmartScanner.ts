import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import jsQR from 'jsqr';

const SIMU_REGEX = /^SIMU:\d+:\d+:[a-f0-9]+:.+:[A-Za-z0-9+/=]+$/;

export const useSmartScanner = (onValidScan: (data: string) => void) => {
  const [isValidating, setIsValidating] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validateAndRedeem = useCallback((data: string) => {
    if (SIMU_REGEX.test(data)) {
      setScanSuccess(true);
      showToast('SIMU Code Found');
      setTimeout(() => {
        onValidScan(data);
        setScanSuccess(false);
      }, 800);
      return true;
    }
    return false;
  }, [onValidScan]);

  const handleCameraScan = ({ data }: { data: string }) => {
    if (scanSuccess || isValidating) return;
    validateAndRedeem(data);
  };

  const handleImageUpload = async () => {
    setIsValidating(true);
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          if (!file) return setIsValidating(false);
          
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return setIsValidating(false);
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code && validateAndRedeem(code.data)) return;
            showToast('No valid SIMU code in image');
            setIsValidating(false);
          };
          img.src = URL.createObjectURL(file);
        };
        input.click();
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
        });
        
        if (result.canceled || !result.assets[0].base64) {
          return setIsValidating(false);
        }
        
        showToast('Native image decoding requires canvas polyfill');
        setIsValidating(false);
      }
    } catch (error) {
      showToast('Error processing image');
      setIsValidating(false);
    }
  };

  return { handleCameraScan, handleImageUpload, scanSuccess, toast, isValidating };
};
