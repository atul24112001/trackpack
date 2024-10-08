import { decryptMessage, encryptMessage } from "./bcrypt";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";

export const _networks: { [key: string]: { title: string; image: string } } = {
  "501": {
    title: "Solana",
    image:
      "https://s3.amazonaws.com/app-assets.xnfts.dev/images/network-logo-replacement-solana.png",
  },
  "966": {
    //
    title: "Polygon",
    image: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
  },
  "60": {
    title: "Ethereum",
    image:
      "https://assets.coingecko.com/asset_platforms/images/279/large/ethereum.png",
  },
  // "0": {
  //   //
  //   title: "Polygon",
  //   image: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
  // },
};

export function _createWallet(
  seed: string,
  selectedNetwork: string,
  accountId: string,
  accountTitle: string
) {
  let walletNumber = 0;
  const state = localStorage.getItem("state");
  let accounts: null | { [key: string]: Account } = null;
  if (state) {
    const payload = decryptMessage(JSON.parse(state));
    if (payload) {
      accounts = JSON.parse(payload);
      if (accounts) {
        walletNumber =
          accounts[accountId]?.wallets?.[selectedNetwork]?.length || 0;
      }
    }
  }
  const path = `m/44'/${selectedNetwork}'/${walletNumber}'/0'`;
  const derivedSeed = derivePath(path, seed).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();

  const updatedAccounts: { [key: string]: Account } = JSON.parse(
    JSON.stringify(accounts || {})
  );
  if (!updatedAccounts[accountId]) {
    updatedAccounts[accountId] = {
      title: accountTitle,
      wallets: {},
    };
  }

  if (!updatedAccounts[accountId].wallets[selectedNetwork]) {
    updatedAccounts[accountId].wallets[selectedNetwork] = [];
  }

  updatedAccounts[accountId].wallets[selectedNetwork][walletNumber] = {
    publicKey,
    secret,
  };

  const encryptedState = encryptMessage(JSON.stringify(updatedAccounts));
  localStorage.setItem("state", JSON.stringify(encryptedState));

  console.log(updatedAccounts);
  return updatedAccounts;
}
