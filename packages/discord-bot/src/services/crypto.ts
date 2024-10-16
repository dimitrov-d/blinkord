import { KMS } from '@aws-sdk/client-kms';
import { createHash } from 'crypto';

const kms = new KMS({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

export async function encryptText(text: string): Promise<string> {
  if (!text) throw new Error('Text to encrypt cannot be null or empty');

  const { CiphertextBlob } = await kms.encrypt({
    KeyId: process.env.AWS_KMS_KEY_ID,
    Plaintext: new TextEncoder().encode(text),
  });
  return Buffer.from(CiphertextBlob).toString('base64');
}

export async function decryptText(encryptedText: string): Promise<string> {
  if (!encryptedText) throw new Error('Encrypted text cannot be null or empty');

  const { Plaintext } = await kms.decrypt({
    CiphertextBlob: Buffer.from(encryptedText, 'base64'),
  });
  return new TextDecoder().decode(Plaintext);
}

export function hash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 30);
}
