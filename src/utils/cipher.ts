import AES from "crypto-js/aes";
import { enc } from "crypto-js";

const password = process.env.NEXT_PUBLIC_COURSE_TABLE_SECRET;

export function cipherId(id: string) {
  if (!password) {
    return null;
  }
  const ciphertext = AES.encrypt(id, password);
  return ciphertext.toString();
}

export function decipherId(id: string | null) {
  if (!id) return null;
  if (!password) {
    return null;
  }
  return AES.decrypt(id, password).toString(enc.Utf8);
}
