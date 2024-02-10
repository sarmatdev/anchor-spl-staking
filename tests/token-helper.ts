import { PublicKey } from "@solana/web3.js";
import {
  Account,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { connection, randomPayer } from "../scripts/config";

class TokenHelper {
  mint: PublicKey;

  constructor(mint: PublicKey) {
    this.mint = mint;
  }

  getMint = async (): Promise<PublicKey> => {
    return (await getMint(connection, this.mint)).address;
  };

  balance = async (tokenBag: PublicKey) => {
    return parseInt(
      (await connection.getTokenAccountBalance(tokenBag)).value.amount
    );
  };

  getOrCreateTokenAccount = async (
    owner: PublicKey,
    isPDA: boolean = false
  ): Promise<Account> => {
    return await getOrCreateAssociatedTokenAccount(
      connection,
      await randomPayer(),
      this.mint,
      owner,
      isPDA
    );
  };
}

export { TokenHelper };
