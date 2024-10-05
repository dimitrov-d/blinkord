import CryptoJS from 'crypto-js';
import env from './env';

export function encryptText(text: string): string {
  if (!text) return null;
  return CryptoJS.AES.encrypt(text, env.ENCRYPTION_KEY).toString();
}

export function decryptText(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
