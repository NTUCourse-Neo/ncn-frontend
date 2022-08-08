import AES from "crypto-js/aes";
import { enc } from "crypto-js";

const password =
  process.env.NEXT_PUBLIC_COURSE_TABLE_SECRET ?? "ncn-course-table-secret";

export function cipherId(id: string) {
  const ciphertext = AES.encrypt(id, password);
  return ciphertext.toString();
}

export function decipherId(id: string | null) {
  if (!id) return null;
  return AES.decrypt(id, password).toString(enc.Utf8);
}
