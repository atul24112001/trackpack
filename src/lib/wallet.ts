import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { decryptMessage, encryptMessage } from "./bcrypt";
import EthereumNetwork from "./generator/ethereum";
import SolanaNetwork from "./generator/solana";

export const _networks: { [key: string]: Network } = {
  "501": SolanaNetwork,
  // "966": {
  //   title: "Polygon",
  //   image: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
  // },
  "60": EthereumNetwork,
};

export function _createWallet(
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
  const network = _networks[selectedNetwork];
  const { publicKey, secret } = network.generateWallet(path);

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
  localStorage.setItem("network", selectedNetwork);
  return updatedAccounts;
}

export const getSeed = () => {
  const mnemonicExists = localStorage.getItem("mnemonic");
  const mnemonic = mnemonicExists
    ? decryptMessage(JSON.parse(mnemonicExists))
    : generateMnemonic();

  console.log({ mnemonic });
  const seed = mnemonicToSeedSync(mnemonic);
  return seed;
};
