import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { encodeBase58 } from "ethers";
import nacl from "tweetnacl";
import { getSeed } from "../wallet";

const generateWallet = (path: string): Wallet => {
  const seed = getSeed();
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
  return {
    secret: encodeBase58(secret),
    publicKey,
  };
};

const SolanaNetwork: Network = {
  generateWallet,
  title: "Solana",
  image:
    "https://s3.amazonaws.com/app-assets.xnfts.dev/images/network-logo-replacement-solana.png",
};

export default SolanaNetwork;
