use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;

declare_id!("2RLGCgJVFCc7frbJJBFRxsXuJ3rsUKoKCg5XQ6SLzvR9");

pub const STAKE_MINT_ADDRESS: &str =
  "E64bBYwQCwFRebthbRBxc32xNRukhjyuzrKzHz2t6WUK";

#[program]
pub mod anchor_spl_staking {
  use super::*;

  pub fn stake(
    ctx: Context<Stake>,
    stake_mint_authority_bump: u8,
    token_amount: u64,
  ) -> Result<()> {
    stake_handler(ctx, stake_mint_authority_bump, token_amount)
  }
}
