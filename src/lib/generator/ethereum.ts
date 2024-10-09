import { HDNodeWallet, Wallet as EthWallet } from "ethers";
import { getSeed } from "../wallet";

function generateWallet(path: string): Wallet {
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

const EthereumNetwork: Network = {
  title: "Ethereum",
  image:
    "https://assets.coingecko.com/asset_platforms/images/279/large/ethereum.png",
  generateWallet,
};

export default EthereumNetwork;
