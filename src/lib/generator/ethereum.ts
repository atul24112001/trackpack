import {
  HDNodeWallet,
  Wallet as EthWallet,
  ethers,
  JsonRpcProvider,
  isAddress,
} from "ethers";
import { getSeed } from "../wallet";

let devnetConnection: JsonRpcProvider | null = null;
let mainnetConnection: JsonRpcProvider | null = null;

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

function getConnection() {
  const network = "mainnet"; //localStorage.getItem("mode") ||
  if (network === "mainnet") {
    if (!mainnetConnection) {
      mainnetConnection = new JsonRpcProvider(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      );
    }
    return mainnetConnection;
  }

  if (!devnetConnection) {
    devnetConnection = new JsonRpcProvider(
      `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
  }

  return devnetConnection;
}

function generateHDWallet(path: string): Wallet {
  const seed = getSeed();
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(path);
  const privateKey = child.privateKey;
  const wallet = new EthWallet(privateKey);
  return {
    publicKey: wallet.address,
    secret: privateKey,
  };
}

async function getBalance(publicKey: string): Promise<Balance> {
  const balanceInWei: any = await getConnection().getBalance(publicKey);
  const balanceInEther = ethers.formatEther(balanceInWei);
  return {
    amount: parseInt(balanceInEther),
    decimal: 18,
  };
}

async function getTokens(walletAddress: string): Promise<Token[]> {
  const tokenAddresses: string[] =
    JSON.parse(localStorage.getItem("selected-tokens") || "{}").ethers || [];

  const balances = await Promise.all(
    tokenAddresses.map(async (tokenAddress) => {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        getConnection()
      );
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      const readableBalance = ethers.formatUnits(balance, decimals);
      return {
        address: tokenAddress,
        balance: parseInt(readableBalance),
        decimals,
        owner: "",
        metadata: {
          name: "",
          symbol: "",
        },
      };
    })
  );

  return balances;
}

async function isValidPublicKey(key: string) {
  return isAddress(key);
}

async function transfer() {
  return "";
}

async function transferToken() {
  return "";
}

async function mintYourToken(
  mint: string,
  senderSecretKey: string,
  amount: number
) {
  console.log({ mint, senderSecretKey, amount });
}

async function createNewToken(senderSecretKey: string, decimals: number) {
  console.log({ senderSecretKey, decimals });
}

async function requestAirdrop() {}

const EthereumNetwork: Network = {
  title: "Ethereum",
  smallestUnit: "Wei",
  unit: "ETH",
  image:
    "https://assets.coingecko.com/asset_platforms/images/279/large/ethereum.png",
  generateHDWallet,
  getBalance,
  getTokens,
  generateSingleChainWallet: generateHDWallet,
  isValidPublicKey,
  transfer,
  transferToken,
  createNewToken,
  mintYourToken,
  requestAirdrop,
};

export default EthereumNetwork;
