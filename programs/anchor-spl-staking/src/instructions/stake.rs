use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::STAKE_MINT_ADDRESS;

pub fn stake_handler(
  ctx: Context<Stake>,
  stake_mint_authority_bump: u8,
  token_amount: u64,
) -> Result<()> {
  let stake_amount = token_amount;

  let stake_mint_address = ctx.accounts.stake_mint.key();
  let seeds = &[stake_mint_address.as_ref(), &[stake_mint_authority_bump]];
  let signer = [&seeds[..]];

  let cpi_ctx = CpiContext::new_with_signer(
    ctx.accounts.token_program.to_account_info(),
    token::MintTo {
      mint: ctx.accounts.stake_mint.to_account_info(),
      authority: ctx.accounts.stake_mint_authority.to_account_info(),
      to: ctx.accounts.user_stake_token_bag.to_account_info(),
    },
    &signer,
  );
  token::mint_to(cpi_ctx, stake_amount)?;

  Ok(())
}

#[derive(Accounts)]
#[instruction(stake_mint_authority_bump: u8)]
pub struct Stake<'info> {
  pub token_program: Program<'info, Token>,
  #[account(mut, address = STAKE_MINT_ADDRESS.parse::<Pubkey>().unwrap())]
  pub stake_mint: Account<'info, Mint>,
  #[account(seeds = [ stake_mint.key().as_ref() ], bump = stake_mint_authority_bump)]
  /// CHECK: only used as a signing PDA
  pub stake_mint_authority: UncheckedAccount<'info>,
  #[account(mut)]
  pub user_stake_token_bag: Account<'info, TokenAccount>,
}
