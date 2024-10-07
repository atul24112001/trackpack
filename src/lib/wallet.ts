import { mnemonicToSeedSync } from "bip39";
import { decryptMessage, encryptMessage } from "./bcrypt";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";

export function _createWallet(
  seed: string,
  selectedNetwork: string,
  accountId: string,
  accountTitle: string
) {
  let walletNumber = 0;
  const state = localStorage.getItem("state");
  let wallets: null | { [key: string]: Account } = null;
  if (state) {
    const payload = decryptMessage(JSON.parse(state));
    if (Array.isArray(JSON.parse(payload))) {
      wallets = JSON.parse(payload).wallets;
      walletNumber =
        JSON.parse(payload || "{}").accounts?.[accountId]?.wallets?.[
          selectedNetwork
        ]?.length?.toString() || 0;
    }
  }
  const path = `m/44'/${selectedNetwork}'/${walletNumber}'/0'`;
  const derivedSeed = derivePath(path, seed).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();

  const updatedWallets: { [key: string]: Account } = JSON.parse(
    JSON.stringify(wallets || {})
  );
  if (!updatedWallets[accountId]) {
    updatedWallets[accountId] = {
      title: accountTitle,
      wallets: {},
    };
  }

  if (!updatedWallets[accountId].wallets[selectedNetwork]) {
    updatedWallets[accountId].wallets[selectedNetwork] = [];
  }

  updatedWallets[accountId].wallets[selectedNetwork][walletNumber] = {
    publicKey,
    secret,
  };

  const encryptedState = encryptMessage(JSON.stringify(updatedWallets));
  localStorage.setItem("state", JSON.stringify(encryptedState));

  return updatedWallets;
}
