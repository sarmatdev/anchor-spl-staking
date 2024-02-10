import { PublicKey } from "@solana/web3.js";
import {
  originalMintAddress,
  stakeMintAddress,
  userWallet,
} from "../scripts/config";
import { TokenHelper } from "./token-helper";
import { Wallet } from "@coral-xyz/anchor";

class User {
  originalToken: TokenHelper;
  originalTokenAccount: PublicKey;
  stakeToken: TokenHelper;
  stakeTokenAccount: PublicKey;
  wallet: Wallet;

  constructor(wallet = userWallet) {
    this.originalToken = new TokenHelper(originalMintAddress);
    this.stakeToken = new TokenHelper(stakeMintAddress);
    this.wallet = wallet;
  }

  getOrCreateOriginalTokenAccount = async () => {
    this.originalTokenAccount = (
      await this.originalToken.getOrCreateTokenAccount(this.wallet.publicKey)
    ).address;
  };

  getOrCreateStakeTokenAccount = async () => {
    this.stakeTokenAccount = (
      await this.stakeToken.getOrCreateTokenAccount(this.wallet.publicKey)
    ).address;
  };

  originalBalance = async () => {
    return await this.originalToken.balance(this.originalTokenAccount);
  };

  stakeBalance = async () => {
    return await this.originalToken.balance(this.stakeTokenAccount);
  };
}

export { User };
