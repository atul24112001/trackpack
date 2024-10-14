import {
  Keypair,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { getSeed } from "../wallet";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
  getMint,
} from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";

let devnetConnection: Connection | null = null;
let mainnetConnection: Connection | null = null;

function getConnection() {
  const network = localStorage.getItem("mode") || "mainnet";
  if (network === "mainnet") {
    if (!mainnetConnection) {
      mainnetConnection = new Connection(
        `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      );
    }
    return mainnetConnection;
  }

  if (!devnetConnection) {
    devnetConnection = new Connection(
      "https://api.devnet.solana.com"
      // "http://127.0.0.1:8899"
      // `https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
  }

  return devnetConnection;
}

const generateHDWallet = (path: string): Wallet => {
  const seed = getSeed();
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
  return {
    secret: JSON.stringify(secret),
    publicKey,
  };
};

const generateSingleChainWallet = (): Wallet => {
  const seed = getSeed();
  const seed32 = seed.slice(0, 32);
  const secret = nacl.sign.keyPair.fromSeed(seed32).secretKey;
  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
  return {
    publicKey,
    secret: JSON.stringify(secret),
  };
};

async function getBalance(walletAddress: string): Promise<Balance> {
  const publicKey = new PublicKey(walletAddress);
  const balance = await getConnection().getBalance(publicKey);
  return {
    amount: balance,
    decimal: 9,
  };
}

async function getTokens(walletAddress: string): Promise<Token[]> {
  const publicKey = new PublicKey(walletAddress);
  const tokenAccounts = await getConnection().getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }
  );

  const tokens = await Promise.all(
    tokenAccounts.value.map(async ({ account }) => {
      const accountInfo = account.data.parsed.info;
      const balance = parseInt(accountInfo.tokenAmount.amount);
      const mint = accountInfo.mint;
      console.log({ mint });
      const mintAddress = new PublicKey(mint);
      const mintInfo = await getMint(getConnection(), mintAddress);

      const metaplex = Metaplex.make(getConnection());
      const metadataAccount = metaplex
        .nfts()
        .pdas()
        .metadata({ mint: mintAddress });

      const metadataAccountInfo = await getConnection().getAccountInfo(
        metadataAccount
      );

      const metadata: Metadata = {
        name: "Unknown Token",
        symbol: mintAddress.toBase58(),
      };

      if (metadataAccountInfo) {
        const token = await metaplex
          .nfts()
          .findByMint({ mintAddress: mintAddress });
        console.log({ token });
        metadata.name = token.name;
        metadata.symbol = token.symbol;
        metadata.image = token.json?.image;
      }

      return {
        owner: mintInfo.mintAuthority?.toBase58() || "",
        address: mint,
        balance,
        decimals: accountInfo.tokenAmount.decimals,
        metadata,
      };
    })
  );

  return tokens;
}

async function transferToken(
  recipientPublicKey: string,
  amountInSmallestUnit: number,
  senderSecretKey: string,
  mint: string
) {
  const _secret = new Uint8Array(Object.values(JSON.parse(senderSecretKey)));

  const senderKeypair = Keypair.fromSecretKey(_secret);
  const _recipientPublicKey = new PublicKey(recipientPublicKey);
  const tokenMintAddress = new PublicKey(mint);

  const connection = getConnection();
  const latestBlockhash = await connection.getLatestBlockhash();

  const senderTokenAddress = await getAssociatedTokenAddress(
    tokenMintAddress,
    senderKeypair.publicKey
  );

  const recipientTokenAddress = await getOrCreateAssociatedTokenAccount(
    getConnection(),
    senderKeypair,
    tokenMintAddress,
    _recipientPublicKey
  );

  const transferInstruction = createTransferInstruction(
    senderTokenAddress,
    recipientTokenAddress.address,
    senderKeypair.publicKey,
    amountInSmallestUnit
  );

  const transaction = new Transaction();
  transaction.add(transferInstruction);

  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.feePayer = senderKeypair.publicKey;

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [senderKeypair],
    {
      skipPreflight: true,
      maxRetries: 4,
      preflightCommitment: "processed",
    }
  );

  return signature;
}

async function mintYourToken(
  mint: string,
  senderSecretKey: string,
  amount: number
) {
  const _secret = new Uint8Array(Object.values(JSON.parse(senderSecretKey)));
  const wallet = Keypair.fromSecretKey(_secret);
  const _mint = new PublicKey(mint);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    getConnection(),
    wallet,
    _mint,
    wallet.publicKey
  );

  await mintTo(
    getConnection(),
    wallet,
    tokenAccount.mint,
    tokenAccount.address,
    wallet.publicKey,
    amount
  );
}

async function createNewToken(senderSecretKey: string, decimals: number) {
  const _secret = new Uint8Array(Object.values(JSON.parse(senderSecretKey)));
  const wallet = Keypair.fromSecretKey(_secret);
  const mint = await createMint(
    getConnection(),
    wallet,
    wallet.publicKey,
    wallet.publicKey,
    decimals
  );

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    getConnection(),
    wallet,
    mint,
    wallet.publicKey
  );
  return tokenAccount;
}

// async function updateTokenMetaData() {
//   // if (metaData) {
//   //   const metaplex = Metaplex.make(getConnection())
//   //     .use(keypairIdentity(wallet))
//   //     // .use(bundlrStorage());
//   //   const { nft } = await metaplex.nfts().create({
//   //     uri: metaData,
//   //     name: "My Custom Token",
//   //     symbol: "MCT",
//   //     sellerFeeBasisPoints: 500, // 5% royalty (optional)
//   //     updateAuthority: wallet,
//   //     useExistingMint: mint
//   //   });
//   // }
// }

async function transfer(
  recipientPublicKey: string,
  amountInSmallestUnit: number,
  senderSecretKey: string
) {
  const _secret = new Uint8Array(Object.values(JSON.parse(senderSecretKey)));
  const senderKeypair = Keypair.fromSecretKey(_secret);
  const _recipientPublicKey = new PublicKey(recipientPublicKey);
  const transfer = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: _recipientPublicKey,
    lamports: amountInSmallestUnit,
  });
  const transaction = new Transaction();
  transaction.add(transfer);

  const signature = await sendAndConfirmTransaction(
    getConnection(),
    transaction,
    [senderKeypair]
  );
  return signature;
}

async function isValidPublicKey(key: string) {
  try {
    new PublicKey(key);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function requestAirdrop(senderSecretKey: string, amount: number) {
  const connection = getConnection();
  const _secret = new Uint8Array(Object.values(JSON.parse(senderSecretKey)));
  const wallet = Keypair.fromSecretKey(_secret);
  const signature = await connection.requestAirdrop(
    wallet.publicKey,
    amount * LAMPORTS_PER_SOL
  );
  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    signature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  });
}

const SolanaNetwork: Network = {
  title: "Solana",
  smallestUnit: "Lamport",
  unit: "SOL",
  image:
    "https://s3.amazonaws.com/app-assets.xnfts.dev/images/network-logo-replacement-solana.png",
  generateHDWallet,
  getBalance,
  getTokens,
  generateSingleChainWallet,
  isValidPublicKey,
  transfer,
  transferToken,
  createNewToken,
  mintYourToken,
  requestAirdrop,
};

export default SolanaNetwork;
