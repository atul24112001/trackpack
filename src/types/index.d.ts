type Wallet = {
  secret: string;
  publicKey: string;
};

type Account = {
  title: string;
  type: AccountType;
  wallets: {
    [key: string]: Wallet[];
  };
};

type Network = {
  title: string;
  image: string;
  smallestUnit: string;
  unit: string;
  getBalance: (publicKey: string) => Promise<Balance>;
  generateHDWallet: (path: string) => Wallet;
  generateSingleChainWallet: (path: string) => Wallet;
  getTokens: (publicKey: string) => Promise<Token[]>;
  isValidPublicKey: (publicKey: string) => Promise<boolean>;
  mintYourToken: (
    mint: string,
    senderSecretKey: string,
    amount: number
  ) => Promise<any>;
  createNewToken: (
    senderSecretKey: string,
    decimals: number,
    name: string,
    symbol: string,
    uri: string
  ) => Promise<any>;
  transfer: (
    recipientPublicKey: string,
    amountInSmallestUnit: number,
    senderSecretKey: string
  ) => Promise<string>;
  transferToken: (
    recipientPublicKey: string,
    amountInSmallestUnit: number,
    senderSecretKey: string,
    mint: string
  ) => Promise<string>;
  requestAirdrop: (senderSecretKey: string, amount: number) => Promise<void>;
};

type AccountDetails = {
  id: string;
  name: string;
  accountType: AccountType;
  network: string;
};

type Token = {
  address: string;
  balance: number;
  decimals: number;
  owner: string;
  metadata: Metadata;
};
type Balance = { amount: number; decimal: number };

type AccountType = "multi-chain" | "single-chain";
type TransferStatus = "not-initiated" | "processing" | "failed" | "success";

type Metadata = {
  name: string;
  symbol: string;
  image?: string;
};
