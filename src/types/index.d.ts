type Wallet = {
  secret: Uint8Array;
  publicKey: string;
};

type Account = {
  title: string;
  wallets: {
    [key: string]: Wallet[];
  };
};
