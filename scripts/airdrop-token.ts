import { mintTo } from "@solana/spl-token";
import { originalMintKeypair, connection, randomPayer } from "./config";
import { TokenHelper } from "../tests/token-helper";
import { User } from "../tests/user";

const airdropToken = async () => {
  const user = new User();
  await user.getOrCreateOriginalTokenAccount();

  await mintTo(
    connection,
    await randomPayer(),
    originalMintKeypair.publicKey,
    user.originalTokenAccount,
    originalMintKeypair,
    1_000_000_000,
    []
  );

  const balance = await new TokenHelper(originalMintKeypair.publicKey).balance(
    user.originalTokenAccount
  );

  console.log(`Original Token Account balance: ${balance}`);
};

export { airdropToken };
