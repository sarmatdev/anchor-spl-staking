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

  it("It creates the program 🐮💰 beef token bag", async () => {
    const user = new User();
    const [original, _] = await getProgramOriginalTokenAccountPDA();

    await program.methods
      .createOriginalTokenAccount()
      .accounts({
        originalMint: originalMintAddress,
        programOriginalTokenAccount: original,
        payer: user.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const tokenHelper = new TokenHelper(originalMintAddress);
    expect(await tokenHelper.balance(original)).to.be.eql(0);
  });

  it("It swaps original token for stake token", async () => {
    const user = new User();
    await user.getOrCreateStakeTokenAccount();

    const userStakes = await user.stakeBalance();
    const [stakePDA, stakePDABump] = await findStakeMintAuthorityPDA();

    await program.methods
      .stake(stakePDABump, new anchor.BN(5000))
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        stakeMint: stakeMintAddress,
        stakeMintAuthority: stakePDA,
        userStakeTokenBag: user.stakeTokenBag,
      })
      .rpc();

    expect(await user.stakeBalance()).to.be.eql(userStakes + 5_000);
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
