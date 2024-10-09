type Wallet = {
  secret: string;
  publicKey: string;
};

type Account = {
  title: string;
  wallets: {
    [key: string]: Wallet[];
  };
};

type Network = {
  title: string;
  image: string;
  generateWallet: (path: string) => Wallet;
};
