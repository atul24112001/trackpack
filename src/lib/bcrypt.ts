import crypto from "crypto";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

const secret = process.env.NEXT_PUBLIC_SECRET as string;

function deriveKey(secret: string) {
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptMessage(message: string) {
  try {
    const key = deriveKey(secret);
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const messageUint8 = naclUtil.decodeUTF8(message);
    const encrypted = nacl.secretbox(messageUint8, nonce, key);

    return {
      nonce: naclUtil.encodeBase64(nonce),
      ciphertext: naclUtil.encodeBase64(encrypted),
    };
  } catch (error) {
    console.log(error);
  }
  return {
    nonce: "",
    ciphertext: "",
  };
}

export function decryptMessage(encryptedData: {
  nonce: string;
  ciphertext: string;
}) {
  try {
    const key = deriveKey(secret);
    const nonce = naclUtil.decodeBase64(encryptedData.nonce);
    const ciphertext = naclUtil.decodeBase64(encryptedData.ciphertext);
    const decrypted = nacl.secretbox.open(ciphertext, nonce, key);
    if (!decrypted) {
      throw new Error("Decryption failed!");
    }

    return naclUtil.encodeUTF8(decrypted);
  } catch (error) {
    console.log(error);
  }
  return "";
}
