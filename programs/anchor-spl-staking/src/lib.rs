use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;

declare_id!("2RLGCgJVFCc7frbJJBFRxsXuJ3rsUKoKCg5XQ6SLzvR9");

pub const STAKE_MINT_ADDRESS: &str =
  "E64bBYwQCwFRebthbRBxc32xNRukhjyuzrKzHz2t6WUK";
pub const ORIGINAL_MINT_ADDRESS: &str =
  "GbsWfduKNoyDqpaNhGSyqkNsagVENxRXRr4vcrazw9cR";

#[program]
pub mod anchor_spl_staking {
  use super::*;

  pub fn create_original_token_account(
    ctx: Context<CreateOriginalTokenAccount>,
  ) -> Result<()> {
    create_original_token_account_handler(ctx)
  }

  pub fn stake(
    ctx: Context<Stake>,
    stake_mint_authority_bump: u8,
    program_original_token_account_bump: u8,
    token_amount: u64,
  ) -> Result<()> {
    stake_handler(
      ctx,
      stake_mint_authority_bump,
      program_original_token_account_bump,
      token_amount,
    )
  }

  pub fn unstake(
    ctx: Context<Unstake>,
    stake_mint_authority_bump: u8,
    token_amount: u64,
  ) -> Result<()> {
    unstake_handler(ctx, stake_mint_authority_bump, token_amount)
  }
}
