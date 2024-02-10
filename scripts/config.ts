import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AnchorSplStaking } from "../target/types/anchor_spl_staking";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import * as anchor from "@coral-xyz/anchor";

anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace
  .AnchorSplStaking as anchor.Program<AnchorSplStaking>;
const connection = anchor.getProvider().connection;
const userWallet = anchor.workspace.AnchorSplStaking.provider.wallet;

const randomPayer = async (lamports = LAMPORTS_PER_SOL) => {
  const wallet = Keypair.generate();
  const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
  await connection.confirmTransaction(signature);
  return wallet;
};

const findOriginalMintAuthorityPDA = async (): Promise<[PublicKey, number]> => {
  return await getProgramDerivedAddress(originalMintAddress);
};

const findStakeMintAuthorityPDA = async (): Promise<[PublicKey, number]> => {
  return await getProgramDerivedAddress(stakeMintAddress);
};

const getProgramDerivedAddress = async (
  seed: PublicKey
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync([seed.toBuffer()], program.programId);
};

const originalData = JSON.parse(
  fs.readFileSync(".keys/original_mint.json").toString()
);
const originalMintKeypair = Keypair.fromSecretKey(new Uint8Array(originalData));
const originalMintAddress = originalMintKeypair.publicKey;

const stakeData = JSON.parse(
  fs.readFileSync(".keys/stake_mint.json").toString()
);
const stakeMintKeypair = Keypair.fromSecretKey(new Uint8Array(stakeData));
const stakeMintAddress = stakeMintKeypair.publicKey;

export {
  program,
  connection,
  userWallet,
  randomPayer,
  originalMintKeypair,
  originalMintAddress,
  stakeMintKeypair,
  stakeMintAddress,
  findOriginalMintAuthorityPDA,
  findStakeMintAuthorityPDA,
};
