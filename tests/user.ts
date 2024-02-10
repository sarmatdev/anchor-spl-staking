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
  originalTokenBag: PublicKey;
  stakeToken: TokenHelper;
  stakeTokenBag: PublicKey;
  wallet: Wallet;

  constructor(wallet = userWallet) {
    this.originalToken = new TokenHelper(originalMintAddress);
    this.stakeToken = new TokenHelper(stakeMintAddress);
    this.wallet = wallet;
  }

  getOrCreateOriginalTokenBag = async () => {
    this.originalTokenBag = (
      await this.originalToken.getOrCreateTokenBag(this.wallet.publicKey)
    ).address;
  };

  getOrCreateStakeTokenBag = async () => {
    this.stakeTokenBag = (
      await this.stakeToken.getOrCreateTokenBag(this.wallet.publicKey)
    ).address;
  };

  originalBalance = async () => {
    return await this.originalToken.balance(this.originalTokenBag);
  };

  stakeBalance = async () => {
    return await this.originalToken.balance(this.stakeTokenBag);
  };
}

export { User };
