import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorSplStaking } from "../target/types/anchor_spl_staking";
import { createMints } from "../scripts/create-mints";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { findStakeMintAuthorityPDA, stakeMintAddress } from "../scripts/config";
import { User } from "./user";
import { expect } from "chai";

anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.AnchorSplStaking as Program<AnchorSplStaking>;

describe("anchor-spl-staking", () => {
  before(async () => {
    await createMints();
  });

  it("It swaps original token for stake token", async () => {
    const user = new User();
    await user.getOrCreateStakeTokenBag();

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
