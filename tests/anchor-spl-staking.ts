import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorSplStaking } from "../target/types/anchor_spl_staking";
import { createMints } from "../scripts/create-mints";
import { airdropToken } from "../scripts/airdrop-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  findStakeMintAuthorityPDA,
  originalMintAddress,
  stakeMintAddress,
} from "../scripts/config";
import { User } from "./user";
import { expect } from "chai";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { TokenHelper } from "./token-helper";

anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.AnchorSplStaking as Program<AnchorSplStaking>;

describe("anchor-spl-staking", () => {
  before(async () => {
    await createMints();
    await airdropToken();
  });

  it("It creates the program original token account", async () => {
    const user = new User();
    const [originalPDA, _] = await getProgramOriginalTokenAccountPDA();

    try {
      await program.methods
        .createOriginalTokenAccount()
        .accounts({
          originalMint: originalMintAddress,
          programOriginalTokenAccount: originalPDA,
          payer: user.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();
    } catch (error) {
      console.log(error);
    }

    const tokenHelper = new TokenHelper(originalMintAddress);
    expect(await tokenHelper.balance(originalPDA)).to.be.eql(0);
  });

  it("It swaps original token for stake token", async () => {
    const user = new User();
    await user.getOrCreateStakeTokenAccount();
    await user.getOrCreateOriginalTokenAccount();

    const userStakes = await user.stakeBalance();
    const [stakePDA, stakePDABump] = await findStakeMintAuthorityPDA();

    const [originalTokenAccountPDA, originalTokenAccountBump] =
      await getProgramOriginalTokenAccountPDA();

    try {
      await program.methods
        .stake(stakePDABump, originalTokenAccountBump, new anchor.BN(5000))
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          stakeMint: stakeMintAddress,
          stakeMintAuthority: stakePDA,
          userStakeTokenAccount: user.stakeTokenAccount,
          userOriginalTokenAccount: user.originalTokenAccount,
          userOriginalTokenAccountAuthority: user.wallet.publicKey,
          programOriginalTokenAccount: originalTokenAccountPDA,
          originalMint: originalMintAddress,
        })
        .rpc();
    } catch (error) {
      console.log(error);
    }

    expect(await user.stakeBalance()).to.be.eql(userStakes + 5_000);
  });
  it("It redeems stake for original token", async () => {
    const user = new User();
    await user.getOrCreateStakeTokenAccount();
    await user.getOrCreateOriginalTokenAccount();

    const [originalAccountPDA, originalAccountBump] =
      await getProgramOriginalTokenAccountPDA();

    const userStakes = await user.stakeBalance();
    const userBeefs = await user.originalBalance();

    try {
      await program.methods
        .unstake(originalAccountBump, new anchor.BN(5_000))
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          stakeMint: stakeMintAddress,
          userStakeTokenAccount: user.stakeTokenAccount,
          userStakeTokenAccountAuthority: user.wallet.publicKey,
          programOriginalTokenAccount: originalAccountPDA,
          userOriginalTokenAccount: user.originalTokenAccount,
          originalMint: originalMintAddress,
        })
        .rpc();
    } catch (error) {
      console.log(error);
    }

    expect(await user.stakeBalance()).to.be.eql(userStakes - 5_000);
    expect(await user.originalBalance()).to.be.eql(userBeefs + 5_000);
  });
});

const getProgramOriginalTokenAccountPDA = async (): Promise<
  [PublicKey, number]
> => {
  const seed = originalMintAddress;

  return await PublicKey.findProgramAddress(
    [seed.toBuffer()],
    program.programId
  );
};
