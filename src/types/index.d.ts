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
};

type AccountDetails = {
  id: string;
  name: string;
  accountType: AccountType;
  network: string;
};

type Token = { address: string; balance: number; decimals: number };
type Balance = { amount: number; decimal: number };

type AccountType = "multi-chain" | "single-chain";
type TransferStatus = "not-initiated" | "processing" | "failed" | "success";
